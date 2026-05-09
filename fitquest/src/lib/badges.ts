import type { BadgeSeries, BadgeTier, UserStats } from "@/types";

export const BADGE_DEFINITIONS: { series: BadgeSeries; tier: BadgeTier; name: string; emoji: string; description: string; checkFn: (s: UserStats) => boolean; progressFn: (s: UserStats) => number }[] = [];

export function checkBadges(stats: UserStats): { series: BadgeSeries; tier: BadgeTier; name: string; emoji: string; description: string; unlocked: boolean; progress: number }[] {
  return [];
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const { prisma } = await import("./prisma");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const workouts = await prisma.workout.findMany({
    where: { userId },
    select: { type: true, distance: true, duration: true },
  });
  const uniqueTypes = new Set(workouts.map((w) => w.type)).size;
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  return {
    streakDays: user?.streakDays || 0,
    longestStreak: user?.longestStreak || 0,
    totalDistance,
    totalDuration,
    uniqueTypes,
    totalWorkouts: workouts.length,
    completedContracts: 0,
    totalWitnesses: 0,
  };
}

export async function checkAndUnlockBadges(userId: string): Promise<{ series: string; tier: string }[]> {
  return [];
}
