"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="block w-full text-left tap-shrink py-3 text-[14px]"
      style={{ color: "var(--color-ink-tertiary)" }}
    >
      退出登录
    </button>
  );
}
