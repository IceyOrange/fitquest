"use client";

import { getProfile } from "@/lib/personality";
import { getEnergyInfo } from "@/lib/energy";
import type { PersonalityType } from "@/types";

interface PersonalityCardProps {
  personalityType: PersonalityType | null;
  energy: number;
}

export default function PersonalityCard({ personalityType, energy }: PersonalityCardProps) {
  if (!personalityType) {
    return (
      <div className="card text-center py-6">
        <p className="text-gray-500 text-sm">还没有运动性格</p>
        <a href="/quiz" className="inline-block mt-3 px-6 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium">去测试</a>
      </div>
    );
  }

  const profile = getProfile(personalityType);
  const energyInfo = getEnergyInfo(energy);

  return (
    <div className="card" style={{ background: profile.gradient }}>
      <div className="flex items-center gap-4">
        <div className="text-5xl">{profile.emoji}</div>
        <div className="flex-1">
          <div className="font-bold text-lg" style={{ color: profile.textColor }}>{profile.name}</div>
          <div className="text-sm mt-0.5" style={{ color: profile.textColor, opacity: 0.8 }}>
            {energyInfo.emoji} {energyInfo.label} · {energyInfo.description}
          </div>
          <div className="mt-2 bg-black/10 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{
              width: `${energy}%`,
              background: energy >= 80 ? "#00B894" : energy >= 40 ? "#FDCB6E" : "#E17055",
            }} />
          </div>
          <div className="text-xs mt-1" style={{ color: profile.textColor, opacity: 0.7 }}>能量 {energy}%</div>
        </div>
      </div>
    </div>
  );
}
