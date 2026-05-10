"use client";

import { useState } from "react";
import { DEMO_FRIENDS } from "@/lib/demo-data";
import { getProfile } from "@/lib/personality";

interface Friend { id: string; name: string; personalityType: string | null; exercisedToday: boolean; }

export default function FriendSummary() {
  const [friends] = useState<Friend[]>(DEMO_FRIENDS);
  const [expanded, setExpanded] = useState(false);

  const todayFriends = friends.filter((f) => f.exercisedToday);
  const notTodayFriends = friends.filter((f) => !f.exercisedToday);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {todayFriends.length > 0 && (
            <div className="flex -space-x-2">
              {todayFriends.slice(0, 4).map((f) => (
                <div key={f.id} className="w-6 h-6 rounded-full bg-accent-blue flex items-center justify-center text-[10px] border-2 border-white text-white font-bold">{f.name[0]}</div>
              ))}
            </div>
          )}
          <span className="text-sm font-bold">
            {todayFriends.length > 0
              ? <>{todayFriends.length} 位好友<b className="text-accent-green">已运动</b></>
              : <span className="text-gray-500">今天还没有好友运动</span>
            }
          </span>
        </div>
        {friends.length > 0 && (
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary-500 font-medium">
            {expanded ? "收起" : "查看全部"}
          </button>
        )}
      </div>

      {expanded && (
        <div className="space-y-2 pt-2 border-t border-gray-50">
          {todayFriends.map((f) => (
            <FriendRow key={f.id} friend={f} active />
          ))}
          {notTodayFriends.map((f) => (
            <FriendRow key={f.id} friend={f} active={false} />
          ))}
        </div>
      )}

      {!expanded && todayFriends.length > 0 && (
        <div className="bg-blue-50 p-2 rounded-lg text-xs text-accent-blue">
          {todayFriends[0].name} 刚完成了运动 · 做第一个！
        </div>
      )}
    </div>
  );
}

function FriendRow({ friend, active }: { friend: Friend; active: boolean }) {
  const p = friend.personalityType ? getProfile(friend.personalityType as Parameters<typeof getProfile>[0]) : null;

  return (
    <div className="flex items-center gap-2 py-1">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${p?.gradientClass || "bg-gray-100"}`}>
        {p?.emoji || "😊"}
      </div>
      <span className="text-sm flex-1">{friend.name}</span>
      <span className={`text-xs font-medium ${active ? "text-accent-green" : "text-gray-400"}`}>
        {active ? "✓ 已运动" : "未运动"}
      </span>
    </div>
  );
}
