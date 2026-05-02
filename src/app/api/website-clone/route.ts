import { NextResponse } from "next/server";

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

    // Create simple HTML file response (ZIP functionality can be added later)
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloned Website</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 5px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Website Cloned Successfully</h1>
        <p>Original URL: ${url}</p>
        <p>Cloned by Exoincs</p>
    </div>
    <div style="border: 1px solid #ccc; padding: 20px; border-radius: 5px;">
        <h2>Original Content Preview:</h2>
        <div style="max-height: 400px; overflow: auto; border: 1px solid #eee; padding: 10px;">
            ${html.substring(0, 5000)}...
        </div>
    </div>
</body>
</html>`;

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename=cloned-website.html`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Clone failed", details: error.message },
      { status: 500 }
    );
  }
}
