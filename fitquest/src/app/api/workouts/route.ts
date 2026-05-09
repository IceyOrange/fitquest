import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { calculateStreak } from "@/lib/streak";
import { checkAndUnlockBadges } from "@/lib/badges";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, duration, distance } = await req.json();
  if (!type || !duration || duration <= 0) {
    return NextResponse.json({ error: "Type and duration are required" }, { status: 400 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  const workout = await prisma.workout.create({
    data: { userId, type, duration, distance: distance || null, source: "manual" },
  });

  // Recalculate streak
  const allWorkouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { recordedAt: "desc" },
    select: { recordedAt: true },
  });
  const streakDays = calculateStreak(allWorkouts.map((w) => w.recordedAt));
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const longestStreak = Math.max(user?.longestStreak || 0, streakDays);

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: { lastWorkoutAt: new Date(), streakDays, longestStreak, personalityEnergy: 100 },
  });

  // Check badges
  const newBadges = await checkAndUnlockBadges(userId);

  // Create feed item for workout
  await prisma.feedItem.create({
    data: { userId, type: "workout", content: { workoutType: type, duration, distance } },
  });

  // Create feed items for any new badges
  for (const badge of newBadges) {
    await prisma.feedItem.create({
      data: { userId, type: "badge_unlock", content: { series: badge.series, tier: badge.tier } },
    });
  }

  return NextResponse.json({
    workout: { id: workout.id, type, duration },
    streakDays,
    newBadges: newBadges.length,
  });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as Record<string, unknown>).id as string;
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "30");

  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { recordedAt: "desc" },
    take: limit,
  });
  return NextResponse.json({ workouts });
}
