"use client";

import { useEffect, useState } from "react";
import FeedItem from "./FeedItem";

interface FeedData {
  id: string; type: string; content: Record<string, unknown>; createdAt: string;
  user: { id: string; name: string; personalityType: string | null };
  interactions: { id: string; userId: string; type: string; content: string | null }[];
}

export default function FeedList() {
  const [items, setItems] = useState<FeedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed").then((r) => r.json()).then((data) => {
      setItems(data.items || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-8 text-gray-400">加载中...</div>;
  if (items.length === 0) return (
    <div className="text-center py-12 text-gray-400">
      <div className="text-3xl mb-2">🏃</div><p>还没有动态，去运动吧！</p>
    </div>
  );

  return <div className="space-y-3">{items.map((item) => <FeedItem key={item.id} {...item} />)}</div>;
}
