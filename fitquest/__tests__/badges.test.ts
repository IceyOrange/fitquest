import { BADGE_DEFINITIONS, checkBadges } from "@/lib/badges";
import type { UserStats } from "@/types";

const baseStats: UserStats = {
  streakDays: 0, longestStreak: 0, totalDistance: 0, totalDuration: 0,
  uniqueTypes: 0, totalWorkouts: 0, completedContracts: 0, totalWitnesses: 0,
};

describe("BADGE_DEFINITIONS", () => {
  it("has 12 badges (4 series × 3 tiers)", () => {
    expect(BADGE_DEFINITIONS).toHaveLength(12);
  });
  it("has 3 badges per series", () => {
    for (const s of ["consistency", "endurance", "exploration", "social"]) {
      expect(BADGE_DEFINITIONS.filter((b) => b.series === s)).toHaveLength(3);
    }
  });
});

describe("checkBadges", () => {
  it("unlocks consistency bronze at streak 7", () => {
    const badge = checkBadges({ ...baseStats, streakDays: 7 }).find(
      (b) => b.series === "consistency" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(true);
  });
  it("does not unlock consistency bronze at streak 6", () => {
    const badge = checkBadges({ ...baseStats, streakDays: 6 }).find(
      (b) => b.series === "consistency" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(false);
  });
  it("unlocks endurance bronze at 10km", () => {
    const badge = checkBadges({ ...baseStats, totalDistance: 10 }).find(
      (b) => b.series === "endurance" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(true);
  });
  it("unlocks exploration bronze at 3 unique types", () => {
    const badge = checkBadges({ ...baseStats, uniqueTypes: 3 }).find(
      (b) => b.series === "exploration" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(true);
  });
  it("unlocks social bronze at 1 completed contract", () => {
    const badge = checkBadges({ ...baseStats, completedContracts: 1 }).find(
      (b) => b.series === "social" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(true);
  });
  it("shows progress for partially completed badges", () => {
    const badge = checkBadges({ ...baseStats, streakDays: 3 }).find(
      (b) => b.series === "consistency" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(false);
    expect(badge?.progress).toBeCloseTo(3 / 7, 1);
  });
});
