import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customDomains } from "@/lib/schema";
import { eq } from "drizzle-orm";
import dns from "dns";
import { promisify } from "util";

const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);

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
        message: existingDomain.verified
          ? "Domain already verified"
          : "Domain exists but not verified",
      });
    }

    // Perform DNS checks
    const verificationResult = await verifyDomain(domain);

    if (verificationResult.verified) {
      // Save domain to database
      await db.insert(customDomains).values({
        userId,
        domain,
        verified: true,
        serviceType: "url_shortener",
        serviceId: "1",
      });
    }

    return NextResponse.json(verificationResult);
  } catch (error: any) {
    console.error("Domain verification error:", error);
    return NextResponse.json(
      { error: "Verification failed", details: error.message },
      { status: 500 }
    );
  }
}

async function verifyDomain(domain: string) {
  const result = {
    verified: false,
    message: "",
    checks: {
      hasMX: false,
      hasTxt: false,
      txtRecord: "",
    },
  };

  try {
    // Check MX records
    try {
      const mxRecords = await resolveMx(domain);
      result.checks.hasMX = mxRecords && mxRecords.length > 0;
    } catch {
      result.checks.hasMX = false;
    }

    // Check TXT records for verification
    try {
      const txtRecords = await resolveTxt(domain);
      const txtString = txtRecords.flat().join(" ");
      result.checks.hasTxt = txtString.includes("verify") || txtString.includes("verification");
      result.checks.txtRecord = txtString;
    } catch {
      result.checks.hasTxt = false;
    }

    // For demo purposes, we'll consider it verified if domain resolves
    const dns = require("dns");
    try {
      await promisify(dns.resolve4)(domain);
      result.verified = true;
      result.message = "Domain resolves successfully";
    } catch {
      result.verified = false;
      result.message = "Domain does not resolve";
    }
  } catch (error) {
    result.message = "Verification failed";
  }

  return result;
}
