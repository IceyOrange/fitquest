import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import BadgeWall from "@/components/BadgeWall";
import StreakHeatmap from "@/components/StreakHeatmap";
import SignOutButton from "@/components/SignOutButton";
import BottomNav from "@/components/BottomNav";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as Record<string, unknown>).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="p-4 border-b border-gray-100"><h1 className="text-lg font-bold">我的</h1></div>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl">{user?.name?.[0] || "?"}</div>
          <div>
            <div className="font-bold">{user?.name}</div>
            <div className="text-xs text-gray-400">最长连续 {user?.longestStreak || 0} 天</div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2">📅 运动热力图</h3>
          <StreakHeatmap />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2">🏅 徽章墙</h3>
          <BadgeWall />
        </div>
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <a href="/quiz" className="block text-sm text-primary-500 font-medium py-2">重新测试运动性格</a>
          <SignOutButton />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
