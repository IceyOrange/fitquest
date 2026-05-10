import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

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

/* === Upcoming buddy session — also heavy, but no live-dot === */
function UpcomingBlock({
  startInMin,
  others,
}: {
  startInMin: number;
  others: string[];
}) {
  const others4 = others.slice(0, 4);
  const moreLabel = others.length > others4.length ? ` 等 ${others.length} 人` : "";

  return (
    <section
      className="px-5 pt-7 pb-9 fade-up"
      style={{
        backgroundColor: "var(--color-brand-50)",
        borderTop: "1px solid var(--color-line-soft)",
        borderBottom: "1px solid var(--color-brand-100)",
      }}
    >
      <MomentEyebrow
        label={startInMin > 0 ? "约 定" : "现 在 出 发"}
      />

      <div className="mt-3 flex items-baseline gap-3 flex-wrap">
        {startInMin > 0 ? (
          <>
            <span
              className="font-mono-num"
              style={{
                color: "var(--color-brand-700)",
                fontSize: "56px",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}
            >
              {startInMin}
            </span>
            <span
              className="font-display"
              style={{
                color: "var(--color-ink-primary)",
                fontSize: "22px",
                lineHeight: 1.15,
              }}
            >
              分钟后<span
                style={{
                  color: "var(--color-brand-700)",
                  marginLeft: "0.4rem",
                }}
              >一起动</span>
            </span>
          </>
        ) : (
          <span
            className="font-display"
            style={{
              color: "var(--color-ink-primary)",
              fontSize: "32px",
              lineHeight: 1.1,
              letterSpacing: "0.005em",
            }}
          >
            搭子时间到啦
          </span>
        )}
      </div>

      <div
        className="mt-3 text-[14px]"
        style={{ color: "var(--color-ink-secondary)" }}
      >
        和 {others4.join("、")}{moreLabel}
      </div>

      <MomentLink href="/record">
        {startInMin > 0 ? "我已经在路上 " : "马上记一笔 "}
      </MomentLink>
    </section>
  );
}

/* === Empty / no buddies — quiet, no tint, no live-dot === */
function EmptyBlock() {
  return (
    <section
      className="px-5 pt-7 pb-8 fade-up"
      style={{
        borderTop: "1px solid var(--color-line-soft)",
        borderBottom: "1px solid var(--color-line-soft)",
      }}
    >
      <MomentEyebrow label="此 刻 · 安 静" />
      <div
        className="font-display mt-3"
        style={{
          color: "var(--color-ink-primary)",
          fontSize: "22px",
          lineHeight: 1.4,
          letterSpacing: "0.005em",
        }}
      >
        还没有搭子在动
      </div>
      <p
        className="mt-2 text-[13px]"
        style={{ color: "var(--color-ink-tertiary)", lineHeight: 1.65 }}
      >
        先动一次，再把性格卡片发给最常一起吃饭的那个人。
      </p>
      <MomentLink href="/circle">去运动圈找搭子 </MomentLink>
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

/* === Default export — server component that dispatches between states === */
export default async function BuddyStatus() {
  const session = await getServerSession(authOptions);

  // Demo branch — show the active state at its strongest
  if (!session?.user) {
    return <ActiveBlock friends={buildDemoFriends()} />;
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const now = new Date();
  const halfHourAgo = new Date(now.getTime() - 30 * 60 * 1000);

  // 1. Upcoming buddy session
  const upcomingSession = await prisma.buddySession.findFirst({
    where: {
      participants: { some: { userId } },
      status: { in: ["pending", "active"] },
      windowEnd: { gte: now },
    },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
    orderBy: { windowStart: "asc" },
  });

  if (upcomingSession) {
    const others = upcomingSession.participants
      .filter((p) => p.userId !== userId)
      .map((p) => p.user.name ?? "搭子");
    const startInMin = Math.max(
      0,
      Math.floor(
        (upcomingSession.windowStart.getTime() - now.getTime()) / 60000,
      ),
    );
    return <UpcomingBlock startInMin={startInMin} others={others} />;
  }

  // 2. Active friends in last 30 min
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { userId, status: "accepted" },
        { friendId: userId, status: "accepted" },
      ],
    },
  });
  const friendIds = friendships.map((f) =>
    f.userId === userId ? f.friendId : f.userId,
  );

  if (friendIds.length > 0) {
    const rows = await prisma.user.findMany({
      where: {
        id: { in: friendIds },
        lastWorkoutAt: { gte: halfHourAgo },
      },
      select: {
        id: true,
        name: true,
        lastWorkoutAt: true,
        workouts: {
          where: { recordedAt: { gte: halfHourAgo } },
          orderBy: { recordedAt: "desc" },
          take: 1,
          select: { type: true, recordedAt: true },
        },
      },
      orderBy: { lastWorkoutAt: "desc" },
      take: 6,
    });

    const active: ActiveFriend[] = rows
      .map((u) => {
        const w = u.workouts[0];
        const startedAt = w?.recordedAt ?? u.lastWorkoutAt;
        if (!startedAt) return null;
        return {
          id: u.id,
          name: u.name ?? "搭子",
          type: w?.type ?? "other",
          startedAt,
        };
      })
      .filter((f): f is ActiveFriend => f !== null);

    if (active.length > 0) {
      return <ActiveBlock friends={active} />;
    }
  }

  // 3. Empty
  return <EmptyBlock />;
}
