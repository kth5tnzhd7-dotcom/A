import { Twilio } from 'twilio';
import { db } from '../db';
import { smsCampaigns, smsRecipients } from '../schema';
import { sql, eq, and } from 'drizzle-orm';

// Initialize Twilio client
const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID || '',
  process.env.TWILIO_AUTH_TOKEN || ''
);

export interface CreateCampaignInput {
  userId: number;
  name: string;
  senderId: string;
  message: string;
  recipients: string[];
  scheduledAt?: Date;
}

export interface CampaignStats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
}

export class SMSService {
  /**
   * Create a new SMS campaign
   */
  async createCampaign(input: CreateCampaignInput) {
    const campaign = await db.transaction(async (tx) => {
      // Insert campaign
      const result = await tx.insert(smsCampaigns).values({
        userId: input.userId,
        name: input.name,
        senderId: input.senderId,
        message: input.message,
        totalRecipients: input.recipients.length,
        status: input.scheduledAt ? 'pending' : 'sending',
        scheduledAt: input.scheduledAt ? input.scheduledAt : undefined,
        cost: input.recipients.length * 0.0075, // $0.0075 per SMS
      });

      // Insert recipients
      const recipientValues = input.recipients.map(phone => ({
        campaignId: result.lastInsertRowid as number,
        phoneNumber: phone,
        status: 'pending' as const,
      }));

      await tx.insert(smsRecipients).values(recipientValues);

      return {
        id: result.lastInsertRowid as number,
      };
    });

    // Start processing if not scheduled
    if (!input.scheduledAt) {
      this.processCampaign(campaign.id).catch(console.error);
    }

    return campaign;
  }

  /**
   * Process an SMS campaign - send messages to all recipients
   */
  async processCampaign(campaignId: number) {
    const campaign = await db.query.smsCampaigns.findFirst({
      where: (campaigns, { eq }) => eq(campaigns.id, campaignId),
    });

    if (!campaign || campaign.status === 'completed') {
      throw new Error('Campaign not found or already completed');
    }

    // Update campaign status to sending
    await db
      .update(smsCampaigns)
      .set({ status: 'sending' })
      .where(sql`${smsCampaigns.id} = ${campaignId}`);

    // Get pending recipients
    const recipients = await db.query.smsRecipients.findMany({
      where: (recipients, { eq, and }) =>
        and(
          eq(recipients.campaignId, campaignId),
          eq(recipients.status, 'pending')
        ),
      limit: 100, // Batch size
    });

    // Send messages in parallel with rate limiting
    const results = await Promise.allSettled(
      recipients.map((recipient) =>
        this.sendSMS(campaignId, recipient.id, recipient.phoneNumber, campaign.message)
      )
    );

    // Update campaign stats
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failedCount = results.filter(r => r.status === 'rejected').length;

    await db
      .update(smsCampaigns)
      .set({
        sentCount: sql`${smsCampaigns.sentCount} + ${successCount}`,
        failedCount: sql`${smsCampaigns.failedCount} + ${failedCount}`,
      })
      .where(sql`${smsCampaigns.id} = ${campaignId}`);

    // Check if campaign is complete
    const remaining = await db.select({ count: sql<number>`count(*)` })
      .from(smsRecipients)
      .where(
        and(
          eq(smsRecipients.campaignId, campaignId),
          eq(smsRecipients.status, 'pending')
        )
      );

    if (remaining[0].count === 0) {
      await db
        .update(smsCampaigns)
        .set({
          status: 'completed',
          completedAt: new Date(),
        })
        .where(sql`${smsCampaigns.id} = ${campaignId}`);
    }

    return { successCount, failedCount };
  }

  /**
   * Send a single SMS message
   */
  private async sendSMS(
    campaignId: number,
    recipientId: number,
    phoneNumber: string,
    message: string
  ) {
    try {
      const result = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER || '',
        to: phoneNumber,
      });

      await db
        .update(smsRecipients)
        .set({
          status: result.status === 'delivered' ? 'delivered' : 'sent',
          sentAt: new Date(),
          ...(result.status === 'delivered' ? { deliveredAt: new Date() } : {}),
        })
        .where(sql`${smsRecipients.id} = ${recipientId}`);

      return result;
    } catch (error) {
      await db
        .update(smsRecipients)
        .set({
          status: 'failed',
        })
        .where(sql`${smsRecipients.id} = ${recipientId}`);

      throw error;
    }
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(campaignId: number): Promise<CampaignStats> {
    const recipients = await db.query.smsRecipients.findMany({
      where: (recipients, { eq }) => eq(recipients.campaignId, campaignId),
    });

    const stats: CampaignStats = {
      total: recipients.length,
      sent: recipients.filter(r => r.status === 'sent').length,
      delivered: recipients.filter(r => r.status === 'delivered').length,
      failed: recipients.filter(r => r.status === 'failed').length,
      pending: recipients.filter(r => r.status === 'pending').length,
    };

    return stats;
  }

  /**
   * Get all campaigns for a user
   */
  async getUserCampaigns(userId: number) {
    const campaigns = await db.query.smsCampaigns.findMany({
      where: (campaigns, { eq }) => eq(campaigns.userId, userId),
      orderBy: (campaigns, { desc }) => [desc(campaigns.createdAt)],
      with: {
        recipients: true,
      },
    });

    return campaigns;
  }
}
