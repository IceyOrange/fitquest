# FitQuest V1 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a gamified exercise motivation web app for college students with personality-driven gamification, badge achievements, and social feed.

**Architecture:** Next.js 14+ (App Router) full-stack app with Prisma + PostgreSQL (Supabase). Frontend pages and API routes in one project, deployed to Vercel via GitHub. Server Components for data fetching, Client Components for interactive UI.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Prisma, PostgreSQL (Supabase), NextAuth.js, Jest, Vercel

---

## File Structure

```
fitquest/
├── prisma/
│   └── schema.prisma                # Database schema
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind base + custom theme
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── page.tsx                 # Homepage (5-section persuasion chain)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx       # Login page
│   │   │   └── register/page.tsx    # Registration page
│   │   ├── quiz/
│   │   │   └── page.tsx             # Personality quiz
│   │   ├── circle/
│   │   │   └── page.tsx             # Social feed
│   │   ├── profile/
│   │   │   └── page.tsx             # My profile + badge wall
│   │   ├── record/
│   │   │   └── page.tsx             # Record workout
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       │   └── route.ts         # NextAuth handler
│   │       ├── register/
│   │       │   └── route.ts         # User registration
│   │       ├── quiz/
│   │       │   └── result/
│   │       │       └── route.ts     # Save quiz result
│   │       ├── workouts/
│   │       │   └── route.ts         # CRUD workouts
│   │       ├── badges/
│   │       │   └── route.ts         # Get user badges
│   │       ├── feed/
│   │       │   └── route.ts         # Get feed items
│   │       ├── friends/
│   │       │   └── route.ts         # Friend management
│   │       └── interactions/
│   │           └── route.ts         # Like, comment, witness
│   ├── components/
│   │   ├── BottomNav.tsx            # Bottom tab navigation
│   │   ├── PersonalityCard.tsx      # Personality avatar + state
│   │   ├── EnergyBar.tsx            # Energy progress bar
│   │   ├── StreakBlock.tsx          # 7-day streak display
│   │   ├── StreakHeatmap.tsx        # GitHub-style yearly heatmap
│   │   ├── BadgeCard.tsx            # Single badge display
│   │   ├── BadgeWall.tsx            # Full badge grid
│   │   ├── FeedItem.tsx             # Single feed item
│   │   ├── FeedList.tsx             # Feed scrollable list
│   │   ├── WorkoutForm.tsx          # Record workout form
│   │   ├── FriendSummary.tsx        # Friends exercised today
│   │   └── NextBadgeProgress.tsx    # Next badge progress bar
│   ├── lib/
│   │   ├── prisma.ts                # Prisma client singleton
│   │   ├── auth.config.ts           # NextAuth configuration
│   │   ├── personality.ts           # Personality calculation
│   │   ├── energy.ts                # Energy calculation
│   │   ├── badges.ts                # Badge definitions + checking
│   │   ├── streak.ts                # Streak calculation
│   │   └── quiz-questions.ts        # Quiz question data
│   └── types/
│       └── index.ts                 # Shared TypeScript types
├── __tests__/
│   ├── personality.test.ts
│   ├── energy.test.ts
│   ├── badges.test.ts
│   └── streak.test.ts
├── package.json
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── jest.config.ts
└── .env.example
```

---

## Phase 1: Project Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `fitquest/` (entire project scaffold)

- [ ] **Step 1: Create Next.js project with TypeScript and Tailwind**

Run:
```bash
cd /Users/Lovegood/Desktop/Sports
npx create-next-app@latest fitquest --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults for all prompts. This creates the project with App Router, TypeScript, and Tailwind configured.

- [ ] **Step 2: Install core dependencies**

Run:
```bash
cd fitquest
npm install prisma @prisma/client next-auth @next-auth/prisma-adapter framer-motion
npm install -D @types/jest jest ts-jest @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Initialize Prisma**

Run:
```bash
npx prisma init
```

This creates `prisma/schema.prisma` and `.env`.

- [ ] **Step 4: Commit**

```bash
cd /Users/Lovegood/Desktop/Sports
git add fitquest/
git commit -m "feat: initialize Next.js project with TypeScript, Tailwind, Prisma"
```

---

### Task 2: Configure Tailwind Theme

**Files:**
- Modify: `fitquest/src/app/globals.css`
- Modify: `fitquest/tailwind.config.ts`

- [ ] **Step 1: Update tailwind.config.ts with custom theme**

Replace the entire content of `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a29bfe",
          500: "#6C5CE7",
          600: "#5b4bd5",
          700: "#4a3ab8",
          800: "#3d2f96",
          900: "#342b78",
        },
        accent: {
          orange: "#E17055",
          green: "#00B894",
          blue: "#0984E3",
          gold: "#FDCB6E",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Update globals.css with base styles**

Replace the entire content of `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
  }
}

@layer components {
  .card {
    @apply bg-white rounded-2xl p-4 shadow-sm;
  }
  .btn-primary {
    @apply bg-gradient-to-r from-primary-500 to-primary-400 text-white font-bold rounded-2xl py-4 px-6 w-full shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-transform;
  }
  .badge-pill {
    @apply inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add fitquest/tailwind.config.ts fitquest/src/app/globals.css
git commit -m "feat: configure Tailwind theme with FitQuest colors and utilities"
```

---

### Task 3: Database Schema

**Files:**
- Modify: `fitquest/prisma/schema.prisma`

- [ ] **Step 1: Write the complete Prisma schema**

Replace `prisma/schema.prisma` entirely:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String     @id @default(cuid())
  name              String
  email             String     @unique
  emailVerified     DateTime?
  passwordHash      String
  image             String?
  personalityType   String?    @map("personality_type")
  personalityEnergy Int        @default(100) @map("personality_energy")
  streakDays        Int        @default(0) @map("streak_days")
  longestStreak     Int        @default(0) @map("longest_streak")
  lastWorkoutAt     DateTime?  @map("last_workout_at")
  createdAt         DateTime   @default(now()) @map("created_at")
  updatedAt         DateTime   @updatedAt @map("updated_at")

  workouts      Workout[]
  badges        Badge[]
  sentRequests  Friendship[] @relation("UserFriends")
  receivedRequests Friendship[] @relation("UserFriendOf")
  feedItems     FeedItem[]
  contracts     Contract[]
  interactions  Interaction[]

  @@map("users")
}

model Workout {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  type       String   // running, gym, swimming, yoga, cycling, basketball, etc.
  duration   Int      // minutes
  distance   Float?   // kilometers, optional
  source     String   @default("manual") // manual, keep, apple_health
  recordedAt DateTime @default(now()) @map("recorded_at")
  createdAt  DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("workouts")
}

model Badge {
  id         String    @id @default(cuid())
  userId     String    @map("user_id")
  series     String    // consistency, endurance, exploration, social
  tier       String    // bronze, silver, gold
  unlockedAt DateTime? @map("unlocked_at")
  progress   Float     @default(0) // 0.0 to 1.0
  createdAt  DateTime  @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, series, tier])
  @@map("badges")
}

model Friendship {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  friendId  String   @map("friend_id")
  status    String   @default("pending") // pending, accepted
  createdAt DateTime @default(now()) @map("created_at")

  user    User @relation("UserFriends", fields: [userId], references: [id], onDelete: Cascade)
  friend  User @relation("UserFriendOf", fields: [friendId], references: [id], onDelete: Cascade)

  @@unique([userId, friendId])
  @@map("friendships")
}

model FeedItem {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  type      String   // workout, badge_unlock, personality_evolve
  content   Json     // flexible content structure
  createdAt DateTime @default(now()) @map("created_at")

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  interactions Interaction[]

  @@map("feed_items")
}

model Interaction {
  id        String   @id @default(cuid())
  feedItemId String  @map("feed_item_id")
  userId    String   @map("user_id")
  type      String   // like, comment, witness
  content   String?  // comment text, null for like/witness
  createdAt DateTime @default(now()) @map("created_at")

  feedItem FeedItem @relation(fields: [feedItemId], references: [id], onDelete: Cascade)

  @@unique([feedItemId, userId, type])
  @@map("interactions")
}

model Contract {
  id           String   @id @default(cuid())
  userId       String   @map("user_id")
  weekStart    DateTime @map("week_start") // Monday of the week
  targetCount  Int      @map("target_count")
  actualCount  Int      @default(0) @map("actual_count")
  witnessIds   String   @default("[]") // JSON array of user IDs
  createdAt    DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("contracts")
}
```

- [ ] **Step 2: Create .env.example**

Create `fitquest/.env.example`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/fitquest?schema=public"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

- [ ] **Step 3: Commit**

```bash
git add fitquest/prisma/schema.prisma fitquest/.env.example
git commit -m "feat: define Prisma schema with User, Workout, Badge, Friendship, FeedItem, Interaction, Contract"
```

---

### Task 4: Prisma Client Singleton

**Files:**
- Create: `fitquest/src/lib/prisma.ts`

- [ ] **Step 1: Create Prisma client singleton**

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 2: Commit**

```bash
git add fitquest/src/lib/prisma.ts
git commit -m "feat: add Prisma client singleton for serverless compatibility"
```

---

### Task 5: Authentication Setup

**Files:**
- Create: `fitquest/src/lib/auth.config.ts`
- Create: `fitquest/src/app/api/auth/[...nextauth]/route.ts`
- Create: `fitquest/src/app/api/register/route.ts`
- Create: `fitquest/src/app/(auth)/login/page.tsx`
- Create: `fitquest/src/app/(auth)/register/page.tsx`

- [ ] **Step 1: Install bcrypt**

```bash
cd /Users/Lovegood/Desktop/Sports/fitquest
npm install bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 2: Create NextAuth config**

Create `src/lib/auth.config.ts`:

```typescript
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

- [ ] **Step 3: Create NextAuth API route handler**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth.config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

- [ ] **Step 4: Create registration API route**

Create `src/app/api/register/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  // Initialize all 12 badges for the new user
  const series = ["consistency", "endurance", "exploration", "social"] as const;
  const tiers = ["bronze", "silver", "gold"] as const;
  for (const s of series) {
    for (const t of tiers) {
      await prisma.badge.create({
        data: { userId: user.id, series: s, tier: t, progress: 0 },
      });
    }
  }

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
```

- [ ] **Step 5: Create registration page**

Create `src/app/(auth)/register/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/login?registered=1");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">加入 FitQuest</h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          发现你的运动性格
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="昵称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="password"
            placeholder="密码（6 位以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          已有账号？{" "}
          <Link href="/login" className="text-primary-500 font-medium">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create login page**

Create `src/app/(auth)/login/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("邮箱或密码错误");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">欢迎回来</h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          你的运动性格在等你
        </p>

        {registered && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl mb-4">
            注册成功！请登录
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          还没有账号？{" "}
          <Link href="/register" className="text-primary-500 font-medium">
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Add SessionProvider to layout**

Modify `src/app/layout.tsx` to wrap with SessionProvider:

```typescript
"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <SessionProvider>
          <div className="max-w-md mx-auto min-h-screen bg-white relative">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add fitquest/src/lib/auth.config.ts fitquest/src/app/api/ fitquest/src/app/\(auth\)/ fitquest/src/app/layout.tsx fitquest/package.json fitquest/package-lock.json
git commit -m "feat: add NextAuth credentials auth with register and login pages"
```

---

### Task 6: TypeScript Types

**Files:**
- Create: `fitquest/src/types/index.ts`

- [ ] **Step 1: Create shared type definitions**

Create `src/types/index.ts`:

```typescript
export type PersonalityType =
  | "dawn_walker"
  | "night_owl"
  | "fat_burner"
  | "zen_walker"
  | "free_spirit"
  | "precision_hunter"
  | "all_round"
  | "marathon_soul";

export type EnergyState = "thriving" | "hungry" | "wilting" | "evolving";

export type BadgeSeries =
  | "consistency"
  | "endurance"
  | "exploration"
  | "social";

export type BadgeTier = "bronze" | "silver" | "gold";

export type WorkoutType =
  | "running"
  | "gym"
  | "swimming"
  | "yoga"
  | "cycling"
  | "basketball"
  | "badminton"
  | "football"
  | "hiking"
  | "other";

export type FeedItemType =
  | "workout"
  | "badge_unlock"
  | "personality_evolve";

export type InteractionType = "like" | "comment" | "witness";

export interface PersonalityProfile {
  type: PersonalityType;
  emoji: string;
  name: string;
  slogan: string;
  gradient: string;
  textColor: string;
}

export interface EnergyInfo {
  state: EnergyState;
  value: number;
  emoji: string;
  label: string;
  color: string;
  description: string;
}

export interface BadgeDefinition {
  series: BadgeSeries;
  tier: BadgeTier;
  name: string;
  emoji: string;
  description: string;
  checkFn: (stats: UserStats) => boolean;
  progressFn: (stats: UserStats) => number;
}

export interface UserStats {
  streakDays: number;
  longestStreak: number;
  totalDistance: number;
  totalDuration: number;
  uniqueTypes: number;
  totalWorkouts: number;
  completedContracts: number;
  totalWitnesses: number;
}

export interface QuizAnswer {
  timePreference: number;    // -1 = morning, +1 = night
  intensityPreference: number; // -1 = low, +1 = high
  frequencyPattern: number;   // -1 = consistent, +1 = burst
  varietyPreference: number;  // -1 = focused, +1 = diverse
}
```

- [ ] **Step 2: Commit**

```bash
git add fitquest/src/types/index.ts
git commit -m "feat: add shared TypeScript type definitions"
```

---

## Phase 2: Personality System

### Task 7: Personality Profiles Data

**Files:**
- Create: `fitquest/src/lib/personality.ts`

- [ ] **Step 1: Write failing test for personality calculation**

Create `__tests__/personality.test.ts`:

```typescript
import { calculatePersonality, PERSONALITY_PROFILES } from "@/lib/personality";
import type { QuizAnswer } from "@/types";

describe("calculatePersonality", () => {
  it("returns dawn_walker for morning, consistent, moderate-high intensity", () => {
    const answer: QuizAnswer = {
      timePreference: -0.8,
      intensityPreference: 0.3,
      frequencyPattern: -0.7,
      varietyPreference: 0.0,
    };
    expect(calculatePersonality(answer)).toBe("dawn_walker");
  });

  it("returns night_owl for night, high intensity, burst", () => {
    const answer: QuizAnswer = {
      timePreference: 0.8,
      intensityPreference: 0.7,
      frequencyPattern: 0.5,
      varietyPreference: -0.2,
    };
    expect(calculatePersonality(answer)).toBe("night_owl");
  });

  it("returns fat_burner for high intensity, consistent, focused", () => {
    const answer: QuizAnswer = {
      timePreference: 0.0,
      intensityPreference: 0.8,
      frequencyPattern: -0.6,
      varietyPreference: -0.7,
    };
    expect(calculatePersonality(answer)).toBe("fat_burner");
  });

  it("returns zen_walker for low intensity, consistent, diverse", () => {
    const answer: QuizAnswer = {
      timePreference: 0.0,
      intensityPreference: -0.6,
      frequencyPattern: -0.5,
      varietyPreference: 0.6,
    };
    expect(calculatePersonality(answer)).toBe("zen_walker");
  });

  it("returns free_spirit for burst, diverse, any time", () => {
    const answer: QuizAnswer = {
      timePreference: 0.2,
      intensityPreference: 0.1,
      frequencyPattern: 0.7,
      varietyPreference: 0.7,
    };
    expect(calculatePersonality(answer)).toBe("free_spirit");
  });

  it("returns precision_hunter for consistent, focused, planned", () => {
    const answer: QuizAnswer = {
      timePreference: -0.3,
      intensityPreference: 0.2,
      frequencyPattern: -0.8,
      varietyPreference: -0.8,
    };
    expect(calculatePersonality(answer)).toBe("precision_hunter");
  });

  it("returns all_round for diverse, balanced everything", () => {
    const answer: QuizAnswer = {
      timePreference: 0.0,
      intensityPreference: 0.0,
      frequencyPattern: 0.0,
      varietyPreference: 0.8,
    };
    expect(calculatePersonality(answer)).toBe("all_round");
  });

  it("returns marathon_soul for consistent, moderate, enduring", () => {
    const answer: QuizAnswer = {
      timePreference: -0.5,
      intensityPreference: -0.2,
      frequencyPattern: -0.9,
      varietyPreference: -0.3,
    };
    expect(calculatePersonality(answer)).toBe("marathon_soul");
  });
});

describe("PERSONALITY_PROFILES", () => {
  it("has 8 personality types", () => {
    expect(Object.keys(PERSONALITY_PROFILES)).toHaveLength(8);
  });

  it("each profile has required fields", () => {
    for (const profile of Object.values(PERSONALITY_PROFILES)) {
      expect(profile).toHaveProperty("type");
      expect(profile).toHaveProperty("emoji");
      expect(profile).toHaveProperty("name");
      expect(profile).toHaveProperty("slogan");
      expect(profile).toHaveProperty("gradient");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/Lovegood/Desktop/Sports/fitquest && npx jest __tests__/personality.test.ts --passWithNoTests 2>&1 | head -20`
Expected: FAIL — module not found

- [ ] **Step 3: Create personality.ts with profiles and calculation**

Create `src/lib/personality.ts`:

```typescript
import type {
  PersonalityType,
  PersonalityProfile,
  QuizAnswer,
} from "@/types";

export const PERSONALITY_PROFILES: Record<PersonalityType, PersonalityProfile> =
  {
    dawn_walker: {
      type: "dawn_walker",
      emoji: "🌅",
      name: "黎明行者",
      slogan: "太阳还没醒，我已经在路上了",
      gradient: "linear-gradient(135deg, #ffeaa7, #fdcb6e)",
      textColor: "#2d3436",
    },
    night_owl: {
      type: "night_owl",
      emoji: "🦉",
      name: "夜猫铁人",
      slogan: "夜深了，铁馆才是我的主场",
      gradient: "linear-gradient(135deg, #a29bfe, #6C5CE7)",
      textColor: "#ffffff",
    },
    fat_burner: {
      type: "fat_burner",
      emoji: "🔥",
      name: "燃脂战士",
      slogan: "不流汗不痛快",
      gradient: "linear-gradient(135deg, #ff7675, #d63031)",
      textColor: "#ffffff",
    },
    zen_walker: {
      type: "zen_walker",
      emoji: "🧘",
      name: "禅意行者",
      slogan: "运动是和自己对话",
      gradient: "linear-gradient(135deg, #81ecec, #00cec9)",
      textColor: "#2d3436",
    },
    free_spirit: {
      type: "free_spirit",
      emoji: "🌊",
      name: "自由浪人",
      slogan: "想动就动，不想就躺着",
      gradient: "linear-gradient(135deg, #74b9ff, #0984E3)",
      textColor: "#ffffff",
    },
    precision_hunter: {
      type: "precision_hunter",
      emoji: "🎯",
      name: "精准猎手",
      slogan: "每一练都在计划之中",
      gradient: "linear-gradient(135deg, #55efc4, #00B894)",
      textColor: "#2d3436",
    },
    all_round: {
      type: "all_round",
      emoji: "🦋",
      name: "全能蝶变",
      slogan: "什么都会一点，什么都爱",
      gradient: "linear-gradient(135deg, #fd79a8, #e84393)",
      textColor: "#ffffff",
    },
    marathon_soul: {
      type: "marathon_soul",
      emoji: "🏔️",
      name: "马拉松之魂",
      slogan: "不在于快，在于不停",
      gradient: "linear-gradient(135deg, #636e72, #2d3436)",
      textColor: "#ffffff",
    },
  };

interface PersonalityWeights {
  type: PersonalityType;
  score: number;
}

export function calculatePersonality(answer: QuizAnswer): PersonalityType {
  const { timePreference, intensityPreference, frequencyPattern, varietyPreference } =
    answer;

  const candidates: PersonalityWeights[] = [
    {
      type: "dawn_walker",
      score:
        (1 - Math.abs(timePreference + 0.7)) +
        (1 - Math.abs(intensityPreference - 0.3)) +
        (1 - Math.abs(frequencyPattern + 0.7)) +
        (1 - Math.abs(varietyPreference - 0.0)),
    },
    {
      type: "night_owl",
      score:
        (1 - Math.abs(timePreference - 0.7)) +
        (1 - Math.abs(intensityPreference - 0.7)) +
        (1 - Math.abs(frequencyPattern - 0.5)) +
        (1 - Math.abs(varietyPreference + 0.2)),
    },
    {
      type: "fat_burner",
      score:
        (1 - Math.abs(timePreference - 0.0)) +
        (1 - Math.abs(intensityPreference - 0.8)) +
        (1 - Math.abs(frequencyPattern + 0.6)) +
        (1 - Math.abs(varietyPreference + 0.7)),
    },
    {
      type: "zen_walker",
      score:
        (1 - Math.abs(timePreference - 0.0)) +
        (1 - Math.abs(intensityPreference + 0.6)) +
        (1 - Math.abs(frequencyPattern + 0.5)) +
        (1 - Math.abs(varietyPreference - 0.6)),
    },
    {
      type: "free_spirit",
      score:
        (1 - Math.abs(timePreference - 0.2)) +
        (1 - Math.abs(intensityPreference - 0.1)) +
        (1 - Math.abs(frequencyPattern - 0.7)) +
        (1 - Math.abs(varietyPreference - 0.7)),
    },
    {
      type: "precision_hunter",
      score:
        (1 - Math.abs(timePreference + 0.3)) +
        (1 - Math.abs(intensityPreference - 0.2)) +
        (1 - Math.abs(frequencyPattern + 0.8)) +
        (1 - Math.abs(varietyPreference + 0.8)),
    },
    {
      type: "all_round",
      score:
        (1 - Math.abs(timePreference - 0.0)) +
        (1 - Math.abs(intensityPreference - 0.0)) +
        (1 - Math.abs(frequencyPattern - 0.0)) +
        (1 - Math.abs(varietyPreference - 0.8)),
    },
    {
      type: "marathon_soul",
      score:
        (1 - Math.abs(timePreference + 0.5)) +
        (1 - Math.abs(intensityPreference + 0.2)) +
        (1 - Math.abs(frequencyPattern + 0.9)) +
        (1 - Math.abs(varietyPreference + 0.3)),
    },
  ];

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].type;
}

export function getProfile(type: PersonalityType): PersonalityProfile {
  return PERSONALITY_PROFILES[type];
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/Lovegood/Desktop/Sports/fitquest && npx jest __tests__/personality.test.ts`
Expected: All 10 tests PASS

- [ ] **Step 5: Commit**

```bash
git add fitquest/src/lib/personality.ts fitquest/__tests__/personality.test.ts
git commit -m "feat: add personality calculation with 8 types and quiz answer mapping"
```

---

### Task 8: Quiz Questions & Quiz Page

**Files:**
- Create: `fitquest/src/lib/quiz-questions.ts`
- Create: `fitquest/src/app/quiz/page.tsx`
- Create: `fitquest/src/app/api/quiz/result/route.ts`

- [ ] **Step 1: Create quiz question data**

Create `src/lib/quiz-questions.ts`:

```typescript
export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    scores: {
      timePreference: number;
      intensityPreference: number;
      frequencyPattern: number;
      varietyPreference: number;
    };
  }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "期末考试周，你的运动计划是？",
    options: [
      {
        text: "早起跑步清醒头脑",
        scores: { timePreference: -0.8, intensityPreference: 0.2, frequencyPattern: -0.6, varietyPreference: -0.3 },
      },
      {
        text: "晚上去健身房释放压力",
        scores: { timePreference: 0.7, intensityPreference: 0.7, frequencyPattern: 0.2, varietyPreference: -0.4 },
      },
      {
        text: "不运动，考试要紧",
        scores: { timePreference: 0, intensityPreference: 0, frequencyPattern: 0.8, varietyPreference: 0 },
      },
      {
        text: "随便做点拉伸，保持状态",
        scores: { timePreference: 0, intensityPreference: -0.6, frequencyPattern: -0.3, varietyPreference: 0.4 },
      },
    ],
  },
  {
    id: 2,
    question: "理想的运动时长是？",
    options: [
      {
        text: "30 分钟高效燃烧",
        scores: { timePreference: 0, intensityPreference: 0.8, frequencyPattern: 0.3, varietyPreference: -0.5 },
      },
      {
        text: "1 小时刚好舒服",
        scores: { timePreference: 0, intensityPreference: 0.2, frequencyPattern: -0.3, varietyPreference: 0.2 },
      },
      {
        text: "2 小时以上才过瘾",
        scores: { timePreference: 0, intensityPreference: 0.4, frequencyPattern: -0.7, varietyPreference: 0.3 },
      },
      {
        text: "看心情，10 分钟也行",
        scores: { timePreference: 0, intensityPreference: -0.4, frequencyPattern: 0.6, varietyPreference: 0.6 },
      },
    ],
  },
  {
    id: 3,
    question: "你会选哪种运动伙伴？",
    options: [
      {
        text: "比我强的，能带我进步",
        scores: { timePreference: 0, intensityPreference: 0.6, frequencyPattern: -0.5, varietyPreference: -0.4 },
      },
      {
        text: "有趣的人，边练边聊",
        scores: { timePreference: 0, intensityPreference: -0.3, frequencyPattern: 0.2, varietyPreference: 0.7 },
      },
      {
        text: "固定搭档，互相监督",
        scores: { timePreference: 0, intensityPreference: 0.1, frequencyPattern: -0.7, varietyPreference: -0.6 },
      },
      {
        text: "自己一个人最好",
        scores: { timePreference: 0, intensityPreference: 0.3, frequencyPattern: 0.3, varietyPreference: -0.2 },
      },
    ],
  },
  {
    id: 4,
    question: "新学期选体育课，你选？",
    options: [
      {
        text: "田径，经典永不过时",
        scores: { timePreference: -0.3, intensityPreference: 0.5, frequencyPattern: -0.6, varietyPreference: -0.7 },
      },
      {
        text: "瑜伽，身心合一",
        scores: { timePreference: 0, intensityPreference: -0.7, frequencyPattern: -0.4, varietyPreference: 0.3 },
      },
      {
        text: "都试试，选个没玩过的",
        scores: { timePreference: 0, intensityPreference: 0.1, frequencyPattern: 0.4, varietyPreference: 0.9 },
      },
      {
        text: "篮球，团队竞技才有意思",
        scores: { timePreference: 0.2, intensityPreference: 0.6, frequencyPattern: 0.1, varietyPreference: -0.2 },
      },
    ],
  },
  {
    id: 5,
    question: "一周运动的最佳节奏？",
    options: [
      {
        text: "每天固定时间练",
        scores: { timePreference: -0.2, intensityPreference: 0.1, frequencyPattern: -0.9, varietyPreference: -0.5 },
      },
      {
        text: "周末疯狂，平时休息",
        scores: { timePreference: 0.3, intensityPreference: 0.5, frequencyPattern: 0.8, varietyPreference: 0.1 },
      },
      {
        text: "想练就练，没有计划",
        scores: { timePreference: 0, intensityPreference: 0, frequencyPattern: 0.7, varietyPreference: 0.5 },
      },
      {
        text: "按课表来，一周 3-4 次",
        scores: { timePreference: 0, intensityPreference: 0.3, frequencyPattern: -0.5, varietyPreference: 0 },
      },
    ],
  },
  {
    id: 6,
    question: "运动时你在想什么？",
    options: [
      {
        text: "配速、心率、目标数据",
        scores: { timePreference: 0, intensityPreference: 0.6, frequencyPattern: -0.7, varietyPreference: -0.6 },
      },
      {
        text: "放空自己，享受当下",
        scores: { timePreference: 0, intensityPreference: -0.5, frequencyPattern: 0, varietyPreference: 0.4 },
      },
      {
        text: "今天要试试新动作",
        scores: { timePreference: 0, intensityPreference: 0.2, frequencyPattern: 0.3, varietyPreference: 0.8 },
      },
      {
        text: "再坚持一下，不能断链",
        scores: { timePreference: 0, intensityPreference: 0.4, frequencyPattern: -0.8, varietyPreference: -0.3 },
      },
    ],
  },
];

export function calculateQuizResult(
  answers: number[] // index of selected option for each question
): {
  timePreference: number;
  intensityPreference: number;
  frequencyPattern: number;
  varietyPreference: number;
} {
  const result = {
    timePreference: 0,
    intensityPreference: 0,
    frequencyPattern: 0,
    varietyPreference: 0,
  };

  for (let i = 0; i < answers.length; i++) {
    const question = QUIZ_QUESTIONS[i];
    const selectedOption = question.options[answers[i]];
    result.timePreference += selectedOption.scores.timePreference;
    result.intensityPreference += selectedOption.scores.intensityPreference;
    result.frequencyPattern += selectedOption.scores.frequencyPattern;
    result.varietyPreference += selectedOption.scores.varietyPreference;
  }

  // Normalize to -1..1 range
  const n = answers.length;
  result.timePreference /= n;
  result.intensityPreference /= n;
  result.frequencyPattern /= n;
  result.varietyPreference /= n;

  return result;
}
```

- [ ] **Step 2: Create quiz result API**

Create `src/app/api/quiz/result/route.ts`:

```typescript
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
    return NextResponse.json(
      { error: "6 answers required" },
      { status: 400 }
    );
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
```

- [ ] **Step 3: Create quiz page**

Create `src/app/quiz/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { QUIZ_QUESTIONS } from "@/lib/quiz-questions";
import { PERSONALITY_PROFILES } from "@/lib/personality";
import type { PersonalityType } from "@/types";

export default function QuizPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<PersonalityType | null>(null);
  const [loading, setLoading] = useState(false);

  if (!session) {
    router.push("/login");
    return null;
  }

  const handleSelect = async (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setLoading(true);
      const res = await fetch("/api/quiz/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: newAnswers }),
      });
      const data = await res.json();
      setResult(data.personalityType);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🔮</div>
          <p className="text-gray-500">正在分析你的运动性格...</p>
        </div>
      </div>
    );
  }

  if (result) {
    const profile = PERSONALITY_PROFILES[result];
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div
            className="rounded-2xl p-8 mb-6"
            style={{ background: profile.gradient }}
          >
            <div className="text-6xl mb-3">{profile.emoji}</div>
            <h2
              className="text-2xl font-bold"
              style={{ color: profile.textColor }}
            >
              {profile.name}
            </h2>
            <p
              className="mt-2 text-sm opacity-80"
              style={{ color: profile.textColor }}
            >
              {profile.slogan}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="btn-primary"
          >
            开始运动之旅
          </button>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[current];

  return (
    <div className="min-h-screen px-4 py-8 max-w-sm mx-auto">
      <div className="mb-8">
        <div className="flex gap-1 mb-4">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= current ? "bg-primary-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-400">
          {current + 1} / {QUIZ_QUESTIONS.length}
        </p>
      </div>

      <h2 className="text-xl font-bold mb-6">{question.question}</h2>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className="w-full text-left px-4 py-4 rounded-2xl border-2 border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-colors font-medium"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add fitquest/src/lib/quiz-questions.ts fitquest/src/app/quiz/page.tsx fitquest/src/app/api/quiz/result/route.ts
git commit -m "feat: add personality quiz with 6 questions and result page"
```

---

### Task 9: Energy System

**Files:**
- Create: `fitquest/src/lib/energy.ts`
- Create: `fitquest/__tests__/energy.test.ts`

- [ ] **Step 1: Write failing tests for energy calculation**

Create `__tests__/energy.test.ts`:

```typescript
import { calculateEnergy, getEnergyInfo } from "@/lib/energy";

describe("calculateEnergy", () => {
  it("returns 100 when last workout was today", () => {
    const now = new Date();
    expect(calculateEnergy(now)).toBe(100);
  });

  it("returns 100 when last workout was yesterday", () => {
    const yesterday = new Date(Date.now() - 1 * 86400000);
    expect(calculateEnergy(yesterday)).toBe(100);
  });

  it("returns 90 when last workout was 2 days ago", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000);
    expect(calculateEnergy(twoDaysAgo)).toBe(90);
  });

  it("returns 60 when last workout was 3 days ago", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
    expect(calculateEnergy(threeDaysAgo)).toBe(60);
  });

  it("returns 40 when last workout was 4 days ago", () => {
    const fourDaysAgo = new Date(Date.now() - 4 * 86400000);
    expect(calculateEnergy(fourDaysAgo)).toBe(40);
  });

  it("returns 20 when last workout was 5 days ago", () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400000);
    expect(calculateEnergy(fiveDaysAgo)).toBe(20);
  });

  it("returns 0 when last workout was 7+ days ago", () => {
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    expect(calculateEnergy(weekAgo)).toBe(0);
  });

  it("returns 100 when lastWorkoutAt is null", () => {
    expect(calculateEnergy(null)).toBe(50);
  });
});

describe("getEnergyInfo", () => {
  it("returns thriving for energy >= 80", () => {
    const info = getEnergyInfo(90);
    expect(info.state).toBe("thriving");
    expect(info.emoji).toBe("✨");
  });

  it("returns hungry for energy 40-79", () => {
    const info = getEnergyInfo(60);
    expect(info.state).toBe("hungry");
    expect(info.emoji).toBe("😴");
  });

  it("returns wilting for energy < 40", () => {
    const info = getEnergyInfo(20);
    expect(info.state).toBe("wilting");
    expect(info.emoji).toBe("🥀");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/Lovegood/Desktop/Sports/fitquest && npx jest __tests__/energy.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Create energy calculation logic**

Create `src/lib/energy.ts`:

```typescript
import type { EnergyInfo } from "@/types";

export function calculateEnergy(lastWorkoutAt: Date | null): number {
  if (!lastWorkoutAt) return 50;

  const now = new Date();
  const diffMs = now.getTime() - new Date(lastWorkoutAt).getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays <= 1) return 100;
  if (diffDays === 2) return 90;
  if (diffDays === 3) return 60;
  if (diffDays === 4) return 40;
  if (diffDays === 5) return 20;
  if (diffDays === 6) return 10;
  return 0;
}

export function getEnergyInfo(energy: number): EnergyInfo {
  if (energy >= 80) {
    return {
      state: "thriving",
      value: energy,
      emoji: "✨",
      label: "活力满满",
      color: "#00B894",
      description: "能量充沛，继续保持！",
    };
  }
  if (energy >= 40) {
    return {
      state: "hungry",
      value: energy,
      emoji: "😴",
      label: "渴望运动",
      color: "#FDCB6E",
      description: "能量正在衰减...",
    };
  }
  return {
    state: "wilting",
    value: energy,
    emoji: "🥀",
    label: "枯萎中",
    color: "#E17055",
    description: "快去运动拯救你的性格！",
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/Lovegood/Desktop/Sports/fitquest && npx jest __tests__/energy.test.ts`
Expected: All 11 tests PASS

- [ ] **Step 5: Commit**

```bash
git add fitquest/src/lib/energy.ts fitquest/__tests__/energy.test.ts
git commit -m "feat: add energy calculation with thriving/hungry/wilting states"
```

---

## Phase 3: Workout Recording & Streak

### Task 10: Streak Calculation

**Files:**
- Create: `fitquest/src/lib/streak.ts`
- Create: `fitquest/__tests__/streak.test.ts`

- [ ] **Step 1: Write failing tests for streak calculation**

Create `__tests__/streak.test.ts`:

```typescript
import { calculateStreak } from "@/lib/streak";

describe("calculateStreak", () => {
  it("returns 0 for empty workout list", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("returns 1 for single workout today", () => {
    const dates = [new Date()];
    expect(calculateStreak(dates)).toBe(1);
  });

  it("returns 3 for workouts today, yesterday, and 2 days ago", () => {
    const now = Date.now();
    const dates = [
      new Date(now),
      new Date(now - 86400000),
      new Date(now - 2 * 86400000),
    ];
    expect(calculateStreak(dates)).toBe(3);
  });

  it("breaks streak on a gap day", () => {
    const now = Date.now();
    const dates = [
      new Date(now),
      new Date(now - 2 * 86400000), // gap yesterday
    ];
    expect(calculateStreak(dates)).toBe(1);
  });

  it("counts multiple workouts on same day as one day", () => {
    const now = Date.now();
    const dates = [
      new Date(now),
      new Date(now), // same day
      new Date(now - 86400000),
    ];
    expect(calculateStreak(dates)).toBe(2);
  });

  it("starts streak from yesterday if no workout today", () => {
    const now = Date.now();
    const dates = [
      new Date(now - 86400000),
      new Date(now - 2 * 86400000),
    ];
    expect(calculateStreak(dates)).toBe(2);
  });

  it("returns 0 if most recent workout was 2+ days ago", () => {
    const now = Date.now();
    const dates = [new Date(now - 2 * 86400000)];
    expect(calculateStreak(dates)).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/Lovegood/Desktop/Sports/fitquest && npx jest __tests__/streak.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Create streak calculation logic**

Create `src/lib/streak.ts`:

```typescript
export function calculateStreak(workoutDates: Date[]): number {
  if (workoutDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDays = new Set<string>();
  for (const d of workoutDates) {
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    uniqueDays.add(day.toISOString().slice(0, 10));
  }

  const sortedDays = Array.from(uniqueDays).sort().reverse();

  const firstDay = new Date(sortedDays[0]);
  firstDay.setHours(0, 0, 0, 0);
  const diffFromToday = Math.floor(
    (today.getTime() - firstDay.getTime()) / 86400000
  );

  if (diffFromToday > 1) return 0;

  let streak = 1;
  let prevDay = firstDay;

  for (let i = 1; i < sortedDays.length; i++) {
    const currentDay = new Date(sortedDays[i]);
    currentDay.setHours(0, 0, 0, 0);
    const diff = Math.floor(
      (prevDay.getTime() - currentDay.getTime()) / 86400000
    );

    if (diff === 1) {
      streak++;
      prevDay = currentDay;
    } else {
      break;
    }
  }

  return streak;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/Lovegood/Desktop/Sports/fitquest && npx jest __tests__/streak.test.ts`
Expected: All 7 tests PASS

- [ ] **Step 5: Commit**

```bash
git add fitquest/src/lib/streak.ts fitquest/__tests__/streak.test.ts
git commit -m "feat: add streak calculation with gap detection"
```

---

### Task 11: Workout API & Recording Page

**Files:**
- Create: `fitquest/src/app/api/workouts/route.ts`
- Create: `fitquest/src/app/record/page.tsx`
- Create: `fitquest/src/components/WorkoutForm.tsx`

- [ ] **Step 1: Create workout API route**

Create `src/app/api/workouts/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { calculateEnergy } from "@/lib/energy";
import { calculateStreak } from "@/lib/streak";
import { checkAndUnlockBadges } from "@/lib/badges";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, duration, distance } = await req.json();
  if (!type || !duration || duration <= 0) {
    return NextResponse.json(
      { error: "Type and duration are required" },
      { status: 400 }
    );
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  const workout = await prisma.workout.create({
    data: {
      userId,
      type,
      duration,
      distance: distance || null,
      source: "manual",
    },
  });

  // Recalculate streak
  const allWorkouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { recordedAt: "desc" },
    select: { recordedAt: true },
  });
  const streakDays = calculateStreak(
    allWorkouts.map((w) => w.recordedAt)
  );
  const longestStreak = await prisma.user
    .findUnique({ where: { id: userId } })
    .then((u) => Math.max(u?.longestStreak || 0, streakDays));

  // Update user
  const now = new Date();
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastWorkoutAt: now,
      streakDays,
      longestStreak,
      personalityEnergy: 100,
    },
  });

  // Check badges
  const newBadges = await checkAndUnlockBadges(userId);

  // Create feed item for workout
  await prisma.feedItem.create({
    data: {
      userId,
      type: "workout",
      content: { workoutType: type, duration, distance },
    },
  });

  // Create feed items for any new badges
  for (const badge of newBadges) {
    await prisma.feedItem.create({
      data: {
        userId,
        type: "badge_unlock",
        content: { series: badge.series, tier: badge.tier },
      },
    });
  }

  return NextResponse.json({
    workout: { id: workout.id, type, duration },
    streakDays,
    newBadges: newBadges.length,
  });
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
```

- [ ] **Step 2: Create WorkoutForm component**

Create `src/components/WorkoutForm.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WorkoutType } from "@/types";

const WORKOUT_OPTIONS: { value: WorkoutType; label: string; emoji: string }[] =
  [
    { value: "running", label: "跑步", emoji: "🏃" },
    { value: "gym", label: "健身", emoji: "🏋️" },
    { value: "swimming", label: "游泳", emoji: "🏊" },
    { value: "yoga", label: "瑜伽", emoji: "🧘" },
    { value: "cycling", label: "骑行", emoji: "🚴" },
    { value: "basketball", label: "篮球", emoji: "🏀" },
    { value: "badminton", label: "羽毛球", emoji: "🏸" },
    { value: "football", label: "足球", emoji: "⚽" },
    { value: "hiking", label: "徒步", emoji: "🥾" },
    { value: "other", label: "其他", emoji: "💪" },
  ];

export default function WorkoutForm() {
  const router = useRouter();
  const [type, setType] = useState<WorkoutType | "">("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) {
      setError("请选择运动类型");
      return;
    }
    setError("");
    setLoading(true);

    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        duration: parseInt(duration),
        distance: distance ? parseFloat(distance) : null,
      }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("记录失败，请重试");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          运动类型
        </label>
        <div className="grid grid-cols-5 gap-2">
          {WORKOUT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
                type === opt.value
                  ? "bg-primary-100 border-2 border-primary-500"
                  : "bg-gray-50 border-2 border-transparent"
              }`}
            >
              <span className="text-xl">{opt.emoji}</span>
              <span className="text-xs mt-1 text-gray-600">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          运动时长（分钟）
        </label>
        <input
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="30"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          距离（公里，选填）
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="5"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary disabled:opacity-50"
      >
        {loading ? "记录中..." : "⚡ 记录今日运动"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create record page**

Create `src/app/record/page.tsx`:

```typescript
import WorkoutForm from "@/components/WorkoutForm";

export default function RecordPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-lg font-bold">记录运动</h1>
      </div>
      <WorkoutForm />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add fitquest/src/app/api/workouts/route.ts fitquest/src/components/WorkoutForm.tsx fitquest/src/app/record/page.tsx
git commit -m "feat: add workout recording with API, form, and streak update"
```

---

## Phase 4: Badge System

### Task 12: Badge Definitions & Checking

**Files:**
- Create: `fitquest/src/lib/badges.ts`
- Create: `fitquest/__tests__/badges.test.ts`

- [ ] **Step 1: Write failing tests for badge checking**

Create `__tests__/badges.test.ts`:

```typescript
import { BADGE_DEFINITIONS, checkBadges } from "@/lib/badges";
import type { UserStats } from "@/types";

describe("BADGE_DEFINITIONS", () => {
  it("has 12 badges (4 series × 3 tiers)", () => {
    expect(BADGE_DEFINITIONS).toHaveLength(12);
  });

  it("has 3 badges per series", () => {
    const series = ["consistency", "endurance", "exploration", "social"];
    for (const s of series) {
      expect(BADGE_DEFINITIONS.filter((b) => b.series === s)).toHaveLength(3);
    }
  });
});

describe("checkBadges", () => {
  const baseStats: UserStats = {
    streakDays: 0,
    longestStreak: 0,
    totalDistance: 0,
    totalDuration: 0,
    uniqueTypes: 0,
    totalWorkouts: 0,
    completedContracts: 0,
    totalWitnesses: 0,
  };

  it("unlocks consistency bronze at streak 7", () => {
    const results = checkBadges({ ...baseStats, streakDays: 7 });
    const badge = results.find(
      (b) => b.series === "consistency" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(true);
    expect(badge?.progress).toBeGreaterThanOrEqual(1);
  });

  it("does not unlock consistency bronze at streak 6", () => {
    const results = checkBadges({ ...baseStats, streakDays: 6 });
    const badge = results.find(
      (b) => b.series === "consistency" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(false);
    expect(badge?.progress).toBeLessThan(1);
  });

  it("unlocks endurance bronze at 10km", () => {
    const results = checkBadges({ ...baseStats, totalDistance: 10 });
    const badge = results.find(
      (b) => b.series === "endurance" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(true);
  });

  it("unlocks exploration bronze at 3 unique types", () => {
    const results = checkBadges({ ...baseStats, uniqueTypes: 3 });
    const badge = results.find(
      (b) => b.series === "exploration" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(true);
  });

  it("unlocks social bronze at 1 completed contract", () => {
    const results = checkBadges({ ...baseStats, completedContracts: 1 });
    const badge = results.find(
      (b) => b.series === "social" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(true);
  });

  it("shows progress for partially completed badges", () => {
    const results = checkBadges({ ...baseStats, streakDays: 3 });
    const badge = results.find(
      (b) => b.series === "consistency" && b.tier === "bronze"
    );
    expect(badge?.unlocked).toBe(false);
    expect(badge?.progress).toBeCloseTo(3 / 7, 1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/Lovegood/Desktop/Sports/fitquest && npx jest __tests__/badges.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Create badge definitions and checking logic**

Create `src/lib/badges.ts`:

```typescript
import type { BadgeSeries, BadgeTier, BadgeDefinition, UserStats } from "@/types";
import { prisma } from "@/lib/prisma";

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Consistency series (streak-based)
  {
    series: "consistency",
    tier: "bronze",
    name: "坚持之心 · 铜",
    emoji: "🥉",
    description: "连续运动 7 天",
    checkFn: (s) => s.streakDays >= 7,
    progressFn: (s) => Math.min(s.streakDays / 7, 1),
  },
  {
    series: "consistency",
    tier: "silver",
    name: "坚持之心 · 银",
    emoji: "🥈",
    description: "连续运动 14 天",
    checkFn: (s) => s.streakDays >= 14,
    progressFn: (s) => Math.min(s.streakDays / 14, 1),
  },
  {
    series: "consistency",
    tier: "gold",
    name: "坚持之心 · 金",
    emoji: "🥇",
    description: "连续运动 30 天",
    checkFn: (s) => s.streakDays >= 30,
    progressFn: (s) => Math.min(s.streakDays / 30, 1),
  },
  // Endurance series (distance-based)
  {
    series: "endurance",
    tier: "bronze",
    name: "里程之魂 · 铜",
    emoji: "🥉",
    description: "累计跑步 10km",
    checkFn: (s) => s.totalDistance >= 10,
    progressFn: (s) => Math.min(s.totalDistance / 10, 1),
  },
  {
    series: "endurance",
    tier: "silver",
    name: "里程之魂 · 银",
    emoji: "🥈",
    description: "累计跑步 50km",
    checkFn: (s) => s.totalDistance >= 50,
    progressFn: (s) => Math.min(s.totalDistance / 50, 1),
  },
  {
    series: "endurance",
    tier: "gold",
    name: "里程之魂 · 金",
    emoji: "🥇",
    description: "累计跑步 100km",
    checkFn: (s) => s.totalDistance >= 100,
    progressFn: (s) => Math.min(s.totalDistance / 100, 1),
  },
  // Exploration series (variety-based)
  {
    series: "exploration",
    tier: "bronze",
    name: "探索之翼 · 铜",
    emoji: "🥉",
    description: "尝试 3 种运动",
    checkFn: (s) => s.uniqueTypes >= 3,
    progressFn: (s) => Math.min(s.uniqueTypes / 3, 1),
  },
  {
    series: "exploration",
    tier: "silver",
    name: "探索之翼 · 银",
    emoji: "🥈",
    description: "尝试 5 种运动",
    checkFn: (s) => s.uniqueTypes >= 5,
    progressFn: (s) => Math.min(s.uniqueTypes / 5, 1),
  },
  {
    series: "exploration",
    tier: "gold",
    name: "探索之翼 · 金",
    emoji: "🥇",
    description: "尝试 8 种运动",
    checkFn: (s) => s.uniqueTypes >= 8,
    progressFn: (s) => Math.min(s.uniqueTypes / 8, 1),
  },
  // Social series (contract-based)
  {
    series: "social",
    tier: "bronze",
    name: "契约之证 · 铜",
    emoji: "🥉",
    description: "完成首份社交契约",
    checkFn: (s) => s.completedContracts >= 1,
    progressFn: (s) => Math.min(s.completedContracts / 1, 1),
  },
  {
    series: "social",
    tier: "silver",
    name: "契约之证 · 银",
    emoji: "🥈",
    description: "连续 4 周完成契约",
    checkFn: (s) => s.completedContracts >= 4,
    progressFn: (s) => Math.min(s.completedContracts / 4, 1),
  },
  {
    series: "social",
    tier: "gold",
    name: "契约之证 · 金",
    emoji: "🥇",
    description: "获见证 20 次",
    checkFn: (s) => s.totalWitnesses >= 20,
    progressFn: (s) => Math.min(s.totalWitnesses / 20, 1),
  },
];

export interface BadgeCheckResult {
  series: BadgeSeries;
  tier: BadgeTier;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  progress: number;
}

export function checkBadges(stats: UserStats): BadgeCheckResult[] {
  return BADGE_DEFINITIONS.map((def) => ({
    series: def.series,
    tier: def.tier,
    name: def.name,
    emoji: def.emoji,
    description: def.description,
    unlocked: def.checkFn(stats),
    progress: def.progressFn(stats),
  }));
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const workouts = await prisma.workout.findMany({
    where: { userId },
    select: { type: true, distance: true, duration: true },
  });

  const uniqueTypes = new Set(workouts.map((w) => w.type)).size;
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);

  const completedContracts = await prisma.contract.count({
    where: { userId, actualCount: { gte: prisma.contract.fields.targetCount } },
  });

  const totalWitnesses = await prisma.interaction.count({
    where: { type: "witness", feedItem: { userId } },
  });

  return {
    streakDays: user?.streakDays || 0,
    longestStreak: user?.longestStreak || 0,
    totalDistance,
    totalDuration,
    uniqueTypes,
    totalWorkouts: workouts.length,
    completedContracts,
    totalWitnesses,
  };
}

export async function checkAndUnlockBadges(
  userId: string
): Promise<{ series: string; tier: string }[]> {
  const stats = await getUserStats(userId);
  const results = checkBadges(stats);
  const newlyUnlocked: { series: string; tier: string }[] = [];

  for (const result of results) {
    if (result.unlocked) {
      const badge = await prisma.badge.findUnique({
        where: {
          userId_series_tier: {
            userId,
            series: result.series,
            tier: result.tier,
          },
        },
      });

      if (badge && !badge.unlockedAt) {
        await prisma.badge.update({
          where: { id: badge.id },
          data: { unlockedAt: new Date(), progress: 1 },
        });
        newlyUnlocked.push({ series: result.series, tier: result.tier });
      }
    } else {
      await prisma.badge.updateMany({
        where: {
          userId,
          series: result.series,
          tier: result.tier,
          unlockedAt: null,
        },
        data: { progress: result.progress },
      });
    }
  }

  return newlyUnlocked;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/Lovegood/Desktop/Sports/fitquest && npx jest __tests__/badges.test.ts`
Expected: All 9 tests PASS

- [ ] **Step 5: Commit**

```bash
git add fitquest/src/lib/badges.ts fitquest/__tests__/badges.test.ts
git commit -m "feat: add badge definitions and unlock checking for 12 badges across 4 series"
```

---

### Task 13: Badge API & Badge Components

**Files:**
- Create: `fitquest/src/app/api/badges/route.ts`
- Create: `fitquest/src/components/BadgeCard.tsx`
- Create: `fitquest/src/components/BadgeWall.tsx`
- Create: `fitquest/src/components/NextBadgeProgress.tsx`

- [ ] **Step 1: Create badges API route**

Create `src/app/api/badges/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { getUserStats, checkBadges } from "@/lib/badges";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  const [badges, stats] = await Promise.all([
    prisma.badge.findMany({ where: { userId } }),
    getUserStats(userId),
  ]);

  const checkResults = checkBadges(stats);

  const result = checkResults.map((check) => {
    const dbBadge = badges.find(
      (b) => b.series === check.series && b.tier === check.tier
    );
    return {
      ...check,
      unlockedAt: dbBadge?.unlockedAt || null,
    };
  });

  return NextResponse.json({ badges: result });
}
```

- [ ] **Step 2: Create BadgeCard component**

Create `src/components/BadgeCard.tsx`:

```typescript
"use client";

interface BadgeCardProps {
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  progress: number;
  unlockedAt: string | null;
}

export default function BadgeCard({
  name,
  emoji,
  description,
  unlocked,
  progress,
}: BadgeCardProps) {
  return (
    <div
      className={`rounded-2xl p-3 text-center ${
        unlocked
          ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200"
          : "bg-gray-50 border-2 border-gray-100 opacity-60"
      }`}
    >
      <div className={`text-3xl mb-1 ${unlocked ? "" : "grayscale"}`}>
        {emoji}
      </div>
      <div className="text-xs font-bold text-gray-800">{name}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{description}</div>
      {!unlocked && (
        <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-primary-400 rounded-full transition-all"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create BadgeWall component**

Create `src/components/BadgeWall.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import BadgeCard from "./BadgeCard";

interface BadgeData {
  series: string;
  tier: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  progress: number;
  unlockedAt: string | null;
}

const SERIES_LABELS: Record<string, string> = {
  consistency: "🔥 坚持之心",
  endurance: "📏 里程之魂",
  exploration: "🌈 探索之翼",
  social: "🤝 契约之证",
};

export default function BadgeWall() {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/badges")
      .then((res) => res.json())
      .then((data) => {
        setBadges(data.badges || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-400">加载中...</div>;
  }

  const seriesOrder = ["consistency", "endurance", "exploration", "social"];

  return (
    <div className="space-y-6">
      {seriesOrder.map((series) => {
        const seriesBadges = badges
          .filter((b) => b.series === series)
          .sort((a, b) => {
            const order = { bronze: 0, silver: 1, gold: 2 };
            return order[a.tier as keyof typeof order] - order[b.tier as keyof typeof order];
          });

        return (
          <div key={series}>
            <h3 className="text-sm font-bold text-gray-700 mb-2">
              {SERIES_LABELS[series] || series}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {seriesBadges.map((badge) => (
                <BadgeCard key={`${badge.series}-${badge.tier}`} {...badge} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create NextBadgeProgress component (for homepage)**

Create `src/components/NextBadgeProgress.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";

interface BadgeData {
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  progress: number;
}

export default function NextBadgeProgress() {
  const [nextBadge, setNextBadge] = useState<BadgeData | null>(null);

  useEffect(() => {
    fetch("/api/badges")
      .then((res) => res.json())
      .then((data) => {
        const notUnlocked = (data.badges || []).filter(
          (b: BadgeData) => !b.unlocked
        );
        if (notUnlocked.length > 0) {
          notUnlocked.sort((a: BadgeData, b: BadgeData) => b.progress - a.progress);
          setNextBadge(notUnlocked[0]);
        }
      });
  }, []);

  if (!nextBadge) return null;

  const pct = Math.round(nextBadge.progress * 100);

  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl opacity-60">
          {nextBadge.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-gray-800 truncate">
            距「{nextBadge.name}」还差 {100 - pct}%
          </div>
          <div className="mt-1.5 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-orange to-accent-gold rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add fitquest/src/app/api/badges/route.ts fitquest/src/components/BadgeCard.tsx fitquest/src/components/BadgeWall.tsx fitquest/src/components/NextBadgeProgress.tsx
git commit -m "feat: add badge API and display components (BadgeCard, BadgeWall, NextBadgeProgress)"
```

---

## Phase 5: Social Layer

### Task 14: Friend System

**Files:**
- Create: `fitquest/src/app/api/friends/route.ts`

- [ ] **Step 1: Create friends API route**

Create `src/app/api/friends/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  const friendships = await prisma.friendship.findMany({
    where: {
      status: "accepted",
      OR: [{ userId }, { friendId: userId }],
    },
    include: {
      user: { select: { id: true, name: true, image: true, personalityType: true, lastWorkoutAt: true } },
      friend: { select: { id: true, name: true, image: true, personalityType: true, lastWorkoutAt: true } },
    },
  });

  const friends = friendships.map((f) => {
    const friendData = f.userId === userId ? f.friend : f.user;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWorkout = friendData.lastWorkoutAt
      ? new Date(friendData.lastWorkoutAt)
      : null;
    const exercisedToday =
      lastWorkout && lastWorkout >= today;

    return { ...friendData, exercisedToday };
  });

  return NextResponse.json({ friends });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { friendEmail } = await req.json();

  const friend = await prisma.user.findUnique({
    where: { email: friendEmail },
  });

  if (!friend) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (friend.id === userId) {
    return NextResponse.json(
      { error: "Cannot add yourself" },
      { status: 400 }
    );
  }

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId, friendId: friend.id },
        { userId: friend.id, friendId: userId },
      ],
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Friendship already exists" },
      { status: 409 }
    );
  }

  await prisma.friendship.create({
    data: { userId, friendId: friend.id, status: "accepted" },
  });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add fitquest/src/app/api/friends/route.ts
git commit -m "feat: add friend system API with list and add endpoints"
```

---

### Task 15: Feed System

**Files:**
- Create: `fitquest/src/app/api/feed/route.ts`
- Create: `fitquest/src/components/FeedItem.tsx`
- Create: `fitquest/src/components/FeedList.tsx`

- [ ] **Step 1: Create feed API route**

Create `src/app/api/feed/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const cursor = url.searchParams.get("cursor");

  // Get friend IDs
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "accepted",
      OR: [{ userId }, { friendId: userId }],
    },
    select: { userId: true, friendId: true },
  });

  const friendIds = friendships.map((f) =>
    f.userId === userId ? f.friendId : f.userId
  );

  // Include own posts too
  const visibleUserIds = [userId, ...friendIds];

  const feedItems = await prisma.feedItem.findMany({
    where: { userId: { in: visibleUserIds } },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      user: {
        select: {
          id: true,
          name: true,
          personalityType: true,
          image: true,
        },
      },
      interactions: {
        select: { id: true, userId: true, type: true, content: true },
      },
    },
  });

  const hasMore = feedItems.length > limit;
  const items = hasMore ? feedItems.slice(0, -1) : feedItems;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return NextResponse.json({ items, nextCursor });
}
```

- [ ] **Step 2: Create FeedItem component**

Create `src/components/FeedItem.tsx`:

```typescript
"use client";

import { useState } from "react";
import { getProfile } from "@/lib/personality";

const WORKOUT_LABELS: Record<string, { label: string; emoji: string }> = {
  running: { label: "跑步", emoji: "🏃" },
  gym: { label: "健身", emoji: "🏋️" },
  swimming: { label: "游泳", emoji: "🏊" },
  yoga: { label: "瑜伽", emoji: "🧘" },
  cycling: { label: "骑行", emoji: "🚴" },
  basketball: { label: "篮球", emoji: "🏀" },
};

interface Interaction {
  id: string;
  userId: string;
  type: string;
  content: string | null;
}

interface FeedItemProps {
  id: string;
  type: string;
  content: Record<string, unknown>;
  createdAt: string;
  user: {
    id: string;
    name: string;
    personalityType: string | null;
  };
  interactions: Interaction[];
}

export default function FeedItem({
  id,
  type,
  content,
  createdAt,
  user,
  interactions,
}: FeedItemProps) {
  const [likes, setLikes] = useState(
    interactions.filter((i) => i.type === "like").length
  );
  const [witnesses, setWitnesses] = useState(
    interactions.filter((i) => i.type === "witness").length
  );
  const [witnessed, setWitnessed] = useState(false);

  const personality = user.personalityType
    ? getProfile(user.personalityType as keyof ReturnType<typeof getProfile>)
    : null;

  const timeAgo = getTimeAgo(new Date(createdAt));

  const handleWitness = async () => {
    if (witnessed) return;
    await fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedItemId: id, type: "witness" }),
    });
    setWitnesses((w) => w + 1);
    setWitnessed(true);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{
            background: personality?.gradient || "#f0f0f0",
          }}
        >
          {personality?.emoji || "😊"}
        </div>
        <div>
          <span className="font-bold text-sm">{user.name}</span>
          {personality && (
            <span className="text-xs text-primary-500 ml-1">
              · {personality.name}
            </span>
          )}
          <div className="text-[10px] text-gray-400">{timeAgo}</div>
        </div>
      </div>

      {type === "workout" && (
        <WorkoutContent content={content} />
      )}
      {type === "badge_unlock" && (
        <BadgeContent content={content} />
      )}
      {type === "personality_evolve" && (
        <EvolveContent content={content} />
      )}

      <div className="mt-3 pt-3 border-t border-gray-50 flex gap-4 text-xs text-gray-400">
        <button
          onClick={() => setLikes((l) => l + 1)}
          className="hover:text-red-400 transition-colors"
        >
          🔥 {likes}
        </button>
        <span>💬 {(content as Record<string, unknown>).comments?.toString() || "0"}</span>
        <button
          onClick={handleWitness}
          className={`transition-colors ${
            witnessed ? "text-primary-500 font-bold" : "hover:text-primary-400"
          }`}
        >
          👁️ 见证{witnesses > 0 ? ` ${witnesses}` : ""}
        </button>
      </div>
    </div>
  );
}

function WorkoutContent({ content }: { content: Record<string, unknown> }) {
  const workoutInfo =
    WORKOUT_LABELS[(content.workoutType as string)] ||
    WORKOUT_LABELS["running"];

  return (
    <div>
      <p className="text-sm text-gray-800">
        {workoutInfo.emoji} {(workoutInfo.label as string)} {(content.duration as number)} 分钟
        {content.distance && ` · ${content.distance}km`}
      </p>
    </div>
  );
}

function BadgeContent({ content }: { content: Record<string, unknown> }) {
  return (
    <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-3">
      <span className="text-2xl">🏅</span>
      <div>
        <div className="text-sm font-bold text-amber-700">
          解锁新徽章！
        </div>
        <div className="text-xs text-amber-600">
          {content.series as string} · {content.tier as string}
        </div>
      </div>
    </div>
  );
}

function EvolveContent({ content }: { content: Record<string, unknown> }) {
  const from = getProfile(content.from as keyof ReturnType<typeof getProfile>);
  const to = getProfile(content.to as keyof ReturnType<typeof getProfile>);

  return (
    <div className="bg-purple-50 rounded-xl p-3 flex items-center gap-3 justify-center">
      <span>{from?.emoji || "❓"}</span>
      <span className="text-gray-400">→</span>
      <span className="font-bold text-primary-500">{to?.emoji || "❓"}</span>
      <span className="text-xs text-purple-600 ml-1">性格进化了！</span>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor(
    (Date.now() - date.getTime()) / 1000
  );
  if (seconds < 60) return "刚刚";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`;
  return `${Math.floor(seconds / 86400)} 天前`;
}
```

- [ ] **Step 3: Create FeedList component**

Create `src/components/FeedList.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import FeedItem from "./FeedItem";

interface FeedData {
  id: string;
  type: string;
  content: Record<string, unknown>;
  createdAt: string;
  user: {
    id: string;
    name: string;
    personalityType: string | null;
  };
  interactions: {
    id: string;
    userId: string;
    type: string;
    content: string | null;
  }[];
}

export default function FeedList() {
  const [items, setItems] = useState<FeedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-400">加载中...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-3xl mb-2">🏃</div>
        <p>还没有动态，去运动吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <FeedItem key={item.id} {...item} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add fitquest/src/app/api/feed/route.ts fitquest/src/components/FeedItem.tsx fitquest/src/components/FeedList.tsx
git commit -m "feat: add social feed API and feed display components"
```

---

### Task 16: Interactions API

**Files:**
- Create: `fitquest/src/app/api/interactions/route.ts`

- [ ] **Step 1: Create interactions API route**

Create `src/app/api/interactions/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { feedItemId, type, content } = await req.json();

  if (!feedItemId || !type) {
    return NextResponse.json(
      { error: "feedItemId and type are required" },
      { status: 400 }
    );
  }

  if (!["like", "comment", "witness"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const existing = await prisma.interaction.findUnique({
    where: {
      feedItemId_userId_type: { feedItemId, userId, type },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Already interacted" }, { status: 409 });
  }

  const interaction = await prisma.interaction.create({
    data: { feedItemId, userId, type, content: content || null },
  });

  return NextResponse.json({ interaction });
}
```

- [ ] **Step 2: Commit**

```bash
git add fitquest/src/app/api/interactions/route.ts
git commit -m "feat: add interactions API for like, comment, witness"
```

---

## Phase 6: Homepage & Page Assembly

### Task 17: Homepage Components

**Files:**
- Create: `fitquest/src/components/PersonalityCard.tsx`
- Create: `fitquest/src/components/EnergyBar.tsx`
- Create: `fitquest/src/components/StreakBlock.tsx`
- Create: `fitquest/src/components/FriendSummary.tsx`

- [ ] **Step 1: Create PersonalityCard component**

Create `src/components/PersonalityCard.tsx`:

```typescript
"use client";

import { getProfile } from "@/lib/personality";
import { getEnergyInfo } from "@/lib/energy";
import type { PersonalityType } from "@/types";

interface PersonalityCardProps {
  personalityType: PersonalityType | null;
  energy: number;
}

export default function PersonalityCard({
  personalityType,
  energy,
}: PersonalityCardProps) {
  if (!personalityType) {
    return (
      <div className="card text-center py-6">
        <p className="text-gray-500 text-sm">还没有运动性格</p>
        <a
          href="/quiz"
          className="inline-block mt-3 px-6 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium"
        >
          去测试
        </a>
      </div>
    );
  }

  const profile = getProfile(personalityType);
  const energyInfo = getEnergyInfo(energy);

  return (
    <div className="card" style={{ background: profile.gradient }}>
      <div className="flex items-center gap-4">
        <div className="text-5xl">{profile.emoji}</div>
        <div className="flex-1">
          <div
            className="font-bold text-lg"
            style={{ color: profile.textColor }}
          >
            {profile.name}
          </div>
          <div
            className="text-sm mt-0.5"
            style={{ color: profile.textColor, opacity: 0.8 }}
          >
            {energyInfo.emoji} {energyInfo.label} · {energyInfo.description}
          </div>
          <div className="mt-2 bg-black/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${energy}%`,
                background:
                  energy >= 80
                    ? "#00B894"
                    : energy >= 40
                    ? "#FDCB6E"
                    : "#E17055",
              }}
            />
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: profile.textColor, opacity: 0.7 }}
          >
            能量 {energy}%
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create StreakBlock component**

Create `src/components/StreakBlock.tsx`:

```typescript
interface StreakBlockProps {
  streakDays: number;
}

export default function StreakBlock({ streakDays }: StreakBlockProps) {
  const today = new Date().getDay();
  const days = ["一", "二", "三", "四", "五", "六", "日"];

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-3xl font-extrabold">
            {streakDays}
            <span className="text-sm font-normal text-gray-400 ml-1">
              天连续
            </span>{" "}
            🔥
          </div>
          {streakDays > 0 && (
            <div className="text-xs text-accent-orange mt-1">
              今天不运动就会断链！
            </div>
          )}
          {streakDays === 0 && (
            <div className="text-xs text-gray-400 mt-1">
              今天开始新的连续记录
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {days.map((_, i) => {
            const dayIndex = (i + 1) % 7;
            const isPast = dayIndex <= (today === 0 ? 6 : today - 1);
            return (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${
                  isPast ? "bg-accent-green" : "bg-gray-200"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create FriendSummary component**

Create `src/components/FriendSummary.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";

interface Friend {
  id: string;
  name: string;
  personalityType: string | null;
  exercisedToday: boolean;
}

export default function FriendSummary() {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    fetch("/api/friends")
      .then((res) => res.json())
      .then((data) => setFriends(data.friends || []));
  }, []);

  const todayFriends = friends.filter((f) => f.exercisedToday);

  if (todayFriends.length === 0 && friends.length === 0) {
    return (
      <div className="card">
        <div className="text-sm text-gray-500">
          还没有好友，添加好友一起运动吧！
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex -space-x-2">
          {todayFriends.slice(0, 3).map((f) => (
            <div
              key={f.id}
              className="w-6 h-6 rounded-full bg-accent-blue flex items-center justify-center text-[10px] border-2 border-white"
            >
              {f.name[0]}
            </div>
          ))}
        </div>
        <span className="text-sm">
          <b>{todayFriends.length} 位好友</b>今天已运动
        </span>
      </div>
      {todayFriends.length > 0 && (
        <div className="bg-blue-50 p-2 rounded-lg text-xs text-accent-blue">
          {todayFriends[0].name} 刚完成了运动 · 去看看
        </div>
      )}
      {todayFriends.length === 0 && friends.length > 0 && (
        <div className="text-xs text-gray-400">今天还没有好友运动，做第一个！</div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add fitquest/src/components/PersonalityCard.tsx fitquest/src/components/StreakBlock.tsx fitquest/src/components/FriendSummary.tsx
git commit -m "feat: add homepage components (PersonalityCard, StreakBlock, FriendSummary)"
```

---

### Task 18: Homepage Assembly

**Files:**
- Modify: `fitquest/src/app/page.tsx`

- [ ] **Step 1: Assemble the homepage (5-section persuasion chain)**

Replace `src/app/page.tsx` entirely:

```typescript
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth.config";
import PersonalityCard from "@/components/PersonalityCard";
import StreakBlock from "@/components/StreakBlock";
import FriendSummary from "@/components/FriendSummary";
import NextBadgeProgress from "@/components/NextBadgeProgress";
import BottomNav from "@/components/BottomNav";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.personalityType) {
    redirect("/quiz");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white pb-20">
      <div className="p-4 space-y-3">
        {/* Section 1: Personality Card (emotional trigger) */}
        <PersonalityCard
          personalityType={user.personalityType as Parameters<typeof PersonalityCard>[0]["personalityType"]}
          energy={user.personalityEnergy}
        />

        {/* Section 2: Streak (loss aversion) */}
        <StreakBlock streakDays={user.streakDays} />

        {/* Section 3: Friends (social proof) */}
        <FriendSummary />

        {/* Section 4: Next Badge (reward preview) */}
        <NextBadgeProgress />

        {/* Section 5: CTA Button (action) */}
        <a href="/record" className="block">
          <button className="btn-primary mt-2">
            ⚡ 记录今日运动
          </button>
        </a>
        <p className="text-center text-xs text-gray-400">
          运动后性格能量将恢复至 100%
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add fitquest/src/app/page.tsx
git commit -m "feat: assemble homepage with 5-section persuasion chain"
```

---

### Task 19: Bottom Navigation

**Files:**
- Create: `fitquest/src/components/BottomNav.tsx`

- [ ] **Step 1: Create BottomNav component**

Create `src/components/BottomNav.tsx`:

```typescript
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/circle", label: "运动圈", icon: "👥" },
  { href: "/record", label: "记录", icon: "⚡" },
  { href: "/profile", label: "我的", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100">
      <div className="flex justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                active
                  ? "text-primary-500"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] mt-0.5 font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add fitquest/src/components/BottomNav.tsx
git commit -m "feat: add bottom navigation with 4 tabs"
```

---

### Task 20: Circle Page (Social Feed)

**Files:**
- Create: `fitquest/src/app/circle/page.tsx`

- [ ] **Step 1: Create circle page**

Create `src/app/circle/page.tsx`:

```typescript
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
      <div className="bg-white p-4 border-b border-gray-100">
        <h1 className="text-lg font-bold">运动圈</h1>
      </div>
      <div className="p-4">
        <FeedList />
      </div>
      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add fitquest/src/app/circle/page.tsx
git commit -m "feat: add social feed circle page"
```

---

### Task 21: Profile Page

**Files:**
- Create: `fitquest/src/app/profile/page.tsx`
- Create: `fitquest/src/components/StreakHeatmap.tsx`

- [ ] **Step 1: Create StreakHeatmap component**

Create `src/components/StreakHeatmap.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";

interface DayData {
  date: string;
  count: number;
}

export default function StreakHeatmap() {
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workouts?limit=365")
      .then((res) => res.json())
      .then((data) => {
        const workoutDays: Record<string, number> = {};
        for (const w of data.workouts || []) {
          const date = new Date(w.recordedAt).toISOString().slice(0, 10);
          workoutDays[date] = (workoutDays[date] || 0) + 1;
        }

        const result: DayData[] = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);
          result.push({ date: dateStr, count: workoutDays[dateStr] || 0 });
        }
        setDays(result);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-400 text-sm">
        加载热力图...
      </div>
    );
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-400";
    return "bg-green-600";
  };

  // Render as 7 rows (Sun-Sat) × ~52 columns
  const weeks: DayData[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[2px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[2px]">
            {week.map((day, di) => (
              <div
                key={di}
                className={`w-3 h-3 rounded-sm ${getColor(day.count)}`}
                title={`${day.date}: ${day.count} 次运动`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create profile page**

Create `src/app/profile/page.tsx`:

```typescript
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { signOut } from "next-auth/react";
import BadgeWall from "@/components/BadgeWall";
import StreakHeatmap from "@/components/StreakHeatmap";
import BottomNav from "@/components/BottomNav";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as Record<string, unknown>).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-lg font-bold">我的</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl">
            {user?.name?.[0] || "?"}
          </div>
          <div>
            <div className="font-bold">{user?.name}</div>
            <div className="text-xs text-gray-400">
              最长连续 {user?.longestStreak || 0} 天
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            📅 运动热力图
          </h3>
          <StreakHeatmap />
        </div>

        {/* Badge Wall */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2">🏅 徽章墙</h3>
          <BadgeWall />
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <a
            href="/quiz"
            className="block text-sm text-primary-500 font-medium py-2"
          >
            重新测试运动性格
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-gray-400 py-2"
          >
            退出登录
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
```

Note: The signOut call in a Server Component will need to be moved to a client component. Replace the button with a small client component:

Create `src/components/SignOutButton.tsx`:

```typescript
"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-gray-400 py-2"
    >
      退出登录
    </button>
  );
}
```

Update profile page to import and use `<SignOutButton />` instead of the inline button.

- [ ] **Step 3: Commit**

```bash
git add fitquest/src/app/profile/page.tsx fitquest/src/components/StreakHeatmap.tsx fitquest/src/components/SignOutButton.tsx
git commit -m "feat: add profile page with badge wall, heatmap, and settings"
```

---

## Phase 7: Jest Configuration & Final Integration

### Task 22: Jest Configuration

**Files:**
- Create: `fitquest/jest.config.ts`

- [ ] **Step 1: Configure Jest for TypeScript + path aliases**

Create `jest.config.ts`:

```typescript
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathPattern: ["__tests__/.*\\.test\\.ts$"],
};

export default config;
```

- [ ] **Step 2: Run all tests**

Run: `cd /Users/Lovegood/Desktop/Sports/fitquest && npx jest`
Expected: All tests PASS (personality, energy, badges, streak)

- [ ] **Step 3: Commit**

```bash
git add fitquest/jest.config.ts
git commit -m "feat: configure Jest for TypeScript with path aliases"
```

---

### Task 23: Deploy to Vercel

**Files:**
- Modify: `fitquest/.env.example` (update with Supabase URL)

- [ ] **Step 1: Set up Supabase database**

1. Go to supabase.com, create a new project
2. Copy the connection string (under Settings → Database → URI)
3. Run migration: `cd fitquest && npx prisma migrate dev --name init`
4. This creates all tables in Supabase

- [ ] **Step 2: Push to GitHub**

```bash
cd /Users/Lovegood/Desktop/Sports
gh repo create fitquest --public --source=fitquest --push
```

- [ ] **Step 3: Deploy to Vercel**

1. Go to vercel.com, import the GitHub repo
2. Set root directory to `fitquest`
3. Add environment variables:
   - `DATABASE_URL` = Supabase connection string
   - `NEXTAUTH_SECRET` = random 32-char string
   - `NEXTAUTH_URL` = `https://your-app.vercel.app`
4. Deploy

- [ ] **Step 4: Run production migration**

```bash
cd fitquest
npx prisma migrate deploy
```

- [ ] **Step 5: Commit any deployment config changes**

```bash
git add -A
git commit -m "chore: configure for Vercel deployment"
```

---

## Self-Review Checklist

- **Spec coverage**: Each spec section maps to tasks:
  - Section 3 (Info Architecture) → Tasks 17-21 (Homepage, Circle, Profile, BottomNav)
  - Section 4 (Personality System) → Tasks 7-8 (Calculation, Quiz)
  - Section 4.3 (Energy States) → Task 9 (Energy)
  - Section 5 (Badges) → Tasks 12-13 (Badge logic, display)
  - Section 6 (Social) → Tasks 14-16 (Friends, Feed, Interactions)
  - Section 7 (Data Input) → Task 11 (Workout recording)
  - Section 8 (Tech) → Tasks 1-6 (Foundation)

- **Placeholder scan**: No TBDs, TODOs, or "implement later" patterns found.

- **Type consistency**: All types flow from `src/types/index.ts` through `src/lib/` modules to API routes and components. PersonalityType, BadgeSeries, BadgeTier are used consistently.

- **V2 features intentionally excluded**: Social contracts, report cards, personality evolution animations, Keep API sync — all correctly scoped out of V1.
