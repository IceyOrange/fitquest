"use client";

import { useEffect, useState } from "react";

interface Friend { id: string; name: string; personalityType: string | null; exercisedToday: boolean; }

export default function FriendSummary() {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    fetch("/api/friends").then((r) => r.json()).then((data) => setFriends(data.friends || []));
  }, []);

  const todayFriends = friends.filter((f) => f.exercisedToday);

  if (friends.length === 0) return (
    <div className="card"><div className="text-sm text-gray-500">还没有好友，添加好友一起运动吧！</div></div>
  );

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-2">
        {todayFriends.length > 0 && (
          <>
            <div className="flex -space-x-2">
              {todayFriends.slice(0, 3).map((f) => (
                <div key={f.id} className="w-6 h-6 rounded-full bg-accent-blue flex items-center justify-center text-[10px] border-2 border-white">{f.name[0]}</div>
              ))}
            </div>
            <span className="text-sm"><b>{todayFriends.length} 位好友</b>今天已运动</span>
          </>
        )}
        {todayFriends.length === 0 && <span className="text-sm text-gray-500">今天还没有好友运动，做第一个！</span>}
      </div>
      {todayFriends.length > 0 && (
        <div className="bg-blue-50 p-2 rounded-lg text-xs text-accent-blue">
          {todayFriends[0].name} 刚完成了运动 · 去看看
        </div>
      )}
    </div>
  );
}
