import type { EnergyInfo } from "@/types";

export function calculateEnergy(lastWorkoutAt: Date | null): number {
  if (!lastWorkoutAt) return 50;

  const now = new Date();
  const diffMs = now.getTime() - new Date(lastWorkoutAt).getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays <= 1) return 100;
  if (diffDays === 2) return 90;
  if (diffDays === 3) return 60;
  if (diffDays === 4) return 40;
  if (diffDays === 5) return 20;
  if (diffDays === 6) return 10;
  return 0;
}

export function getEnergyInfo(energy: number): EnergyInfo {
  if (energy >= 80) {
    return {
      state: "thriving",
      value: energy,
      emoji: "✨",
      label: "活力满满",
      color: "#00B894",
      description: "能量充沛，继续保持！",
    };
  }
  if (energy >= 40) {
    return {
      state: "hungry",
      value: energy,
      emoji: "😴",
      label: "渴望运动",
      color: "#FDCB6E",
      description: "能量正在衰减...",
    };
  }
  return {
    state: "wilting",
    value: energy,
    emoji: "🥀",
    label: "枯萎中",
    color: "#E17055",
    description: "快去运动拯救你的性格！",
  };
}
