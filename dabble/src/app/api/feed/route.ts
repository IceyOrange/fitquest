import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ items: [], nextCursor: null });

  const userId = (session.user as Record<string, unknown>).id as string;
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const cursor = url.searchParams.get("cursor");

  const friendships = await prisma.friendship.findMany({
    where: { status: "accepted", OR: [{ userId }, { friendId: userId }] },
    select: { userId: true, friendId: true },
  });
  const friendIds = friendships.map((f) => f.userId === userId ? f.friendId : f.userId);
  const visibleUserIds = [userId, ...friendIds];

  const feedItems = await prisma.feedItem.findMany({
    where: { userId: { in: visibleUserIds } },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      user: { select: { id: true, name: true, personalityType: true, image: true } },
      interactions: { select: { id: true, userId: true, type: true, content: true } },
    },
  });

  const hasMore = feedItems.length > limit;
  const items = hasMore ? feedItems.slice(0, -1) : feedItems;

  return NextResponse.json({ items, nextCursor: hasMore ? items[items.length - 1].id : null });
}
