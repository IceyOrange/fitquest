import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { calculateQuizResult } from "@/lib/quiz-questions";
import { calculatePersonality } from "@/lib/personality";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { answers } = await req.json();
  if (!Array.isArray(answers) || answers.length !== 6) {
    return NextResponse.json({ error: "6 answers required" }, { status: 400 });
  }

  const scores = calculateQuizResult(answers);
  const personalityType = calculatePersonality(scores);

  const userId = (session.user as Record<string, unknown>).id as string;
  await prisma.user.update({
    where: { id: userId },
    data: { personalityType },
  });

  return NextResponse.json({ personalityType, scores });
}
