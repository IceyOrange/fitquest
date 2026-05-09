"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { QUIZ_QUESTIONS } from "@/lib/quiz-questions";
import { PERSONALITY_PROFILES } from "@/lib/personality";
import type { PersonalityType } from "@/types";

export default function QuizPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<PersonalityType | null>(null);
  const [loading, setLoading] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🔮</div>
          <p className="text-gray-500">正在分析你的运动性格...</p>
        </div>
      </div>
    );
  }

  if (result) {
    const profile = PERSONALITY_PROFILES[result];
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="rounded-2xl p-8 mb-6" style={{ background: profile.gradient }}>
            <div className="text-6xl mb-3">{profile.emoji}</div>
            <h2 className="text-2xl font-bold" style={{ color: profile.textColor }}>{profile.name}</h2>
            <p className="mt-2 text-sm opacity-80" style={{ color: profile.textColor }}>{profile.slogan}</p>
          </div>
          <button onClick={() => router.push("/")} className="btn-primary">开始运动之旅</button>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[current];

  return (
    <div className="min-h-screen px-4 py-8 max-w-sm mx-auto">
      <div className="mb-8">
        <div className="flex gap-1 mb-4">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= current ? "bg-primary-500" : "bg-gray-200"}`} />
          ))}
        </div>
        <p className="text-sm text-gray-400">{current + 1} / {QUIZ_QUESTIONS.length}</p>
      </div>
      <h2 className="text-xl font-bold mb-6">{question.question}</h2>
      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button key={i} onClick={() => handleSelect(i)}
            className="w-full text-left px-4 py-4 rounded-2xl border-2 border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-colors font-medium">
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
