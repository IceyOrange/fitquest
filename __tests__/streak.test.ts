import { calculateWeeklyStreak, getThisWeekWorkoutCount, getISOWeekKey } from "@/lib/streak";

describe("calculateWeeklyStreak", () => {
  it("returns 0 for empty workout list", () => {
    expect(calculateWeeklyStreak([])).toBe(0);
  });

  it("returns 1 for single workout this week", () => {
    expect(calculateWeeklyStreak([new Date()])).toBe(1);
  });

  it("returns 2 for this week and last week", () => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 86400000);
    expect(calculateWeeklyStreak([now, lastWeek])).toBe(2);
  });

  it("breaks streak on a gap week", () => {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);
    expect(calculateWeeklyStreak([now, twoWeeksAgo])).toBe(1);
  });

  it("handles year boundary (W52 -> W01)", () => {
    // Simulate W52 of 2024 and W01 of 2025
    const w52 = new Date("2024-12-25");
    const w01 = new Date("2025-01-02");
    expect(calculateWeeklyStreak([w01, w52])).toBe(2);
  });
});

describe("getThisWeekWorkoutCount", () => {
  it("counts workouts in current week only", () => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 86400000);
    expect(getThisWeekWorkoutCount([now, now, lastWeek])).toBe(2);
  });
});

describe("getISOWeekKey", () => {
  it("returns correct week key", () => {
    const d = new Date("2025-01-15");
    const key = getISOWeekKey(d);
    expect(key).toMatch(/^\d{4}-W\d{2}$/);
  });
});
