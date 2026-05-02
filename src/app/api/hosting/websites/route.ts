import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hostedWebsites, websiteFiles, customDomains } from '@/lib/schema';
import { sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const subdomain = formData.get('subdomain') as string;
    const customDomainId = formData.get('customDomainId') as string;
    const files = formData.getAll('files') as File[];
    const userId = parseInt(formData.get('userId') as string);

    if (!name || !subdomain || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const website = await db.transaction(async (tx) => {
      const [result] = await tx.insert(hostedWebsites).values({
        userId,
        name,
        subdomain,
        customDomainId: customDomainId ? parseInt(customDomainId) : null,
        storageUsed: 0,
        bandwidthUsed: 0,
        status: 'active',
      });

      const websiteId = result.lastInsertRowid as number;

      if (files && files.length > 0) {
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          await tx.insert(websiteFiles).values({
            websiteId,
            path: file.name.startsWith('/') ? file.name : `/${file.name}`,
            content: buffer,
            contentType: file.type || 'application/octet-stream',
            size: buffer.length,
          });
        }
      }

      return { ...result, id: websiteId };
    });

    return NextResponse.json({
      id: website.id,
      name,
      subdomain,
      customDomainId: customDomainId || null,
      status: 'active',
      url: `https://${subdomain}.hosted.test`,
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create hosted website:', error);
    return NextResponse.json(
      { error: 'Failed to create hosted website' },
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

    const websites = await db.query.hostedWebsites.findMany({
      where: (websites, { eq }) => eq(websites.userId, parseInt(userId)),
      orderBy: (websites, { desc }) => [desc(websites.createdAt)],
      with: {
        customDomain: true,
        files: true,
      },
    });

    return NextResponse.json(websites);
  } catch (error) {
    console.error('Failed to fetch hosted websites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch websites' },
      { status: 500 }
    );
  }
}
