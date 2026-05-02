import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customDomains } from "@/lib/schema";
import { eq } from "drizzle-orm";
import https from "https";
import dns from "dns";
import { promisify } from "util";

const resolve4 = promisify(dns.resolve4);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, userId } = body;

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Check if domain already exists
    const existingDomain = await db.query.customDomains.findFirst({
      where: eq(customDomains.domain, domain),
    });

    if (existingDomain) {
      return NextResponse.json({
        verified: existingDomain.verified,
        sslEnabled: existingDomain.sslEnabled,
        message: existingDomain.verified
          ? "Domain already verified"
          : "Domain exists but not verified",
      });
    }

    // Check if domain resolves
    try {
      await resolve4(domain);
    } catch {
      return NextResponse.json({
        verified: false,
        message: "Domain does not resolve",
      });
    }

    // Check SSL by making HTTPS request
    const sslValid = await new Promise<boolean>((resolve) => {
      const req = https.get(`https://${domain}`, { timeout: 5000 }, (res) => {
        // If we get any response, SSL is working
        resolve(true);
        res.destroy();
      });

      req.on("error", () => resolve(false));
      req.on("timeout", () => {
        req.destroy();
        resolve(false);
      });
    });

    if (sslValid) {
      // Save domain to database
      await db.insert(customDomains).values({
        userId,
        domain,
        verified: true,
        sslEnabled: true,
        serviceType: "url_shortener",
        serviceId: "1",
      });

      return NextResponse.json({
        verified: true,
        sslEnabled: true,
        message: "Domain verified with SSL!",
      });
    } else {
      return NextResponse.json({
        verified: false,
        sslEnabled: false,
        message: "Domain resolves but SSL check failed",
      });
    }
  } catch (error: any) {
    console.error("Domain verification error:", error);
    return NextResponse.json(
      { error: "Verification failed", details: error.message },
      { status: 500 }
    );
  }
}
