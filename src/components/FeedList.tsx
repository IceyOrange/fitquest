"use client";

import { useState } from "react";
import FeedItem from "./FeedItem";
import { DEMO_FEED } from "@/lib/demo-data";

interface FeedData {
  id: string;
  type: string;
  content: Record<string, unknown>;
  createdAt: string;
  user: { id: string; name: string; personalityType: string | null };
  interactions: {
    id: string;
    userId: string;
    type: string;
    content: string | null;
  }[];
}

export default function FeedList() {
  const [items] = useState<FeedData[]>(DEMO_FEED);

  if (items.length === 0) {
    return (
      <div className="px-5 pt-12 pb-8 text-center">
        <div
          className="font-display"
          style={{
            color: "var(--color-ink-secondary)",
            fontSize: "18px",
            lineHeight: 1.4,
          }}
        >
          这里还没有动静
        </div>
        <div
          className="mt-1.5 text-[13px]"
          style={{ color: "var(--color-ink-tertiary)" }}
        >
          做这一片的第一个声音。
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="px-5 py-3 text-[12px]"
        style={{
          color: "var(--color-ink-tertiary)",
          backgroundColor: "var(--color-surface-sunken)",
          borderBottom: "1px solid var(--color-line-soft)",
        }}
      >
        以下是预览动态
      </div>
      <div
        className="divide-y"
        style={{ borderColor: "var(--color-line-soft)" }}
      >
        {items.map((item) => (
          <FeedItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
