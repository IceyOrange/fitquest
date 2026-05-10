"use client";

import { useMemo } from "react";
import { generateHeatmapData } from "@/lib/demo-data";

interface DayData {
  date: string;
  count: number;
}

function colorFor(count: number): string {
  if (count === 0) return "var(--color-surface-tint)";
  if (count === 1) return "var(--color-brand-100)";
  if (count === 2) return "var(--color-brand-300)";
  return "var(--color-brand-500)";
}

export default function StreakHeatmap() {
  const days = useMemo(() => generateHeatmapData(), []);

  const totalDays = days.length;
  const activeDays = days.filter((d) => d.count > 0).length;
  const offset = days[0] ? new Date(days[0].date).getDay() : 0;

  const cells: (DayData | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (const d of days) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (DayData | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div>
      <div
        className="text-[11px] uppercase mb-3"
        style={{
          color: "var(--color-ink-tertiary)",
          letterSpacing: "0.14em",
        }}
      >
        {Math.round(totalDays / 30)} 个月 · 动了 {activeDays} 天
      </div>

      <div className="overflow-x-auto scrollbar-none">
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="w-[10px] h-[10px]"
                  style={{
                    backgroundColor: day
                      ? colorFor(day.count)
                      : "transparent",
                    borderRadius: "2px",
                  }}
                  title={day ? `${day.date} · ${day.count} 次` : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-3 flex items-center gap-1.5 text-[11px]"
        style={{ color: "var(--color-ink-tertiary)" }}
      >
        <span>少</span>
        {[0, 1, 2, 3].map((c) => (
          <div
            key={c}
            className="w-[10px] h-[10px]"
            style={{
              backgroundColor: colorFor(c),
              borderRadius: "2px",
            }}
            aria-hidden="true"
          />
        ))}
        <span>多</span>
      </div>
    </div>
  );
}
