import { PERSONALITY_PROFILES } from "@/lib/personality";
import { DEMO_USER } from "@/lib/demo-data";
import type { PersonalityType } from "@/types";

const DEMO_NAME = DEMO_USER.name;
const DEMO_PERSONALITY: PersonalityType = DEMO_USER.personalityType;

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

export default function GreetingHeader() {
  const greeting = greetingFor(new Date());
  const profile = PERSONALITY_PROFILES[DEMO_PERSONALITY];

  return (
    <GreetingRow
      greeting={greeting}
      name={DEMO_NAME}
      subtitle={`${profile.name} · ${profile.slogan}`}
    />
  );
}
