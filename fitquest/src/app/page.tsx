import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";
import PersonalityCard from "@/components/PersonalityCard";
import StreakBlock from "@/components/StreakBlock";
import FriendSummary from "@/components/FriendSummary";
import NextBadgeProgress from "@/components/NextBadgeProgress";
import BottomNav from "@/components/BottomNav";
import type { PersonalityType } from "@/types";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as Record<string, unknown>).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.personalityType) redirect("/quiz");

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white pb-20">
      <div className="p-4 space-y-3">
        <PersonalityCard personalityType={user.personalityType as PersonalityType} energy={user.personalityEnergy} />
        <StreakBlock streakDays={user.streakDays} />
        <FriendSummary />
        <NextBadgeProgress />
        <a href="/record" className="block">
          <button className="btn-primary mt-2">⚡ 记录今日运动</button>
        </a>
        <p className="text-center text-xs text-gray-400">运动后性格能量将恢复至 100%</p>
      </div>
      <BottomNav />
    </div>
  );
}
