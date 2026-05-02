import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

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
    const deviceInfo = `${userBrowser} on ${userCountry}`;

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
      emailVerified: false,
      phoneVerified: false,
    });

    const newUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (phone) {
      const code = randomInt(100000, 999999).toString();
      phoneCodes.set(phone, {
        code,
        expires: Date.now() + 10 * 60 * 1000,
        userId: newUser!.id,
      });
      console.log(`[Exoincs] Phone verification code for ${phone}: ${code}`);
    }

    return NextResponse.json(
      {
        id: newUser!.id,
        email,
        requiresPhoneVerification: !!phone,
        message: phone 
          ? "Account created! Verify your phone to continue." 
          : "Account created successfully!",
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

export { phoneCodes };
