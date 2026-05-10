import { prisma } from "./prisma";
import { calculateWeeklyStreak, getThisWeekWorkoutCount } from "./streak";
import type { UserStats } from "@/types";

export async function getUserStats(userId: string): Promise<UserStats> {
  const [user, workouts] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.workout.findMany({
      where: { userId },
      select: { recordedAt: true, type: true, duration: true },
    }),
  ]);

  const dates = workouts.map((w) => w.recordedAt);
  const types = new Set(workouts.map((w) => w.type));
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);

  return {
    weeklyActiveStreak: calculateWeeklyStreak(dates),
    weeklyTarget: user?.weeklyTarget ?? 3,
    thisWeekCount: getThisWeekWorkoutCount(dates),
    totalDuration,
    uniqueTypes: types.size,
    totalWorkouts: workouts.length,
  };
}
