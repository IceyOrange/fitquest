"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WorkoutType } from "@/types";

const WORKOUT_OPTIONS: { value: WorkoutType; label: string }[] = [
  { value: "running", label: "跑步" },
  { value: "gym", label: "健身" },
  { value: "swimming", label: "游泳" },
  { value: "yoga", label: "瑜伽" },
  { value: "cycling", label: "骑行" },
  { value: "basketball", label: "篮球" },
  { value: "badminton", label: "羽毛球" },
  { value: "football", label: "足球" },
  { value: "hiking", label: "徒步" },
  { value: "other", label: "其他" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[11px] uppercase mb-3"
      style={{
        color: "var(--color-ink-tertiary)",
        letterSpacing: "0.14em",
      }}
    >
      {children}
    </div>
  );
}

export default function WorkoutForm() {
  const router = useRouter();
  const [type, setType] = useState<WorkoutType | "">("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) {
      setError("先选一个项目。");
      return;
    }
    setError("");
    setLoading(true);

    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        duration: parseInt(duration),
        distance: distance ? parseFloat(distance) : null,
      }),
    });

    if (res.status === 401) {
      router.push("/register");
      return;
    }
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("没记上，再试一次。");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="px-5 py-7 space-y-8">
      {error && (
        <div
          className="text-[13px]"
          style={{ color: "var(--color-danger)" }}
        >
          {error}
        </div>
      )}

      <div>
        <FieldLabel>项目</FieldLabel>
        <div className="grid grid-cols-2 gap-px"
             style={{ backgroundColor: "var(--color-line-soft)" }}>
          {WORKOUT_OPTIONS.map((opt) => {
            const active = type === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className="px-4 py-3.5 text-left text-[14px] tap-shrink"
                style={{
                  backgroundColor: active
                    ? "var(--color-brand-50)"
                    : "var(--color-surface-base)",
                  color: active
                    ? "var(--color-brand-700)"
                    : "var(--color-ink-primary)",
                  fontFamily: active ? "var(--font-display)" : undefined,
                }}
                aria-pressed={active}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <FieldLabel>多久</FieldLabel>
        <div
          className="flex items-baseline gap-3 pb-2"
          style={{ borderBottom: "1px solid var(--color-line-firm)" }}
        >
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
            required
            inputMode="numeric"
            className="flex-1 bg-transparent focus:outline-none font-mono-num"
            style={{
              color: "var(--color-ink-primary)",
              fontSize: "32px",
              lineHeight: 1.1,
            }}
          />
          <span
            className="text-[14px]"
            style={{ color: "var(--color-ink-tertiary)" }}
          >
            分钟
          </span>
        </div>
      </div>

      <div>
        <FieldLabel>距离 · 选填</FieldLabel>
        <div
          className="flex items-baseline gap-3 pb-2"
          style={{ borderBottom: "1px solid var(--color-line-soft)" }}
        >
          <input
            type="number"
            step="0.1"
            min="0"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="—"
            inputMode="decimal"
            className="flex-1 bg-transparent focus:outline-none font-mono-num"
            style={{
              color: "var(--color-ink-primary)",
              fontSize: "24px",
              lineHeight: 1.1,
            }}
          />
          <span
            className="text-[13px]"
            style={{ color: "var(--color-ink-tertiary)" }}
          >
            公里
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary tap-shrink"
      >
        {loading ? "记着…" : "记下来"}
      </button>
    </form>
  );
}
