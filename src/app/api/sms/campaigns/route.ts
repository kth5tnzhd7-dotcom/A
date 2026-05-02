import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { smsCampaigns, smsRecipients } from '@/lib/schema';
import { sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, senderId, message, recipients, scheduledAt, userId } = body;

    if (!name || !senderId || !message || !recipients || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Recipients must be a non-empty array' },
        { status: 400 }
      );
    }

    const cost = recipients.length * 0.0075; // $0.0075 per SMS

    const campaign = await db.transaction(async (tx) => {
      const result = await tx.insert(smsCampaigns).values({
        userId: userId as number,
        name,
        senderId,
        message,
        totalRecipients: recipients.length,
        sentCount: 0,
        failedCount: 0,
        status: scheduledAt ? 'pending' : 'sending',
        cost,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      });

      const recipientValues = recipients.map((phoneNumber: string) => ({
        campaignId: result.lastInsertRowid as number,
        phoneNumber,
        status: 'pending' as const,
      }));

      await tx.insert(smsRecipients).values(recipientValues);

      return { id: result.lastInsertRowid as number, status: scheduledAt ? 'pending' : 'sending' };
    });

    return NextResponse.json({
      id: campaign.id,
      name,
      senderId,
      message,
      totalRecipients: recipients.length,
      cost,
      scheduledAt: scheduledAt || null,
      status: campaign.status,
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create SMS campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create SMS campaign' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const campaigns = await db.query.smsCampaigns.findMany({
      where: (campaigns, { eq }) => eq(campaigns.userId, parseInt(userId)),
      orderBy: (campaigns, { desc }) => [desc(campaigns.createdAt)],
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to fetch SMS campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}