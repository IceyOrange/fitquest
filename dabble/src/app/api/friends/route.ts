import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ friends: [] });

  const userId = (session.user as Record<string, unknown>).id as string;

  const friendships = await prisma.friendship.findMany({
    where: { status: "accepted", OR: [{ userId }, { friendId: userId }] },
    include: {
      user: { select: { id: true, name: true, image: true, personalityType: true, lastWorkoutAt: true } },
      friend: { select: { id: true, name: true, image: true, personalityType: true, lastWorkoutAt: true } },
    },
  });

  const friends = friendships.map((f) => {
    const friendData = f.userId === userId ? f.friend : f.user;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const lastWorkout = friendData.lastWorkoutAt ? new Date(friendData.lastWorkoutAt) : null;
    return { ...friendData, exercisedToday: !!(lastWorkout && lastWorkout >= today) };
  });

  return NextResponse.json({ friends });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as Record<string, unknown>).id as string;
  let friendEmail: string;
  try {
    ({ friendEmail } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const friend = await prisma.user.findUnique({ where: { email: friendEmail } });
  if (!friend) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (friend.id === userId) return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });

  const existing = await prisma.friendship.findFirst({
    where: { OR: [{ userId, friendId: friend.id }, { userId: friend.id, friendId: userId }] },
  });
  if (existing) return NextResponse.json({ error: "Friendship already exists" }, { status: 409 });

  await prisma.friendship.create({ data: { userId, friendId: friend.id, status: "accepted" } });
  return NextResponse.json({ success: true });
}
