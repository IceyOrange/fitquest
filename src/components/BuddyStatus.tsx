import Link from "next/link";

const WORKOUT_LABELS: Record<string, string> = {
  running: "跑步",
  gym: "健身",
  swimming: "游泳",
  yoga: "瑜伽",
  cycling: "骑行",
  basketball: "篮球",
  badminton: "羽毛球",
  football: "足球",
  hiking: "徒步",
  other: "运动",
};

interface ActiveFriend {
  id: string;
  name: string;
  type: string;
  startedAt: Date;
}

function workoutLabel(type: string | null | undefined): string {
  if (!type) return "运动";
  return WORKOUT_LABELS[type] ?? "运动";
}

function timeAgoLabel(d: Date): string {
  const m = Math.max(0, Math.floor((Date.now() - d.getTime()) / 60000));
  if (m < 1) return "刚刚出发";
  return `${m} 分钟前出发`;
}

function MomentEyebrow({
  label,
  live = false,
}: {
  label: string;
  live?: boolean;
}) {
  return (
    <div
      className="text-[11px] uppercase flex items-center gap-2"
      style={{
        color: "var(--color-ink-tertiary)",
        letterSpacing: "0.18em",
      }}
    >
      <span>{label}</span>
      {live && (
        <span
          className="live-dot"
          style={{ width: "8px", height: "8px" }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function MomentLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-display inline-flex items-baseline gap-1.5 mt-7 text-[15px] tap-shrink"
      style={{ color: "var(--color-brand-700)" }}
    >
      <span
        style={{
          borderBottom: "1px solid var(--color-brand-300)",
          paddingBottom: "1px",
        }}
      >
        {children}
      </span>
      <span style={{ color: "var(--color-brand-500)" }}>→</span>
    </Link>
  );
}

/* === Active state — the moment block === */
function ActiveBlock({ friends }: { friends: ActiveFriend[] }) {
  const isSolo = friends.length === 1;
  return (
    <section
      className="px-5 pt-7 pb-9 fade-up"
      style={{
        backgroundColor: "var(--color-brand-50)",
        borderTop: "1px solid var(--color-line-soft)",
        borderBottom: "1px solid var(--color-brand-100)",
      }}
    >
      <MomentEyebrow label="此 刻" live />

      {isSolo ? (
        <>
          <h2
            className="font-display mt-3"
            style={{
              color: "var(--color-ink-primary)",
              fontSize: "40px",
              lineHeight: 1.05,
              letterSpacing: "0.005em",
            }}
          >
            {friends[0].name}
          </h2>
          <div
            className="font-display mt-1.5"
            style={{
              color: "var(--color-brand-700)",
              fontSize: "20px",
              lineHeight: 1.2,
            }}
          >
            正在动
          </div>
          <div
            className="mt-3 text-[12px] font-mono-num"
            style={{ color: "var(--color-ink-tertiary)" }}
          >
            {workoutLabel(friends[0].type)} · {timeAgoLabel(friends[0].startedAt)}
          </div>
        </>
      ) : (
        <>
          <div className="mt-3 flex items-baseline gap-3 flex-wrap">
            <span
              className="font-mono-num"
              style={{
                color: "var(--color-brand-700)",
                fontSize: "56px",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}
            >
              {friends.length}
            </span>
            <span
              className="font-display"
              style={{
                color: "var(--color-ink-primary)",
                fontSize: "22px",
                lineHeight: 1.15,
              }}
            >
              位搭子
              <span
                style={{
                  color: "var(--color-brand-700)",
                  marginLeft: "0.4rem",
                }}
              >
                正在动
              </span>
            </span>
          </div>

          <ul className="mt-6 flex flex-col gap-3.5">
            {friends.map((f) => (
              <li key={f.id} className="flex items-center gap-3">
                <span
                  className="live-dot shrink-0"
                  style={{ width: "10px", height: "10px" }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="font-display"
                    style={{
                      color: "var(--color-ink-primary)",
                      fontSize: "18px",
                      lineHeight: 1.25,
                      letterSpacing: "0.005em",
                    }}
                  >
                    {f.name}
                  </div>
                  <div
                    className="text-[12px] mt-0.5 font-mono-num"
                    style={{ color: "var(--color-ink-tertiary)" }}
                  >
                    {workoutLabel(f.type)} · {timeAgoLabel(f.startedAt)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <MomentLink href="/record">
        {isSolo ? "你也跟上 " : "跟上他们 "}
      </MomentLink>
    </section>
  );
}

/* === Demo data for unauth landing — show off the killer state === */
function buildDemoFriends(): ActiveFriend[] {
  const now = Date.now();
  return [
    {
      id: "demo-1",
      name: "小明",
      type: "running",
      startedAt: new Date(now - 13 * 60 * 1000),
    },
    {
      id: "demo-2",
      name: "小红",
      type: "gym",
      startedAt: new Date(now - 4 * 60 * 1000),
    },
  ];
}

export default function BuddyStatus() {
  return <ActiveBlock friends={buildDemoFriends()} />;
}
