import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

// Store verification codes (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expires: number; name: string }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
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

    // Generate 6-digit verification code
    const code = randomInt(100000, 999999).toString();

    // Store code (expires in 10 minutes)
    verificationCodes.set(email, {
      code,
      expires: Date.now() + 10 * 60 * 1000,
      name,
    });

    // Save user to database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      credits: 0,
    });

    // Log the verification email (in production, send via Resend/Mailgun)
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://exoincs.com'}/verify-email?email=${encodeURIComponent(email)}&code=${code}`;

    console.log(`[Exoincs] Verification email for ${email}:`);
    console.log(`Subject: Verify your Exoincs account`);
    console.log(`Body: Welcome to Exoincs, ${name}! Your verification code is: ${code}`);
    console.log(`Or click: ${verificationLink}`);

    return NextResponse.json(
      {
        message: "Account created! Check your email for verification code.",
        email,
        requiresVerification: true,
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

export { verificationCodes };
