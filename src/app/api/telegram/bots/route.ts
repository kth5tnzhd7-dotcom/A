import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { telegramBots, botCommands } from '@/lib/schema';
import { sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, botUsername, token, customDomainId, userId } = body;

    if (!name || !botUsername || !token || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.insert(telegramBots).values({
      userId,
      name,
      botUsername,
      token,
      customDomainId,
      chatId: null,
      webhookUrl: null,
      isActive: true,
      messagesSent: 0,
    });

    return NextResponse.json({
      id: result.lastInsertRowid,
      name,
      botUsername,
      customDomainId,
      isActive: true,
      messagesSent: 0,
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create Telegram bot:', error);
    return NextResponse.json(
      { error: 'Failed to create Telegram bot' },
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

    const bots = await db.query.telegramBots.findMany({
      where: (bots, { eq }) => eq(bots.userId, parseInt(userId)),
      orderBy: (bots, { desc }) => [desc(bots.createdAt)],
    });

    return NextResponse.json(bots);
  } catch (error) {
    console.error('Failed to fetch Telegram bots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bots' },
      { status: 500 }
    );
  }
}
