"use client";

import { useEffect, useState } from "react";

interface DayData { date: string; count: number; }

export default function StreakHeatmap() {
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workouts?limit=365").then((r) => r.json()).then((data) => {
      const workoutDays: Record<string, number> = {};
      for (const w of data.workouts || []) {
        const date = new Date(w.recordedAt).toISOString().slice(0, 10);
        workoutDays[date] = (workoutDays[date] || 0) + 1;
      }
      const result: DayData[] = [];
      const today = new Date();
      for (let i = 364; i >= 0; i--) {
        const d = new Date(today); d.setDate(d.getDate() - i);
        result.push({ date: d.toISOString().slice(0, 10), count: workoutDays[d.toISOString().slice(0, 10)] || 0 });
      }
      setDays(result);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-4 text-gray-400 text-sm">加载热力图...</div>;

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-400";
    return "bg-green-600";
  };

  const weeks: DayData[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[2px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[2px]">
            {week.map((day, di) => (
              <div key={di} className={`w-3 h-3 rounded-sm ${getColor(day.count)}`} title={`${day.date}: ${day.count} 次运动`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
