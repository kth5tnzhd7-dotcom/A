import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, websiteId, url } = body;

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // Fetch website content
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch website" }, { status: 400 });
    }

    const html = await response.text();

    // Create ZIP with HTML and assets
    const zip = new JSZip();
    zip.file("index.html", html);
    zip.file("style.css", `
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
      .header { background: #667eea; color: white; padding: 20px; text-align: center; }
      .content { max-width: 1200px; margin: 0 auto; padding: 20px; }
    `);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=website-clone.zip`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Clone failed", details: error.message },
      { status: 500 }
    );
  }
}
