import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { voiceTrunks } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, trunkId, name, sipUrl } = body;

    if (!userId || !trunkId || !name || !sipUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create voice trunk
    await db.insert(voiceTrunks).values({
      userId,
      trunkId,
      name,
      sipUrl,
      status: 'active',
    });

    return NextResponse.json({
      success: true,
      message: "Voice trunk created successfully",
    });
  } catch (error: any) {
    console.error("Voice trunk creation error:", error);
    return NextResponse.json(
      { error: "Failed to create voice trunk", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const trunks = await db.query.voiceTrunks.findMany({
      where: eq(voiceTrunks.userId, parseInt(userId)),
    });

    return NextResponse.json(trunks);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch voice trunks", details: error.message },
      { status: 500 }
    );
  }
}
