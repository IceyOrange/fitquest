import WorkoutForm from "@/components/WorkoutForm";
import BottomNav from "@/components/BottomNav";

export default function RecordPage() {
  return (
    <main
      className="min-h-screen max-w-md mx-auto fade-up"
      style={{
        backgroundColor: "var(--color-surface-base)",
        paddingBottom: "calc(60px + env(safe-area-inset-bottom) + 1.5rem)",
      }}
    >
      <header className="px-5 pt-7 pb-5">
        <div
          className="text-[11px] uppercase"
          style={{
            color: "var(--color-ink-tertiary)",
            letterSpacing: "0.14em",
          }}
        >
          记录
        </div>
        <h1
          className="font-display mt-1.5"
          style={{
            color: "var(--color-ink-primary)",
            fontSize: "26px",
            lineHeight: 1.15,
            letterSpacing: "0.01em",
          }}
        >
          今天动了什么？
        </h1>
        <p
          className="mt-2 text-[13px]"
          style={{ color: "var(--color-ink-tertiary)" }}
        >
          只填三件事 · 30 秒内搞定。
        </p>
      </header>

      <div
        style={{
          borderTop: "1px solid var(--color-line-soft)",
        }}
      >
        <WorkoutForm />
      </div>
      <BottomNav />
    </main>
  );
}
