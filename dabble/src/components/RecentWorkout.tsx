"use client";

import { useEffect, useState } from "react";

const WORKOUT_LABELS: Record<string, { label: string; emoji: string }> = {
  running: { label: "跑步", emoji: "🏃" }, gym: { label: "健身", emoji: "🏋️" },
  swimming: { label: "游泳", emoji: "🏊" }, yoga: { label: "瑜伽", emoji: "🧘" },
  cycling: { label: "骑行", emoji: "🚴" }, basketball: { label: "篮球", emoji: "🏀" },
  badminton: { label: "羽毛球", emoji: "🏸" }, football: { label: "足球", emoji: "⚽" },
  hiking: { label: "徒步", emoji: "🥾" }, other: { label: "其他", emoji: "💪" },
};

interface WorkoutRecord {
  type: string;
  duration: number;
  distance: number | null;
  recordedAt: string;
}

function getTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "刚刚";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`;
  return `${Math.floor(seconds / 86400)} 天前`;
}

export default function RecentWorkout() {
  const [workout, setWorkout] = useState<WorkoutRecord | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetch("/api/workouts?limit=1")
      .then((r) => r.json())
      .then((data) => {
        const workouts = data.workouts || [];
        if (workouts.length > 0) {
          setWorkout(workouts[0]);
        } else {
          setWorkout({
            type: "running",
            duration: 30,
            distance: 5.2,
            recordedAt: new Date(Date.now() - 7200000).toISOString(),
          });
          setIsDemo(true);
        }
      })
      .catch(() => {});
  }, []);

  if (!workout) return null;

  const info = WORKOUT_LABELS[workout.type] || WORKOUT_LABELS.other;

  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
          {info.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">{info.label}</span>
            {isDemo && <span className="text-[10px] text-primary-400">预览</span>}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {workout.duration} 分钟{workout.distance ? ` · ${workout.distance}km` : ""} · {getTimeAgo(workout.recordedAt)}
          </div>
        </div>
        <div className="text-xs text-gray-300 font-medium">上次运动</div>
      </div>
    </div>
  );
}
