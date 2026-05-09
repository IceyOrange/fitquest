import type { BadgeSeries, BadgeTier, BadgeDefinition, UserStats } from "@/types";
import { prisma } from "@/lib/prisma";

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Consistency series (streak-based)
  { series: "consistency", tier: "bronze", name: "坚持之心 · 铜", emoji: "🥉", description: "连续运动 7 天", checkFn: (s) => s.streakDays >= 7, progressFn: (s) => Math.min(s.streakDays / 7, 1) },
  { series: "consistency", tier: "silver", name: "坚持之心 · 银", emoji: "🥈", description: "连续运动 14 天", checkFn: (s) => s.streakDays >= 14, progressFn: (s) => Math.min(s.streakDays / 14, 1) },
  { series: "consistency", tier: "gold", name: "坚持之心 · 金", emoji: "🥇", description: "连续运动 30 天", checkFn: (s) => s.streakDays >= 30, progressFn: (s) => Math.min(s.streakDays / 30, 1) },
  // Endurance series (distance-based)
  { series: "endurance", tier: "bronze", name: "里程之魂 · 铜", emoji: "🥉", description: "累计跑步 10km", checkFn: (s) => s.totalDistance >= 10, progressFn: (s) => Math.min(s.totalDistance / 10, 1) },
  { series: "endurance", tier: "silver", name: "里程之魂 · 银", emoji: "🥈", description: "累计跑步 50km", checkFn: (s) => s.totalDistance >= 50, progressFn: (s) => Math.min(s.totalDistance / 50, 1) },
  { series: "endurance", tier: "gold", name: "里程之魂 · 金", emoji: "🥇", description: "累计跑步 100km", checkFn: (s) => s.totalDistance >= 100, progressFn: (s) => Math.min(s.totalDistance / 100, 1) },
  // Exploration series (variety-based)
  { series: "exploration", tier: "bronze", name: "探索之翼 · 铜", emoji: "🥉", description: "尝试 3 种运动", checkFn: (s) => s.uniqueTypes >= 3, progressFn: (s) => Math.min(s.uniqueTypes / 3, 1) },
  { series: "exploration", tier: "silver", name: "探索之翼 · 银", emoji: "🥈", description: "尝试 5 种运动", checkFn: (s) => s.uniqueTypes >= 5, progressFn: (s) => Math.min(s.uniqueTypes / 5, 1) },
  { series: "exploration", tier: "gold", name: "探索之翼 · 金", emoji: "🥇", description: "尝试 8 种运动", checkFn: (s) => s.uniqueTypes >= 8, progressFn: (s) => Math.min(s.uniqueTypes / 8, 1) },
  // Social series (contract-based)
  { series: "social", tier: "bronze", name: "契约之证 · 铜", emoji: "🥉", description: "完成首份社交契约", checkFn: (s) => s.completedContracts >= 1, progressFn: (s) => Math.min(s.completedContracts / 1, 1) },
  { series: "social", tier: "silver", name: "契约之证 · 银", emoji: "🥈", description: "连续 4 周完成契约", checkFn: (s) => s.completedContracts >= 4, progressFn: (s) => Math.min(s.completedContracts / 4, 1) },
  { series: "social", tier: "gold", name: "契约之证 · 金", emoji: "🥇", description: "获见证 20 次", checkFn: (s) => s.totalWitnesses >= 20, progressFn: (s) => Math.min(s.totalWitnesses / 20, 1) },
];

export interface BadgeCheckResult {
  series: BadgeSeries;
  tier: BadgeTier;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  progress: number;
}

export function checkBadges(stats: UserStats): BadgeCheckResult[] {
  return BADGE_DEFINITIONS.map((def) => ({
    series: def.series,
    tier: def.tier,
    name: def.name,
    emoji: def.emoji,
    description: def.description,
    unlocked: def.checkFn(stats),
    progress: def.progressFn(stats),
  }));
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const workouts = await prisma.workout.findMany({
    where: { userId },
    select: { type: true, distance: true, duration: true },
  });
  const uniqueTypes = new Set(workouts.map((w) => w.type)).size;
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const completedContracts = await prisma.contract.count({
    where: { userId, actualCount: { gte: 1 } },
  });
  const totalWitnesses = await prisma.interaction.count({
    where: { type: "witness", feedItem: { userId } },
  });
  return {
    streakDays: user?.streakDays || 0,
    longestStreak: user?.longestStreak || 0,
    totalDistance,
    totalDuration,
    uniqueTypes,
    totalWorkouts: workouts.length,
    completedContracts,
    totalWitnesses,
  };
}

export async function checkAndUnlockBadges(userId: string): Promise<{ series: string; tier: string }[]> {
  const stats = await getUserStats(userId);
  const results = checkBadges(stats);
  const newlyUnlocked: { series: string; tier: string }[] = [];

  for (const result of results) {
    if (result.unlocked) {
      const badge = await prisma.badge.findUnique({
        where: { userId_series_tier: { userId, series: result.series, tier: result.tier } },
      });
      if (badge && !badge.unlockedAt) {
        await prisma.badge.update({
          where: { id: badge.id },
          data: { unlockedAt: new Date(), progress: 1 },
        });
        newlyUnlocked.push({ series: result.series, tier: result.tier });
      }
    } else {
      await prisma.badge.updateMany({
        where: { userId, series: result.series, tier: result.tier, unlockedAt: null },
        data: { progress: result.progress },
      });
    }
  }

  return newlyUnlocked;
}
