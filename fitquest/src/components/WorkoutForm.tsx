"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WorkoutType } from "@/types";

const WORKOUT_OPTIONS: { value: WorkoutType; label: string; emoji: string }[] = [
  { value: "running", label: "跑步", emoji: "🏃" },
  { value: "gym", label: "健身", emoji: "🏋️" },
  { value: "swimming", label: "游泳", emoji: "🏊" },
  { value: "yoga", label: "瑜伽", emoji: "🧘" },
  { value: "cycling", label: "骑行", emoji: "🚴" },
  { value: "basketball", label: "篮球", emoji: "🏀" },
  { value: "badminton", label: "羽毛球", emoji: "🏸" },
  { value: "football", label: "足球", emoji: "⚽" },
  { value: "hiking", label: "徒步", emoji: "🥾" },
  { value: "other", label: "其他", emoji: "💪" },
];

export default function WorkoutForm() {
  const router = useRouter();
  const [type, setType] = useState<WorkoutType | "">("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) { setError("请选择运动类型"); return; }
    setError("");
    setLoading(true);

    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, duration: parseInt(duration), distance: distance ? parseFloat(distance) : null }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("记录失败，请重试");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">运动类型</label>
        <div className="grid grid-cols-5 gap-2">
          {WORKOUT_OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => setType(opt.value)}
              className={`flex flex-col items-center p-2 rounded-xl transition-colors ${type === opt.value ? "bg-primary-100 border-2 border-primary-500" : "bg-gray-50 border-2 border-transparent"}`}>
              <span className="text-xl">{opt.emoji}</span>
              <span className="text-xs mt-1 text-gray-600">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">运动时长（分钟）</label>
        <input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">距离（公里，选填）</label>
        <input type="number" step="0.1" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="5"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
        {loading ? "记录中..." : "⚡ 记录今日运动"}
      </button>
    </form>
  );
}
