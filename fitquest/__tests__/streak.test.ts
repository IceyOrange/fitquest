import { calculateStreak } from "@/lib/streak";

describe("calculateStreak", () => {
  it("returns 0 for empty workout list", () => {
    expect(calculateStreak([])).toBe(0);
  });
  it("returns 1 for single workout today", () => {
    expect(calculateStreak([new Date()])).toBe(1);
  });
  it("returns 3 for consecutive 3 days including today", () => {
    const now = Date.now();
    expect(calculateStreak([
      new Date(now),
      new Date(now - 86400000),
      new Date(now - 2 * 86400000),
    ])).toBe(3);
  });
  it("breaks streak on a gap day", () => {
    const now = Date.now();
    expect(calculateStreak([
      new Date(now),
      new Date(now - 2 * 86400000),
    ])).toBe(1);
  });
  it("counts multiple workouts on same day as one", () => {
    const now = Date.now();
    expect(calculateStreak([
      new Date(now),
      new Date(now),
      new Date(now - 86400000),
    ])).toBe(2);
  });
  it("starts streak from yesterday if no workout today", () => {
    const now = Date.now();
    expect(calculateStreak([
      new Date(now - 86400000),
      new Date(now - 2 * 86400000),
    ])).toBe(2);
  });
  it("returns 0 if most recent workout was 2+ days ago", () => {
    const now = Date.now();
    expect(calculateStreak([new Date(now - 2 * 86400000)])).toBe(0);
  });
});
