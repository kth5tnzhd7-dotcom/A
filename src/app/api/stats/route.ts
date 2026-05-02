import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shortenedUrls, smsCampaigns, hostedWebsites, telegramBots } from "@/lib/schema";
import { count, eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(userId);

    // Get real-time stats
    const [urlCount] = await db
      .select({ count: count() })
      .from(shortenedUrls)
      .where(eq(shortenedUrls.userId, userIdNum));

    const [smsCount] = await db
      .select({ count: count() })
      .from(smsCampaigns)
      .where(eq(smsCampaigns.userId, userIdNum));

    const [websiteCount] = await db
      .select({ count: count() })
      .from(hostedWebsites)
      .where(eq(hostedWebsites.userId, userIdNum));

    const [botCount] = await db
      .select({ count: count() })
      .from(telegramBots)
      .where(eq(telegramBots.userId, userIdNum));

    // Get recent activity
    const recentUrls = await db.query.shortenedUrls.findMany({
      where: eq(shortenedUrls.userId, userIdNum),
      orderBy: [desc(shortenedUrls.createdAt)],
      limit: 5,
    });

    const recentCampaigns = await db.query.smsCampaigns.findMany({
      where: eq(smsCampaigns.userId, userIdNum),
      orderBy: [desc(smsCampaigns.createdAt)],
      limit: 5,
    });

    return NextResponse.json({
      stats: {
        urls: urlCount.count,
        smsCampaigns: smsCount.count,
        websites: websiteCount.count,
        bots: botCount.count,
      },
      recentActivity: {
        urls: recentUrls,
        campaigns: recentCampaigns,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Real-time stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error.message },
      { status: 500 }
    );
  }
}
