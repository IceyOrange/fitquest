import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let type: string, duration: number, distance: number | undefined, buddySessionId: string | undefined;
  try {
    ({ type, duration, distance, buddySessionId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!type || !duration || duration <= 0) {
    return NextResponse.json({ error: "Type and duration are required" }, { status: 400 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  const workout = await prisma.workout.create({
    data: { userId, type, duration, distance: distance || null, source: "manual", buddySessionId: buddySessionId || null },
  });

  // Update lastWorkoutAt
  await prisma.user.update({
    where: { id: userId },
    data: { lastWorkoutAt: new Date() },
  });

  // Handle buddy session completion
  let buddyCompleted = false;
  if (buddySessionId) {
    await prisma.buddySessionParticipant.update({
      where: { sessionId_userId: { sessionId: buddySessionId, userId } },
      data: { workoutId: workout.id, joinedAt: new Date() },
    });

    const session = await prisma.buddySession.findUnique({
      where: { id: buddySessionId },
      include: { participants: true },
    });

    if (session && session.participants.every(p => p.workoutId)) {
      await prisma.buddySession.update({
        where: { id: buddySessionId },
        data: { status: "completed" },
      });
      buddyCompleted = true;
    }
  }

  // Create feed item
  if (buddyCompleted && buddySessionId) {
    await prisma.feedItem.create({
      data: { userId, type: "buddy_workout", content: { sessionId: buddySessionId, type, duration } },
    });
  } else {
    await prisma.feedItem.create({
      data: { userId, type: "workout", content: { workoutType: type, duration, distance: distance ?? null } },
    });
  }

  return NextResponse.json({ id: workout.id, buddyCompleted });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as Record<string, unknown>).id as string;
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "30");

  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { recordedAt: "desc" },
    take: limit,
  });
  return NextResponse.json({ workouts });
}
