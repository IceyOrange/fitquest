"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("邮箱或密码不对。");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
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
        登录
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
        欢迎回来
      </h1>
      <p
        className="mt-2 text-[14px]"
        style={{ color: "var(--color-ink-tertiary)" }}
      >
        你的搭子还在群里等你。
      </p>

      {registered && (
        <div
          className="mt-7 text-[13px]"
          style={{ color: "var(--color-success)" }}
        >
          注册好了 · 用刚才的邮箱进来。
        </div>
      )}

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
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <GhostInput
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary tap-shrink"
          >
            {loading ? "进来中…" : "进来"}
          </button>
        </div>
      </form>

      <p
        className="text-center text-[13px] mt-8"
        style={{ color: "var(--color-ink-tertiary)" }}
      >
        还没有账号？{" "}
        <Link
          href="/register"
          className="font-display"
          style={{
            color: "var(--color-brand-500)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          注册
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center text-[13px]"
          style={{ color: "var(--color-ink-muted)" }}
        >
          加载中…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
