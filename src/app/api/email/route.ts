import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailTemplates, emailCampaigns } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, subject, content, templateId, recipientEmails } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (name && subject && content) {
      // Create email template
      await db.insert(emailTemplates).values({
        userId,
        name,
        subject,
        content,
      });
      return NextResponse.json({ success: true, message: "Template created" });
    }

    if (templateId && recipientEmails) {
      // Create email campaign
      const campaignId = await db.insert(emailCampaigns).values({
        userId,
        templateId,
        subject: "Campaign Subject",
        status: "draft",
      });

      // Send emails (mock - integrate with Resend/Mailgun)
      console.log(`[Exoincs] Sending emails to ${recipientEmails.length} recipients`);

      return NextResponse.json({
        success: true,
        campaignId: campaignId.lastInsertRowid,
        message: `Campaign created. Would send to ${recipientEmails.length} recipients.`,
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Operation failed", details: error.message },
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

    const templates = await db.query.emailTemplates.findMany({
      where: eq(emailTemplates.userId, parseInt(userId)),
    });

    const campaigns = await db.query.emailCampaigns.findMany({
      where: eq(emailCampaigns.userId, parseInt(userId)),
    });

    return NextResponse.json({ templates, campaigns });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 }
    );
  }
}
