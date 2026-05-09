import { calculateEnergy, getEnergyInfo } from "@/lib/energy";

describe("calculateEnergy", () => {
  it("returns 100 when last workout was today", () => {
    expect(calculateEnergy(new Date())).toBe(100);
  });
  it("returns 100 when last workout was yesterday", () => {
    expect(calculateEnergy(new Date(Date.now() - 86400000))).toBe(100);
  });
  it("returns 90 when last workout was 2 days ago", () => {
    expect(calculateEnergy(new Date(Date.now() - 2 * 86400000))).toBe(90);
  });
  it("returns 60 when last workout was 3 days ago", () => {
    expect(calculateEnergy(new Date(Date.now() - 3 * 86400000))).toBe(60);
  });
  it("returns 40 when last workout was 4 days ago", () => {
    expect(calculateEnergy(new Date(Date.now() - 4 * 86400000))).toBe(40);
  });
  it("returns 0 when last workout was 7+ days ago", () => {
    expect(calculateEnergy(new Date(Date.now() - 7 * 86400000))).toBe(0);
  });
  it("returns 50 when lastWorkoutAt is null", () => {
    expect(calculateEnergy(null)).toBe(50);
  });
});

describe("getEnergyInfo", () => {
  it("returns thriving for energy >= 80", () => {
    expect(getEnergyInfo(90).state).toBe("thriving");
    expect(getEnergyInfo(90).emoji).toBe("✨");
  });
  it("returns hungry for energy 40-79", () => {
    expect(getEnergyInfo(60).state).toBe("hungry");
    expect(getEnergyInfo(60).emoji).toBe("😴");
  });
  it("returns wilting for energy < 40", () => {
    expect(getEnergyInfo(20).state).toBe("wilting");
    expect(getEnergyInfo(20).emoji).toBe("🥀");
  });
});
