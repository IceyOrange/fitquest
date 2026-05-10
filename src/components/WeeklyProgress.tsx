import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { getUserStats } from "@/lib/stats";

interface ProgressProps {
  thisWeekCount: number;
  weeklyTarget: number;
}

function ProgressBlock({ thisWeekCount, weeklyTarget }: ProgressProps) {
  const remaining = Math.max(0, weeklyTarget - thisWeekCount);
  const percent = Math.min(
    100,
    weeklyTarget > 0 ? (thisWeekCount / weeklyTarget) * 100 : 0,
  );
  const done = remaining === 0;

  return (
    <section className="px-5 py-5">
      <div
        className="text-[11px] uppercase"
        style={{
          color: "var(--color-ink-tertiary)",
          letterSpacing: "0.14em",
        }}
      >
        本周进度
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span
          className="font-mono-num"
          style={{
            color: "var(--color-ink-primary)",
            fontSize: "44px",
            lineHeight: 1,
          }}
        >
          {thisWeekCount}
        </span>
        <span
          className="font-mono-num"
          style={{
            color: "var(--color-ink-muted)",
            fontSize: "20px",
            lineHeight: 1,
          }}
        >
          / {weeklyTarget}
        </span>
        <span
          className="ml-1"
          style={{
            color: "var(--color-ink-tertiary)",
            fontSize: "13px",
            lineHeight: 1,
          }}
        >
          次
        </span>
      </div>

      <div
        className="mt-4 h-[2px] w-full overflow-hidden"
        style={{ backgroundColor: "var(--color-line-soft)" }}
        aria-hidden="true"
      >
        <div
          className="h-full transition-[width] duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: done
              ? "var(--color-brand-500)"
              : "var(--color-brand-300)",
          }}
        />
      </div>

      <div
        className="mt-3 text-[13px]"
        style={{ color: "var(--color-ink-tertiary)" }}
      >
        {done
          ? "这周已经稳了。再多一次都是赚的。"
          : `再动 ${remaining} 次，本周目标到手。`}
      </div>
    </section>
  );
}

export default async function WeeklyProgress() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <ProgressBlock thisWeekCount={2} weeklyTarget={3} />;
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const stats = await getUserStats(userId);
  return (
    <ProgressBlock
      thisWeekCount={stats.thisWeekCount}
      weeklyTarget={stats.weeklyTarget}
    />
  );
}
