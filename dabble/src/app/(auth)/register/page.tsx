"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function GhostInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-transparent py-3 text-[16px] focus:outline-none transition-colors"
      style={{
        color: "var(--color-ink-primary)",
        borderBottom: "1px solid var(--color-line-firm)",
      }}
    />
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/login?registered=1");
    } else {
      const data = await res.json();
      setError(data.error || "注册失败，再试一次。");
    }
    setLoading(false);
  };

  return (
    <main
      className="min-h-screen flex flex-col px-6 pt-20 pb-10 max-w-sm mx-auto fade-up"
      style={{ backgroundColor: "var(--color-surface-base)" }}
    >
      <div
        className="text-[11px] uppercase"
        style={{
          color: "var(--color-ink-tertiary)",
          letterSpacing: "0.14em",
        }}
      >
        加入搭搭动
      </div>
      <h1
        className="font-display mt-2"
        style={{
          color: "var(--color-ink-primary)",
          fontSize: "32px",
          lineHeight: 1.15,
          letterSpacing: "0.01em",
        }}
      >
        和搭子一起动
      </h1>
      <p
        className="mt-2 text-[14px]"
        style={{ color: "var(--color-ink-tertiary)" }}
      >
        三个字段，进得去就能动。
      </p>

      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
        {error && (
          <div
            className="text-[13px]"
            style={{ color: "var(--color-danger)" }}
          >
            {error}
          </div>
        )}
        <GhostInput
          type="text"
          placeholder="昵称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="nickname"
        />
        <GhostInput
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <GhostInput
          type="password"
          placeholder="密码 · 6 位以上"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary tap-shrink"
          >
            {loading ? "建账号中…" : "建一个账号"}
          </button>
        </div>
      </form>

      <p
        className="text-center text-[13px] mt-8"
        style={{ color: "var(--color-ink-tertiary)" }}
      >
        已有账号？{" "}
        <Link
          href="/login"
          className="font-display"
          style={{
            color: "var(--color-brand-500)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          登录
        </Link>
      </p>
    </main>
  );
}
