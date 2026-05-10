"use client";

import { useState } from "react";
import { getProfile } from "@/lib/personality";

const WORKOUT_LABELS: Record<string, string> = {
  running: "跑步",
  gym: "健身",
  swimming: "游泳",
  yoga: "瑜伽",
  cycling: "骑行",
  basketball: "篮球",
};

interface FeedItemProps {
  id: string;
  type: string;
  content: Record<string, unknown>;
  createdAt: string;
  user: { id: string; name: string; personalityType: string | null };
  interactions: {
    id: string;
    userId: string;
    type: string;
    content: string | null;
  }[];
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[15px] h-[15px]"
      aria-hidden="true"
    >
      <path d="M12 19.5C9 17 4 13.4 4 9.5A4 4 0 0 1 12 7.4 4 4 0 0 1 20 9.5c0 3.9-5 7.5-8 10z" />
    </svg>
  );
}

function EyeIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={filled ? 1.8 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[15px] h-[15px]"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
      <circle cx="12" cy="12" r={filled ? 3 : 2.5} fill={filled ? "currentColor" : "none"} />
    </svg>
  );
}

function getInitial(name: string): string {
  return name?.[0] ?? "·";
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "刚刚";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`;
  return `${Math.floor(seconds / 86400)} 天前`;
}

export default function FeedItem({
  id,
  type,
  content,
  createdAt,
  user,
  interactions,
}: FeedItemProps) {
  const [likes, setLikes] = useState(
    interactions.filter((i) => i.type === "like").length,
  );
  const [witnesses, setWitnesses] = useState(
    interactions.filter((i) => i.type === "witness").length,
  );
  const [witnessed, setWitnessed] = useState(false);
  const [liked, setLiked] = useState(false);

  const personality = user.personalityType
    ? getProfile(user.personalityType as Parameters<typeof getProfile>[0])
    : null;
  const timeAgo = getTimeAgo(new Date(createdAt));

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((l) => l + 1);
  };

  const handleWitness = async () => {
    if (witnessed) return;
    setWitnesses((w) => w + 1);
    setWitnessed(true);
  };

  const workoutType = (content.workoutType as string) ?? "running";
  const label = WORKOUT_LABELS[workoutType] ?? "运动";
  const duration = content.duration as number | undefined;
  const distance = content.distance as number | undefined;

  return (
    <article className="px-5 py-5">
      {/* identity row */}
      <header className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-display text-[15px]"
          style={{
            backgroundColor: "var(--color-surface-tint)",
            color: "var(--color-ink-secondary)",
          }}
        >
          {getInitial(user.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-display text-[15px]"
              style={{ color: "var(--color-ink-primary)" }}
            >
              {user.name}
            </span>
            {personality && (
              <span
                className="text-[12px]"
                style={{ color: "var(--color-ink-tertiary)" }}
              >
                · {personality.name}
              </span>
            )}
          </div>
          <div
            className="text-[11px] mt-0.5"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {timeAgo}
          </div>
        </div>
      </header>

      {/* content row */}
      <div className="mt-3.5">
        {type === "buddy_workout" && (
          <div
            className="text-[11px] uppercase mb-1"
            style={{
              color: "var(--color-ink-tertiary)",
              letterSpacing: "0.14em",
            }}
          >
            和搭子一起
          </div>
        )}
        <div
          className="font-display"
          style={{
            color: "var(--color-ink-primary)",
            fontSize: "17px",
            lineHeight: 1.45,
            letterSpacing: "0.005em",
          }}
        >
          完成了一次{label}
        </div>
        <div
          className="mt-2 flex items-baseline gap-x-3 gap-y-1 flex-wrap"
          style={{ color: "var(--color-ink-secondary)" }}
        >
          {duration !== undefined && (
            <span className="flex items-baseline gap-1">
              <span
                className="font-mono-num"
                style={{
                  fontSize: "20px",
                  color: "var(--color-ink-primary)",
                }}
              >
                {duration}
              </span>
              <span
                className="text-[12px]"
                style={{ color: "var(--color-ink-tertiary)" }}
              >
                分钟
              </span>
            </span>
          )}
          {distance !== undefined && (
            <span className="flex items-baseline gap-1">
              <span
                className="font-mono-num"
                style={{
                  fontSize: "20px",
                  color: "var(--color-ink-primary)",
                }}
              >
                {distance}
              </span>
              <span
                className="text-[12px]"
                style={{ color: "var(--color-ink-tertiary)" }}
              >
                公里
              </span>
            </span>
          )}
        </div>
      </div>

      {/* action row */}
      <div className="mt-4 flex items-center gap-5">
        <button
          type="button"
          onClick={handleLike}
          className="flex items-center gap-1.5 tap-shrink"
          style={{
            color: liked
              ? "var(--color-coral-500)"
              : "var(--color-ink-tertiary)",
          }}
          aria-pressed={liked}
        >
          <HeartIcon filled={liked} />
          <span
            className="font-mono-num text-[12px]"
            style={{ minWidth: "1.2em", textAlign: "left" }}
          >
            {likes}
          </span>
        </button>
        <button
          type="button"
          onClick={handleWitness}
          className="flex items-center gap-1.5 tap-shrink"
          style={{
            color: witnessed
              ? "var(--color-coral-500)"
              : "var(--color-ink-tertiary)",
          }}
          aria-pressed={witnessed}
        >
          <EyeIcon filled={witnessed} />
          <span className="text-[12px]">
            {witnessed ? "已见证" : "见证"}
            {witnesses > 0 && (
              <span
                className="font-mono-num ml-1"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {witnesses}
              </span>
            )}
          </span>
        </button>
      </div>
    </article>
  );
}
