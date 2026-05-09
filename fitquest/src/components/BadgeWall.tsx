"use client";

import { useEffect, useState } from "react";
import BadgeCard from "./BadgeCard";

interface BadgeData {
  series: string; tier: string; name: string; emoji: string;
  description: string; unlocked: boolean; progress: number; unlockedAt: string | null;
}

const SERIES_LABELS: Record<string, string> = {
  consistency: "🔥 坚持之心",
  endurance: "📏 里程之魂",
  exploration: "🌈 探索之翼",
  social: "🤝 契约之证",
};

export default function BadgeWall() {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/badges").then((r) => r.json()).then((data) => {
      setBadges(data.badges || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-8 text-gray-400">加载中...</div>;

  const seriesOrder = ["consistency", "endurance", "exploration", "social"];

  return (
    <div className="space-y-6">
      {seriesOrder.map((series) => {
        const seriesBadges = badges
          .filter((b) => b.series === series)
          .sort((a, b) => ({ bronze: 0, silver: 1, gold: 2 }[a.tier] ?? 0) - ({ bronze: 0, silver: 1, gold: 2 }[b.tier] ?? 0));
        return (
          <div key={series}>
            <h3 className="text-sm font-bold text-gray-700 mb-2">{SERIES_LABELS[series] || series}</h3>
            <div className="grid grid-cols-3 gap-2">
              {seriesBadges.map((badge) => (
                <BadgeCard key={`${badge.series}-${badge.tier}`} {...badge} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
