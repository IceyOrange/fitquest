"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { QUIZ_QUESTIONS } from "@/lib/quiz-questions";
import { PERSONALITY_PROFILES } from "@/lib/personality";
import type { PersonalityType } from "@/types";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-screen max-w-md mx-auto fade-up"
      style={{ backgroundColor: "var(--color-surface-base)" }}
    >
      {children}
    </main>
  );
}

export default function QuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<PersonalityType | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return (
      <PageShell>
        <div
          className="min-h-screen flex items-center justify-center text-[13px]"
          style={{ color: "var(--color-ink-muted)" }}
        >
          加载中…
        </div>
      </PageShell>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const handleSelect = async (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setLoading(true);
      const res = await fetch("/api/quiz/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: newAnswers }),
      });
      const data = await res.json();
      setResult(data.personalityType);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="min-h-screen flex flex-col items-center justify-center px-5">
          <div
            className="text-[11px] uppercase"
            style={{
              color: "var(--color-ink-tertiary)",
              letterSpacing: "0.14em",
            }}
          >
            正在拼对你的运动性格
          </div>
          <div
            className="mt-4 h-[2px] w-32 overflow-hidden"
            style={{ backgroundColor: "var(--color-line-soft)" }}
          >
            <div
              className="h-full"
              style={{
                width: "100%",
                backgroundColor: "var(--color-brand-300)",
                animation: "fade-up 1.2s ease-out infinite alternate",
              }}
            />
          </div>
        </div>
      </PageShell>
    );
  }

  if (result) {
    const profile = PERSONALITY_PROFILES[result];
    return (
      <PageShell>
        <div className="min-h-screen flex flex-col px-5 pt-16 pb-10">
          <div
            className="text-[11px] uppercase"
            style={{
              color: "var(--color-ink-tertiary)",
              letterSpacing: "0.14em",
            }}
          >
            你是
          </div>
          <h1
            className="font-display mt-3"
            style={{
              color: "var(--color-ink-primary)",
              fontSize: "44px",
              lineHeight: 1.1,
              letterSpacing: "0.01em",
            }}
          >
            {profile.name}
          </h1>
          <div
            className="mt-4 text-[15px]"
            style={{
              color: "var(--color-brand-500)",
              lineHeight: 1.6,
            }}
          >
            「{profile.slogan}」
          </div>

          <div
            className="my-7"
            style={{ borderTop: "1px solid var(--color-line-soft)" }}
          />

          <p
            className="text-[14px]"
            style={{
              color: "var(--color-ink-secondary)",
              lineHeight: 1.7,
            }}
          >
            性格不变，节奏在变。
            <br />
            动起来之后，再来这里看看你是不是真的还在这一类。
          </p>

          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn-primary tap-shrink"
            >
              开始动起来
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  const question = QUIZ_QUESTIONS[current];
  const progress = ((current + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <PageShell>
      <div className="min-h-screen flex flex-col px-5 pt-10 pb-10">
        <div className="mb-9">
          <div
            className="flex items-baseline justify-between mb-2 text-[11px] uppercase"
            style={{
              color: "var(--color-ink-tertiary)",
              letterSpacing: "0.14em",
            }}
          >
            <span>性格 · 第 {current + 1} / {QUIZ_QUESTIONS.length} 题</span>
            <span className="font-mono-num">
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="h-[2px] overflow-hidden"
            style={{ backgroundColor: "var(--color-line-soft)" }}
          >
            <div
              className="h-full transition-[width] duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: "var(--color-brand-500)",
              }}
            />
          </div>
        </div>

        <h2
          className="font-display"
          style={{
            color: "var(--color-ink-primary)",
            fontSize: "22px",
            lineHeight: 1.4,
            letterSpacing: "0.005em",
          }}
        >
          {question.question}
        </h2>

        <ul
          className="mt-7 divide-y"
          style={{
            borderTop: "1px solid var(--color-line-soft)",
            borderBottom: "1px solid var(--color-line-soft)",
            borderColor: "var(--color-line-soft)",
          }}
        >
          {question.options.map((option, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(i)}
                className="w-full text-left flex items-center justify-between py-4 tap-shrink group"
                style={{ color: "var(--color-ink-primary)" }}
              >
                <span
                  className="text-[15px]"
                  style={{ lineHeight: 1.5 }}
                >
                  {option.text}
                </span>
                <span
                  className="font-mono-num text-[12px] ml-3 shrink-0"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
