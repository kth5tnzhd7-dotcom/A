import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shortenedUrls } from '@/lib/schema';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { originalUrl, customDomain, customDomainId, expiresAt, userId } = body;

    if (!originalUrl || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const shortCode = nanoid(8);
    const baseUrl = customDomain || process.env.DEFAULT_SHORT_DOMAIN || 'short.ly';
    const shortUrl = `${baseUrl}/${shortCode}`;

    const expiresAtDate = expiresAt 
      ? new Date(expiresAt)
      : undefined;

    const result = await db.insert(shortenedUrls).values({
      userId,
      originalUrl,
      shortCode,
      customDomainId,
      expiresAt: expiresAtDate,
    });

    return NextResponse.json({
      id: result.lastInsertRowid,
      originalUrl,
      shortCode,
      shortUrl,
      createdAt: Date.now(),
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create shortened URL:', error);
    return NextResponse.json(
      { error: 'Failed to create shortened URL' },
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

    const urls = await db.query.shortenedUrls.findMany({
      where: (urls, { eq }) => eq(urls.userId, parseInt(userId)),
      orderBy: (urls, { desc }) => [desc(urls.createdAt)],
    });

    return NextResponse.json(urls);
  } catch (error) {
    console.error('Failed to fetch shortened URLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
}