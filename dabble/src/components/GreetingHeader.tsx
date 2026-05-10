import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { PERSONALITY_PROFILES } from "@/lib/personality";
import type { PersonalityType } from "@/types";

const DEMO_NAME = "小宇";
const DEMO_PERSONALITY: PersonalityType = "dawn_walker";

function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 5) return "夜还长";
  if (h < 11) return "早上好";
  if (h < 14) return "中午好";
  if (h < 18) return "下午好";
  if (h < 22) return "晚上好";
  return "夜深了";
}

interface RowProps {
  greeting: string;
  name: string;
  subtitle: string | null;
}

function GreetingRow({ greeting, name, subtitle }: RowProps) {
  return (
    <div className="px-5 pt-7 pb-5 fade-up">
      <div
        className="text-[13px]"
        style={{
          color: "var(--color-ink-tertiary)",
          letterSpacing: "0.04em",
        }}
      >
        {greeting}
      </div>
      <h1
        className="font-display mt-1"
        style={{
          color: "var(--color-ink-primary)",
          fontSize: "26px",
          lineHeight: 1.15,
          letterSpacing: "0.01em",
        }}
      >
        {name}
        <span
          style={{
            color: "var(--color-ink-tertiary)",
            fontWeight: 400,
            marginLeft: "0.35rem",
          }}
        >
          ，
        </span>
        <span
          style={{ color: "var(--color-brand-500)" }}
        >
          今天动一动？
        </span>
      </h1>
      {subtitle && (
        <div
          className="mt-2 text-[13px]"
          style={{ color: "var(--color-ink-tertiary)" }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default async function GreetingHeader() {
  const session = await getServerSession(authOptions);
  const greeting = greetingFor(new Date());

  if (!session?.user) {
    const profile = PERSONALITY_PROFILES[DEMO_PERSONALITY];
    return (
      <GreetingRow
        greeting={greeting}
        name={DEMO_NAME}
        subtitle={`${profile.name} · ${profile.slogan}`}
      />
    );
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const profile = user.personalityType
    ? PERSONALITY_PROFILES[user.personalityType as keyof typeof PERSONALITY_PROFILES]
    : null;

  return (
    <GreetingRow
      greeting={greeting}
      name={user.name ?? "你"}
      subtitle={profile ? `${profile.name} · ${profile.slogan}` : null}
    />
  );
}
