import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiProjects } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, type, title, description } = body;

    if (!userId || !type || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate AI content for crypto/NFT projects
    const aiContent = await generateAIProject(type, title, description);

    // Save project
    await db.insert(aiProjects).values({
      userId,
      type,
      title,
      description,
      logoUrl: aiContent.logoUrl,
      faviconUrl: aiContent.faviconUrl,
      backgroundUrl: aiContent.backgroundUrl,
      pages: JSON.stringify(aiContent.pages),
    });

    return NextResponse.json({
      success: true,
      project: aiContent,
    });
  } catch (error: any) {
    console.error("AI project generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate project", details: error.message },
      { status: 500 }
    );
  }
}

async function generateAIProject(type: string, title: string, description: string) {
  // AI-generated content (in production, use OpenAI/Claude API)
  const baseUrl = `https://${title.toLowerCase().replace(/\s+/g, '-')}.exoincs.com`;

  const pages = {
    home: {
      title: `${title} - ${type.toUpperCase()} Project`,
      content: `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 20px; text-align: center;">
          <h1 style="font-size: 3rem; margin-bottom: 20px;">${title}</h1>
          <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto;">${description}</p>
          <div style="margin-top: 40px;">
            <button style="background: #ff6b6b; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer;">Get Started</button>
          </div>
        </div>
        <div style="padding: 60px 20px; max-width: 1200px; margin: 0 auto;">
          <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 40px; color: #333;">About ${title}</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
            <div style="text-align: center;">
              <h3 style="font-size: 1.5rem; color: #667eea; margin-bottom: 20px;">Innovation</h3>
              <p style="color: #666; line-height: 1.6;">${description}</p>
            </div>
            <div style="text-align: center;">
              <h3 style="font-size: 1.5rem; color: #667eea; margin-bottom: 20px;">Technology</h3>
              <p style="color: #666; line-height: 1.6;">Built on cutting-edge ${type} technology with smart contracts and decentralized architecture.</p>
            </div>
            <div style="text-align: center;">
              <h3 style="font-size: 1.5rem; color: #667eea; margin-bottom: 20px;">Community</h3>
              <p style="color: #666; line-height: 1.6;">Join our vibrant community of ${type} enthusiasts and investors.</p>
            </div>
          </div>
        </div>
      `,
    },
    about: {
      title: `About ${title}`,
      content: `
        <div style="padding: 60px 20px; max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 3rem; text-align: center; margin-bottom: 40px; color: #333;">About ${title}</h1>
          <div style="background: #f8f9fa; padding: 40px; border-radius: 10px;">
            <h2 style="color: #667eea; margin-bottom: 20px;">Our Mission</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; color: #555;">${description}</p>
            <h2 style="color: #667eea; margin: 30px 0 20px 0;">Technology Stack</h2>
            <ul style="color: #555; line-height: 1.8;">
              <li>• Smart Contracts on ${type === 'crypto' ? 'Ethereum' : 'Solana'}</li>
              <li>• Decentralized Storage (IPFS)</li>
              <li>• Web3 Authentication</li>
              <li>• Cross-chain Compatibility</li>
            </ul>
          </div>
        </div>
      `,
    },
    tokenomics: {
      title: `${title} Tokenomics`,
      content: `
        <div style="padding: 60px 20px; max-width: 1000px; margin: 0 auto;">
          <h1 style="font-size: 3rem; text-align: center; margin-bottom: 40px; color: #333;">Tokenomics</h1>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
            <div style="background: #667eea; color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h3 style="font-size: 2rem; margin-bottom: 10px;">1B</h3>
              <p>Total Supply</p>
            </div>
            <div style="background: #764ba2; color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h3 style="font-size: 2rem; margin-bottom: 10px;">40%</h3>
              <p>Liquidity</p>
            </div>
            <div style="background: #f093fb; color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h3 style="font-size: 2rem; margin-bottom: 10px;">30%</h3>
              <p>Community</p>
            </div>
            <div style="background: #4facfe; color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h3 style="font-size: 2rem; margin-bottom: 10px;">20%</h3>
              <p>Development</p>
            </div>
          </div>
        </div>
      `,
    },
  };

  return {
    logoUrl: `${baseUrl}/logo.png`,
    faviconUrl: `${baseUrl}/favicon.ico`,
    backgroundUrl: `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1920&q=80`,
    baseUrl,
    pages,
  };
}
