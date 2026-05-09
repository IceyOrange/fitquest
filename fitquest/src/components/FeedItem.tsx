"use client";

import { useState } from "react";
import { getProfile } from "@/lib/personality";

const WORKOUT_LABELS: Record<string, { label: string; emoji: string }> = {
  running: { label: "跑步", emoji: "🏃" }, gym: { label: "健身", emoji: "🏋️" },
  swimming: { label: "游泳", emoji: "🏊" }, yoga: { label: "瑜伽", emoji: "🧘" },
  cycling: { label: "骑行", emoji: "🚴" }, basketball: { label: "篮球", emoji: "🏀" },
};

interface FeedItemProps {
  id: string; type: string; content: Record<string, unknown>; createdAt: string;
  user: { id: string; name: string; personalityType: string | null };
  interactions: { id: string; userId: string; type: string; content: string | null }[];
}

export default function FeedItem({ id, type, content, createdAt, user, interactions }: FeedItemProps) {
  const [likes, setLikes] = useState(interactions.filter((i) => i.type === "like").length);
  const [witnesses, setWitnesses] = useState(interactions.filter((i) => i.type === "witness").length);
  const [witnessed, setWitnessed] = useState(false);

  const personality = user.personalityType ? getProfile(user.personalityType as keyof ReturnType<typeof getProfile>) : null;
  const timeAgo = getTimeAgo(new Date(createdAt));

  const handleWitness = async () => {
    if (witnessed) return;
    await fetch("/api/interactions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedItemId: id, type: "witness" }),
    });
    setWitnesses((w) => w + 1);
    setWitnessed(true);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ background: personality?.gradient || "#f0f0f0" }}>
          {personality?.emoji || "😊"}
        </div>
        <div>
          <span className="font-bold text-sm">{user.name}</span>
          {personality && <span className="text-xs text-primary-500 ml-1">· {personality.name}</span>}
          <div className="text-[10px] text-gray-400">{timeAgo}</div>
        </div>
      </div>

      {type === "workout" && (
        <p className="text-sm text-gray-800">
          {(WORKOUT_LABELS[(content.workoutType as string)] || WORKOUT_LABELS.running).emoji}{" "}
          {(WORKOUT_LABELS[(content.workoutType as string)] || WORKOUT_LABELS.running).label}{" "}
          {content.duration as number} 分钟{content.distance ? ` · ${content.distance}km` : ""}
        </p>
      )}
      {type === "badge_unlock" && (
        <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-3">
          <span className="text-2xl">🏅</span>
          <div><div className="text-sm font-bold text-amber-700">解锁新徽章！</div>
            <div className="text-xs text-amber-600">{content.series as string} · {content.tier as string}</div></div>
        </div>
      )}
      {type === "personality_evolve" && (
        <div className="bg-purple-50 rounded-xl p-3 flex items-center gap-3 justify-center">
          <span>❓</span><span className="text-gray-400">→</span>
          <span className="font-bold text-primary-500">❓</span>
          <span className="text-xs text-purple-600 ml-1">性格进化了！</span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-50 flex gap-4 text-xs text-gray-400">
        <button onClick={() => setLikes((l) => l + 1)} className="hover:text-red-400 transition-colors">🔥 {likes}</button>
        <button onClick={handleWitness}
          className={`transition-colors ${witnessed ? "text-primary-500 font-bold" : "hover:text-primary-400"}`}>
          👁️ 见证{witnesses > 0 ? ` ${witnesses}` : ""}
        </button>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "刚刚";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`;
  return `${Math.floor(seconds / 86400)} 天前`;
}
