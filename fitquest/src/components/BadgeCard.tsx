"use client";

interface BadgeCardProps {
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  progress: number;
  unlockedAt: string | null;
}

export default function BadgeCard({ name, emoji, description, unlocked, progress }: BadgeCardProps) {
  return (
    <div className={`rounded-2xl p-3 text-center ${unlocked ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200" : "bg-gray-50 border-2 border-gray-100 opacity-60"}`}>
      <div className={`text-3xl mb-1 ${unlocked ? "" : "grayscale"}`}>{emoji}</div>
      <div className="text-xs font-bold text-gray-800">{name}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{description}</div>
      {!unlocked && (
        <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-primary-400 rounded-full transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      )}
    </div>
  );
}
