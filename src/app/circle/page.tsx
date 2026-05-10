import FeedList from "@/components/FeedList";
import AddFriend from "@/components/AddFriend";
import BottomNav from "@/components/BottomNav";

export default function CirclePage() {
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
          Circle · 运动圈
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
          搭子们都在动什么
        </h1>
        <p
          className="mt-2 text-[13px]"
          style={{ color: "var(--color-ink-tertiary)" }}
        >
          看到熟人正在动的那一刻，就是你最该起身的那一刻。
        </p>
      </header>

      <div
        style={{
          borderTop: "1px solid var(--color-line-soft)",
          borderBottom: "1px solid var(--color-line-soft)",
        }}
      >
        <AddFriend />
      </div>

      <FeedList />
      <BottomNav active="circle" />
    </main>
  );
}
