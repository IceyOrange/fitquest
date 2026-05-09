import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  // Initialize all 12 badges for the new user
  const series = ["consistency", "endurance", "exploration", "social"] as const;
  const tiers = ["bronze", "silver", "gold"] as const;
  for (const s of series) {
    for (const t of tiers) {
      await prisma.badge.create({
        data: { userId: user.id, series: s, tier: t, progress: 0 },
      });
    }
  }

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
