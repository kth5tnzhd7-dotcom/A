import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const settings = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.userId, parseInt(userId)),
    });

    return NextResponse.json(settings || {
      siteName: "Exoincs",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, logoUrl, faviconUrl, backgroundUrl, siteName, primaryColor, secondaryColor } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const existing = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.userId, userId),
    });

    if (existing) {
      await db.update(siteSettings)
        .set({ logoUrl, faviconUrl, backgroundUrl, siteName, primaryColor, secondaryColor })
        .where(eq(siteSettings.userId, userId));
    } else {
      await db.insert(siteSettings).values({
        userId,
        logoUrl,
        faviconUrl,
        backgroundUrl,
        siteName: siteName || "Exoincs",
        primaryColor: primaryColor || "#3B82F6",
        secondaryColor: secondaryColor || "#10B981",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
