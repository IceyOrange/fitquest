import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { PERSONALITY_PROFILES } from "@/lib/personality";
import StreakHeatmap from "@/components/StreakHeatmap";
import SignOutButton from "@/components/SignOutButton";
import BottomNav from "@/components/BottomNav";

const WORKOUT_LABELS: Record<string, string> = {
  running: "跑步",
  gym: "健身",
  swimming: "游泳",
  yoga: "瑜伽",
  cycling: "骑行",
  basketball: "篮球",
};

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[14px] h-[14px]"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function Section({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 py-6">
      <div
        className="text-[11px] uppercase mb-3"
        style={{
          color: "var(--color-ink-tertiary)",
          letterSpacing: "0.14em",
        }}
      >
        {eyebrow}
      </div>
      {children}
    </section>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-screen max-w-md mx-auto fade-up"
      style={{
        backgroundColor: "var(--color-surface-base)",
        paddingBottom: "calc(60px + env(safe-area-inset-bottom) + 1.5rem)",
      }}
    >
      {children}
      <BottomNav active="profile" />
    </main>
  );
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <PageShell>
        <div className="px-5 pt-7 pb-5">
          <div
            className="text-[11px] uppercase"
            style={{
              color: "var(--color-ink-tertiary)",
              letterSpacing: "0.14em",
            }}
          >
            我的
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
            还没有账号
          </h1>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--color-line-soft)",
            borderBottom: "1px solid var(--color-line-soft)",
          }}
          className="px-5 py-7"
        >
          <p
            className="text-[14px]"
            style={{ color: "var(--color-ink-secondary)", lineHeight: 1.7 }}
          >
            注册一个账号，可以
            <br />
            把每次的动作攒成一年的热力图，
            <br />
            也能让搭子看到你今天有没有动。
          </p>
        </div>

        <div className="px-5 pt-7 space-y-3">
          <a href="/register" className="block">
            <button type="button" className="btn-primary tap-shrink">
              注册账号
            </button>
          </a>
          <a
            href="/login"
            className="block text-center text-[13px] py-2"
            style={{ color: "var(--color-ink-tertiary)" }}
          >
            已有账号？去登录
          </a>
        </div>
      </PageShell>
    );
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");

  const profile = user.personalityType
    ? PERSONALITY_PROFILES[
        user.personalityType as keyof typeof PERSONALITY_PROFILES
      ]
    : null;

  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { recordedAt: "desc" },
    take: 365,
    select: { recordedAt: true, type: true, duration: true },
  });

  return (
    <PageShell>
      {/* Identity — quiet, no gradient hero */}
      <header className="px-5 pt-7 pb-6">
        <div
          className="text-[11px] uppercase"
          style={{
            color: "var(--color-ink-tertiary)",
            letterSpacing: "0.14em",
          }}
        >
          我的
        </div>
        <h1
          className="font-display mt-1.5"
          style={{
            color: "var(--color-ink-primary)",
            fontSize: "28px",
            lineHeight: 1.15,
            letterSpacing: "0.01em",
          }}
        >
          {user.name}
        </h1>
        {profile ? (
          <div className="mt-2.5">
            <div
              className="text-[14px]"
              style={{ color: "var(--color-brand-500)" }}
            >
              {profile.name}
            </div>
            <div
              className="mt-1 text-[13px]"
              style={{ color: "var(--color-ink-tertiary)", lineHeight: 1.55 }}
            >
              {profile.slogan}
            </div>
          </div>
        ) : (
          <div
            className="mt-2.5 text-[13px]"
            style={{ color: "var(--color-ink-tertiary)" }}
          >
            还没测过性格 ·{" "}
            <a
              href="/quiz"
              style={{
                color: "var(--color-brand-500)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              去测一下
            </a>
          </div>
        )}
      </header>

      <div
        className="divide-y"
        style={{ borderColor: "var(--color-line-soft)" }}
      >
        <div
          style={{
            borderTop: "1px solid var(--color-line-soft)",
            borderColor: "var(--color-line-soft)",
          }}
        >
          <Section eyebrow="近半年的动静">
            <StreakHeatmap />
          </Section>
        </div>

        <div style={{ borderColor: "var(--color-line-soft)" }}>
          <Section eyebrow="最近的运动">
            {workouts.length === 0 ? (
              <div
                className="text-[13px]"
                style={{ color: "var(--color-ink-tertiary)" }}
              >
                还一次没动呢。
              </div>
            ) : (
              <ul
                className="divide-y"
                style={{ borderColor: "var(--color-line-soft)" }}
              >
                {workouts.slice(0, 8).map((w, i) => {
                  const label = WORKOUT_LABELS[w.type] ?? w.type;
                  const date = new Date(w.recordedAt);
                  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
                  return (
                    <li
                      key={i}
                      className="flex items-baseline justify-between py-3"
                    >
                      <div className="flex items-baseline gap-2">
                        <span
                          className="font-mono-num text-[12px]"
                          style={{ color: "var(--color-ink-muted)" }}
                        >
                          {dateStr}
                        </span>
                        <span
                          className="text-[14px]"
                          style={{ color: "var(--color-ink-primary)" }}
                        >
                          {label}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className="font-mono-num text-[15px]"
                          style={{ color: "var(--color-ink-secondary)" }}
                        >
                          {w.duration}
                        </span>
                        <span
                          className="text-[12px]"
                          style={{ color: "var(--color-ink-tertiary)" }}
                        >
                          分钟
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>

        <div style={{ borderColor: "var(--color-line-soft)" }}>
          <Section eyebrow="设置">
            <a
              href="/quiz"
              className="flex items-center justify-between py-3 tap-shrink"
              style={{ color: "var(--color-ink-primary)" }}
            >
              <span className="text-[14px]">重新测一次性格</span>
              <span style={{ color: "var(--color-ink-muted)" }}>
                <ChevronRightIcon />
              </span>
            </a>
            <div
              style={{ borderTop: "1px solid var(--color-line-soft)" }}
            >
              <SignOutButton />
            </div>
          </Section>
        </div>
      </div>
    </PageShell>
  );
}
