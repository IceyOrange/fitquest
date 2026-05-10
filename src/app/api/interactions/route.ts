import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as Record<string, unknown>).id as string;
  let feedItemId: string, type: string, content: string | null;
  try {
    ({ feedItemId, type, content } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!feedItemId || !type) return NextResponse.json({ error: "feedItemId and type required" }, { status: 400 });
  if (!["like", "comment", "witness"].includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const existing = await prisma.interaction.findUnique({
    where: { feedItemId_userId_type: { feedItemId, userId, type } },
  });
  if (existing) return NextResponse.json({ error: "Already interacted" }, { status: 409 });

  const interaction = await prisma.interaction.create({
    data: { feedItemId, userId, type, content: content || null },
  });
  return NextResponse.json({ interaction });
}
