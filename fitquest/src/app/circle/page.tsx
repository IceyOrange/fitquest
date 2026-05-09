import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth.config";
import FeedList from "@/components/FeedList";
import BottomNav from "@/components/BottomNav";

export default async function CirclePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 border-b border-gray-100"><h1 className="text-lg font-bold">运动圈</h1></div>
      <div className="p-4"><FeedList /></div>
      <BottomNav />
    </div>
  );
}
