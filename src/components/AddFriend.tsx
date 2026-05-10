"use client";

import { useState } from "react";

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[18px] h-[18px]"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[16px] h-[16px]"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6l-12 12" />
    </svg>
  );
}

export default function AddFriend() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendEmail: email.trim() }),
    });

    if (res.ok) {
      setMessage("加进来了。");
      setEmail("");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "添加失败，检查一下邮箱。");
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-5 py-4 flex items-center justify-between tap-shrink"
      >
        <span
          className="text-[14px]"
          style={{ color: "var(--color-ink-secondary)" }}
        >
          添加搭子
        </span>
        <span
          className="flex items-center gap-1.5 text-[12px]"
          style={{ color: "var(--color-ink-tertiary)" }}
        >
          <span>邮箱邀请</span>
          <PlusIcon />
        </span>
      </button>
    );
  }

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[14px]"
          style={{ color: "var(--color-ink-secondary)" }}
        >
          添加搭子
        </span>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError("");
            setMessage("");
          }}
          className="tap-shrink"
          style={{ color: "var(--color-ink-tertiary)" }}
          aria-label="收起"
        >
          <CloseIcon />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="他的邮箱"
          required
          autoFocus
          className="flex-1 px-3 py-2.5 text-[14px] focus:outline-none"
          style={{
            backgroundColor: "var(--color-surface-sunken)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-ink-primary)",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 text-[14px] tap-shrink font-display disabled:opacity-45"
          style={{
            backgroundColor: "var(--color-brand-500)",
            color: "var(--color-surface-raised)",
            borderRadius: "var(--radius-md)",
          }}
        >
          {loading ? "…" : "邀请"}
        </button>
      </form>
      {message && (
        <div
          className="text-[12px] mt-2"
          style={{ color: "var(--color-success)" }}
        >
          {message}
        </div>
      )}
      {error && (
        <div
          className="text-[12px] mt-2"
          style={{ color: "var(--color-danger)" }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
