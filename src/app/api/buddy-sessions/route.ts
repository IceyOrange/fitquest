import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// 创建搭子会话
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  let friendIds: string[], windowStart: string, windowEnd: string;
  try {
    ({ friendIds, windowStart, windowEnd } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(friendIds) || friendIds.length === 0) {
    return NextResponse.json({ error: "至少选择一位搭子" }, { status: 400 });
  }

  const buddySession = await prisma.buddySession.create({
    data: {
      windowStart: new Date(windowStart),
      windowEnd: new Date(windowEnd),
      participants: {
        create: [
          { userId },
          ...friendIds.map((fid: string) => ({ userId: fid })),
        ],
      },
    },
    include: { participants: true },
  });

  return NextResponse.json(buddySession);
}

// 获取我的进行中/即将开始的搭子会话
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as Record<string, unknown>).id as string;

  const now = new Date();
  const sessions = await prisma.buddySession.findMany({
    where: {
      participants: { some: { userId } },
      status: { in: ["pending", "active"] },
      windowEnd: { gte: now },
    },
    include: {
      participants: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
    orderBy: { windowStart: "asc" },
  });

  return NextResponse.json(sessions);
}
