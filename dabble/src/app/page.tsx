import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";
import BottomNav from "@/components/BottomNav";
import GreetingHeader from "@/components/GreetingHeader";
import WeeklyProgress from "@/components/WeeklyProgress";
import QuickRecord from "@/components/QuickRecord";
import BuddyStatus from "@/components/BuddyStatus";

function HomeShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-screen max-w-md mx-auto fade-up"
      style={{
        backgroundColor: "var(--color-surface-base)",
        paddingBottom: "calc(60px + env(safe-area-inset-bottom) + 1.5rem)",
      }}
    >
      {children}
      <BottomNav active="home" />
    </main>
  );
}

function HomeBody() {
  return (
    <>
      <GreetingHeader />

      <BuddyStatus />

      <WeeklyProgress />

      <div className="px-5 pt-7">
        <QuickRecord />
        <p
          className="mt-3 text-center text-[12px]"
          style={{ color: "var(--color-ink-muted)" }}
        >
          一次只记 30 秒。先动起来，再讲道理。
        </p>
      </div>
    </>
  );
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <HomeShell>
        <HomeBody />
      </HomeShell>
    );
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.personalityType) redirect("/quiz");

  return (
    <HomeShell>
      <HomeBody />
    </HomeShell>
  );
}
