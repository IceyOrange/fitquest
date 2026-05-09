"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/circle", label: "运动圈", icon: "👥" },
  { href: "/record", label: "记录", icon: "⚡" },
  { href: "/profile", label: "我的", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100">
      <div className="flex justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${active ? "text-primary-500" : "text-gray-400 hover:text-gray-600"}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
