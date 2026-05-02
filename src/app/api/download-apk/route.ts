import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
    const userId = decoded.userId;

    // Get user info
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate APK metadata (mock for now - in production, serve actual APK file)
    const apkInfo = {
      fileName: "Exoincs-app.apk",
      version: "1.0.0",
      size: "25 MB",
      downloadUrl: `/api/download-apk?token=${token}&file=Exoincs-app.apk`,
      description: "Exoincs Android Application - Manage all your services on the go!",
      permissions: [
        "Internet access",
        "Read phone state",
        "Send SMS",
        "Receive SMS",
      ],
      features: [
        "URL Shortener management",
        "Bulk SMS campaign creation",
        "Website hosting control",
        "Telegram bot management",
        "Real-time analytics",
      ],
    };

    return NextResponse.json(apkInfo);
  } catch (error: any) {
    console.error("APK info error:", error);
    return NextResponse.json(
      { error: "Failed to generate APK info", details: error.message },
      { status: 500 }
    );
  }
}
