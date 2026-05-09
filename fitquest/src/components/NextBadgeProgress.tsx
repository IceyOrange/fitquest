"use client";

import { useEffect, useState } from "react";

interface BadgeData { name: string; emoji: string; unlocked: boolean; progress: number; }

export default function NextBadgeProgress() {
  const [nextBadge, setNextBadge] = useState<BadgeData | null>(null);

  useEffect(() => {
    fetch("/api/badges").then((r) => r.json()).then((data) => {
      const notUnlocked = (data.badges || []).filter((b: BadgeData) => !b.unlocked);
      if (notUnlocked.length > 0) {
        notUnlocked.sort((a: BadgeData, b: BadgeData) => b.progress - a.progress);
        setNextBadge(notUnlocked[0]);
      }
    });
  }, []);

  if (!nextBadge) return null;
  const pct = Math.round(nextBadge.progress * 100);

  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl opacity-60">{nextBadge.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-gray-800 truncate">距「{nextBadge.name}」还差 {100 - pct}%</div>
          <div className="mt-1.5 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-orange to-accent-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
