import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

// Store verification codes (in production, use Redis)
const phoneCodes = new Map<string, { code: string; expires: number; userId: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, phone, country, browser } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCountry = country || "Unknown";
    const userBrowser = browser || "Unknown";

    // Get device info (in middleware, we'd extract from headers)
    const deviceInfo = `${userBrowser} on ${userCountry}`;

    // Insert user
    await db.insert(users).values({
      name: email.split('@')[0],
      email,
      password: hashedPassword,
      phone: phone || null,
      country: userCountry,
      browser: userBrowser,
      deviceInfo,
      credits: 0,
      walletBalance: 0,
      emailVerified: 0,
    });

    // Fetch the newly created user
    const newUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Auto-create wallet for user
    await db.insert(wallets).values({
      userId: newUser!.id,
      balance: 0,
      currency: "USD",
    });

    // Generate 6-digit phone verification code if phone provided
    if (phone) {
      const code = randomInt(100000, 999999).toString();
      phoneCodes.set(phone, {
        code,
        expires: Date.now() + 10 * 60 * 1000,
        userId: newUser!.id,
      });

      // Send SMS via Bird.com (mock for now)
      console.log(`[Exoincs] Phone verification code for ${phone}: ${code}`);
      console.log(`Send via Bird.com SMS: Your Exoincs verification code: ${code}`);
    }

    return NextResponse.json(
      {
        id: newUser!.id,
        email,
        requiresPhoneVerification: !!phone,
        message: phone 
          ? "Account created! Verify your phone to continue." 
          : "Account created! Check your email for verification.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Export for use in verify-phone route
export { phoneCodes };
