import { db } from '../db';
import { smsCampaigns, smsRecipients } from '../schema';
import { sql, eq, and } from 'drizzle-orm';

interface BirdSMSResponse {
  id: string;
  status: string;
  recipients: number;
}

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

async function sendViaBird(
  senderId: string,
  message: string,
  recipients: string[]
): Promise<BirdSMSResponse> {
  const apiKey = process.env.BIRD_API_KEY;
  const apiUrl = process.env.BIRD_API_URL || 'https://api.bird.com';

  if (!apiKey) {
    throw new Error('Bird.com API key not configured');
  }

  const response = await fetch(`${apiUrl}/workspaces/{process.env.BIRD_WORKSPACE_ID}/channels/{senderId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      receiver: recipients.map(phone => ({ id: phone })),
      body: {
        type: 'text',
        text: message,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Bird.com API error: ${error.message || 'Unknown error'}`);
  }

  return response.json();
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
   * Process an SMS campaign - send messages to all recipients via Bird.com
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

    try {
      // Send via Bird.com API
      const phoneNumbers = recipients.map(r => r.phoneNumber);
      const result = await sendViaBird(
        campaign.senderId,
        campaign.message,
        phoneNumbers
      );

      // Update recipients as sent
      for (const recipient of recipients) {
        await db
          .update(smsRecipients)
          .set({
            status: 'sent',
            sentAt: new Date(),
          })
          .where(sql`${smsRecipients.id} = ${recipient.id}`);
      }

      // Update campaign stats
      await db
        .update(smsCampaigns)
        .set({
          sentCount: sql`${smsCampaigns.sentCount} + ${recipients.length}`,
          status: 'completed',
          completedAt: new Date(),
        })
        .where(sql`${smsCampaigns.id} = ${campaignId}`);
    } catch (error) {
      // Update failed recipients
      for (const recipient of recipients) {
        await db
          .update(smsRecipients)
          .set({ status: 'failed' })
          .where(sql`${smsRecipients.id} = ${recipient.id}`);
      }

      await db
        .update(smsCampaigns)
        .set({
          failedCount: sql`${smsCampaigns.failedCount} + ${recipients.length}`,
        })
        .where(sql`${smsCampaigns.id} = ${campaignId}`);
    }

    return { successCount: recipients.length, failedCount: 0 };
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
