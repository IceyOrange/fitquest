"use client";

import Link from "next/link";

const NAV_ITEMS = [
  { key: "home" as const, label: "首页", href: "/" },
  { key: "circle" as const, label: "运动圈", href: "/circle" },
  { key: "profile" as const, label: "我的", href: "/profile" },
];

interface BottomNavProps {
  active?: "home" | "circle" | "profile";
}

function HomeIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[22px] h-[22px]"
      aria-hidden="true"
    >
      <path d="M3.5 11.2 12 4l8.5 7.2" />
      <path d="M5.5 10.5V20h13v-9.5" />
    </svg>
  );
}

function PeopleIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[22px] h-[22px]"
      aria-hidden="true"
    >
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3 19c.7-2.7 3.1-4.3 6-4.3s5.3 1.6 6 4.3" />
      <circle cx="17" cy="9.5" r="2.4" />
      <path d="M16 14.7c2.3 0 4.2 1.1 4.7 3" />
    </svg>
  );
}

function PersonIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[22px] h-[22px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 19.5c1-3.6 3.9-5.4 7.5-5.4s6.5 1.8 7.5 5.4" />
    </svg>
  );
}

const ICONS = {
  home: HomeIcon,
  circle: PeopleIcon,
  profile: PersonIcon,
};

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50"
      style={{ backgroundColor: "var(--color-surface-raised)" }}
    >
      <div
        className="border-t flex items-stretch h-[60px]"
        style={{ borderColor: "var(--color-line-soft)" }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          const Icon = ICONS[item.key];
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="flex-1 flex flex-col items-center justify-center gap-[2px] tap-shrink"
              style={{
                color: isActive
                  ? "var(--color-ink-primary)"
                  : "var(--color-ink-tertiary)",
              }}
            >
              <Icon filled={isActive} />
              <span
                className="text-[11px]"
                style={{ letterSpacing: "0.02em" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
