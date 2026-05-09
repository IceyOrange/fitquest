import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { getUserStats, checkBadges } from "@/lib/badges";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const [badges, stats] = await Promise.all([
    prisma.badge.findMany({ where: { userId } }),
    getUserStats(userId),
  ]);

  const checkResults = checkBadges(stats);
  const result = checkResults.map((check) => {
    const dbBadge = badges.find((b) => b.series === check.series && b.tier === check.tier);
    return { ...check, unlockedAt: dbBadge?.unlockedAt || null };
  });

  return NextResponse.json({ badges: result });
}
