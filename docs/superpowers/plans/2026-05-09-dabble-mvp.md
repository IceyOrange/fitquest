# 搭搭动 Dabble MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

> 日期：2026-05-09（精简版，对齐设计稿 `docs/superpowers/specs/2026-05-09-dabble-design.md`）

## Goal

构建搭搭动 Dabble MVP：以**运动搭子**为核心驱动力的运动健身 Web 应用，包括用户注册/登录、运动记录、周活跃热力图、运动圈 Feed、好友系统、搭子时间窗口会话、运动性格测试（仅冷启动钩子）。

## Non-Goals

- ❌ 徽章 / 勋章系统
- ❌ 性格能量状态（活力/枯萎）
- ❌ 性格进化动画 / 粒子特效
- ❌ Keep / Apple Health / 微信运动 API 同步（V2）
- ❌ 周报告卡分享图（V2）
- ❌ 陌生人社交、搭子匹配推荐(V2)
- ❌ 移动端原生 App
- ❌ Framer Motion / Recharts 等重型动画/图表库

## Tech Stack

- **Framework**：Next.js 14+ App Router + TypeScript
- **样式**：Tailwind CSS v4
- **数据库**：PostgreSQL（Supabase 托管）
- **ORM**：Prisma
- **认证**：NextAuth.js（credentials provider + bcryptjs）
- **测试**：Jest + ts-jest
- **部署**：GitHub + Vercel

> **不引入 Framer Motion，不引入 Recharts。** 热力图用纯 CSS Grid，过渡用 Tailwind transition。

## File Structure

```
dabble/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── workouts/route.ts
│   │   │   ├── friends/route.ts
│   │   │   ├── buddy-sessions/route.ts
│   │   │   ├── feed/route.ts
│   │   │   ├── interactions/route.ts
│   │   │   └── quiz/result/route.ts
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── quiz/page.tsx
│   │   ├── circle/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── record/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx               # 首页
│   │   └── globals.css
│   ├── components/
│   │   ├── GreetingHeader.tsx     # 顶部 chip（性格 emoji + 名字）
│   │   ├── BuddyStatus.tsx        # 搭子状态卡（首要触发器）
│   │   ├── WeeklyProgress.tsx     # 本周进度
│   │   ├── QuickRecord.tsx        # 记录运动按钮
│   │   ├── BottomNav.tsx          # 底部 3 Tab
│   │   ├── FeedItem.tsx
│   │   ├── FeedList.tsx
│   │   ├── FriendSummary.tsx
│   │   ├── WorkoutForm.tsx
│   │   ├── HeatmapGrid.tsx        # 年度热力图（纯 CSS Grid）
│   │   └── Providers.tsx          # NextAuth SessionProvider 等
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── personality.ts         # 8 种性格定义 + 计算函数
│   │   ├── quiz.ts                # 6 道测试题 + 评分
│   │   ├── streak.ts              # 周活跃连续计算
│   │   └── stats.ts               # 用户统计聚合（首页/我的页面共用）
│   └── types/
│       └── index.ts
├── tests/
│   ├── personality.test.ts
│   └── streak.test.ts
├── jest.config.ts
├── jest.setup.ts
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── package.json
├── .env.example
└── README.md
```

> 不再有 `BadgeCard.tsx` / `BadgeWall.tsx` / `NextBadgeProgress.tsx` / `EnergyBar.tsx`，对应的 `lib/energy.ts` 和 `lib/badges.ts` 也不存在。

## 任务划分

共 **22 个任务**，分布在 **6 个阶段**。

### Phase 1：项目地基（Tasks 1-3）

#### Task 1：初始化 Next.js 项目并安装依赖

```bash
# 在 /Users/Lovegood/Desktop/Sports/ 下
npx create-next-app@latest dabble \
  --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint
cd dabble
npm install next-auth bcryptjs prisma @prisma/client @auth/prisma-adapter
npm install -D @types/bcryptjs jest ts-jest @types/jest
```

验证：
- `package.json` 中应有 `next`、`next-auth`、`prisma`、`@prisma/client`、`bcryptjs`
- `package.json` 中**不应**出现 `framer-motion`、`recharts`
- `npm run dev` 启动后访问 http://localhost:3000 显示初始页面

#### Task 2：配置 Tailwind 主题与全局样式

修改 `src/app/globals.css`，加入项目调色板（轻松可爱风）：

```css
@import "tailwindcss";

@theme {
  --color-bg: #faf7ff;
  --color-card: #ffffff;
  --color-primary: #8b5cf6;        /* 紫色 */
  --color-primary-soft: #c4b5fd;
  --color-accent: #ec4899;         /* 粉色 */
  --color-text: #1f2937;
  --color-text-soft: #6b7280;
  --color-success: #10b981;
  --color-border: #f3f4f6;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: ui-sans-serif, system-ui, -apple-system, "PingFang SC", sans-serif;
}

/* 8 种性格的渐变背景，可直接 className 使用 */
.gradient-dawn { background: linear-gradient(135deg, #fde68a 0%, #fb923c 100%); }
.gradient-night { background: linear-gradient(135deg, #312e81 0%, #7c3aed 100%); }
.gradient-fat-burner { background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); }
.gradient-zen { background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%); }
.gradient-free { background: linear-gradient(135deg, #67e8f9 0%, #3b82f6 100%); }
.gradient-precision { background: linear-gradient(135deg, #94a3b8 0%, #1e293b 100%); }
.gradient-allround { background: linear-gradient(135deg, #f9a8d4 0%, #c084fc 100%); }
.gradient-marathon { background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%); }
```

验证：访问首页背景应为浅紫白色，能看到柔和阴影卡片样式。

#### Task 3：定义 Prisma Schema（无 Badge 模型）

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String
  passwordHash    String
  avatar          String?
  personalityType String?  // dawn_walker / night_owl / fat_burner / zen_walker / free_spirit / precision_hunter / all_round / marathon_soul
  weeklyTarget    Int      @default(3)
  lastWorkoutAt   DateTime?
  createdAt       DateTime @default(now())

  workouts        Workout[]
  feedItems       FeedItem[]
  interactions    Interaction[]
  friendsAsA      Friendship[] @relation("FriendshipUserA")
  friendsAsB      Friendship[] @relation("FriendshipUserB")
  buddyParticipants BuddySessionParticipant[]
}

model Workout {
  id              String   @id @default(cuid())
  userId          String
  type            String   // running / gym / swimming / yoga / cycling / basketball / other
  duration        Int      // 分钟
  distance        Float?
  recordedAt      DateTime @default(now())
  source          String   @default("manual") // manual / keep / apple_health
  buddySessionId  String?

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  buddySession    BuddySession? @relation(fields: [buddySessionId], references: [id])
  participants    BuddySessionParticipant[]

  @@index([userId, recordedAt])
}

model BuddySession {
  id              String   @id @default(cuid())
  windowStart     DateTime
  windowEnd       DateTime
  status          String   @default("pending") // pending / active / completed / expired
  createdAt       DateTime @default(now())

  workouts        Workout[]
  participants    BuddySessionParticipant[]
}

model BuddySessionParticipant {
  id              String   @id @default(cuid())
  sessionId       String
  userId          String
  joinedAt        DateTime?
  workoutId       String?

  session         BuddySession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  workout         Workout?     @relation(fields: [workoutId], references: [id])

  @@unique([sessionId, userId])
}

model Friendship {
  id              String   @id @default(cuid())
  userAId         String
  userBId         String
  status          String   @default("pending") // pending / accepted
  createdAt       DateTime @default(now())

  userA           User     @relation("FriendshipUserA", fields: [userAId], references: [id], onDelete: Cascade)
  userB           User     @relation("FriendshipUserB", fields: [userBId], references: [id], onDelete: Cascade)

  @@unique([userAId, userBId])
}

model FeedItem {
  id              String   @id @default(cuid())
  userId          String
  type            String   // workout / buddy_workout
  content         Json
  createdAt       DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  interactions    Interaction[]

  @@index([userId, createdAt])
}

model Interaction {
  id              String   @id @default(cuid())
  feedItemId      String
  userId          String
  type            String   // like / comment / witness
  content         String?  // 评论文字；点赞/见证为 null
  createdAt       DateTime @default(now())

  feedItem        FeedItem @relation(fields: [feedItemId], references: [id], onDelete: Cascade)
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([feedItemId])
}
```

执行迁移：
```bash
npx prisma migrate dev --name init
```

验证：
- 数据库中应有 7 张表：User、Workout、BuddySession、BuddySessionParticipant、Friendship、FeedItem、Interaction
- **不应**有 Badge 表
- User 表**不应**有 personalityEnergy 字段

---

### Phase 2：认证 + 性格测试（Tasks 4-8）

#### Task 4：Prisma 客户端单例

`src/lib/prisma.ts`：

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

#### Task 5：NextAuth 配置 + 注册接口（无 Badge 初始化）

`src/lib/auth.ts`：

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        (session.user as { id?: string }).id = token.userId as string;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};
```

`src/app/api/auth/[...nextauth]/route.ts`：

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

`src/app/api/register/route.ts`：

```typescript
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "邮箱已注册" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, passwordHash },
  });

  // 注意：不再做任何 Badge 初始化、能量初始化
  return NextResponse.json({ id: user.id, email: user.email });
}
```

`src/app/login/page.tsx` 与 `src/app/register/page.tsx`：使用 `signIn("credentials", ...)` 和 `fetch("/api/register")` 实现表单。注册成功后自动登录并跳转到 `/quiz`。

验证：
- 注册 → 自动登录 → 跳转性格测试页
- 登录后 session 中 user.id 可用
- 数据库中 User 表新增一行，**不会**触发 Badge 表写入（因为没有 Badge 表）

#### Task 6：核心类型定义

`src/types/index.ts`：

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

export interface PersonalityProfile {
  type: PersonalityType;
  emoji: string;
  name: string;
  slogan: string;
  gradientClass: string;   // CSS class，如 "gradient-dawn"
  textColor: string;       // 卡片上文字颜色
}

export type WorkoutType =
  | "running"
  | "gym"
  | "swimming"
  | "yoga"
  | "cycling"
  | "basketball"
  | "other";

export interface UserStats {
  weeklyActiveStreak: number;   // 连续活跃周数
  weeklyTarget: number;
  thisWeekCount: number;
  totalDuration: number;        // 总分钟
  uniqueTypes: number;
  totalWorkouts: number;
}

export type FeedItemType = "workout" | "buddy_workout";

export type InteractionType = "like" | "comment" | "witness";

export type BuddySessionStatus = "pending" | "active" | "completed" | "expired";
```

> **不再有** `EnergyState`、`EnergyInfo`、`BadgeSeries`、`BadgeTier`、`BadgeDefinition` 等类型。

#### Task 7：性格定义与计算逻辑

`src/lib/personality.ts`：

```typescript
import type { PersonalityProfile, PersonalityType } from "@/types";

export const PERSONALITY_PROFILES: Record<PersonalityType, PersonalityProfile> = {
  dawn_walker: {
    type: "dawn_walker",
    emoji: "🌅",
    name: "黎明行者",
    slogan: "太阳还没醒，我已经在路上了",
    gradientClass: "gradient-dawn",
    textColor: "#7c2d12",
  },
  night_owl: {
    type: "night_owl",
    emoji: "🦉",
    name: "夜猫铁人",
    slogan: "夜深了，铁馆才是我的主场",
    gradientClass: "gradient-night",
    textColor: "#fef3c7",
  },
  fat_burner: {
    type: "fat_burner",
    emoji: "🔥",
    name: "燃脂战士",
    slogan: "不流汗不痛快",
    gradientClass: "gradient-fat-burner",
    textColor: "#ffffff",
  },
  zen_walker: {
    type: "zen_walker",
    emoji: "🧘",
    name: "禅意行者",
    slogan: "运动是和自己对话",
    gradientClass: "gradient-zen",
    textColor: "#064e3b",
  },
  free_spirit: {
    type: "free_spirit",
    emoji: "🌊",
    name: "自由浪人",
    slogan: "想动就动，不想就躺着",
    gradientClass: "gradient-free",
    textColor: "#0c4a6e",
  },
  precision_hunter: {
    type: "precision_hunter",
    emoji: "🎯",
    name: "精准猎手",
    slogan: "每一练都在计划之中",
    gradientClass: "gradient-precision",
    textColor: "#f8fafc",
  },
  all_round: {
    type: "all_round",
    emoji: "🦋",
    name: "全能蝶变",
    slogan: "什么都会一点，什么都爱",
    gradientClass: "gradient-allround",
    textColor: "#831843",
  },
  marathon_soul: {
    type: "marathon_soul",
    emoji: "🏔️",
    name: "马拉松之魂",
    slogan: "不在于快，在于不停",
    gradientClass: "gradient-marathon",
    textColor: "#eef2ff",
  },
};

export interface PersonalityScore {
  morning: number;     // 晨型：正数；夜型：负数
  intensity: number;   // 高强度：正数；低强度：负数
  burst: number;       // 爆发：正数；稳定：负数
  variety: number;     // 多样：正数；专精：负数
}

export function inferPersonality(score: PersonalityScore): PersonalityType {
  const { morning, intensity, burst, variety } = score;

  if (variety >= 2 && burst >= 2) return "free_spirit";
  if (variety >= 2 && burst <= -1) return "all_round";
  if (intensity >= 2 && morning >= 2) return "dawn_walker";
  if (intensity >= 2 && morning <= -2) return "night_owl";
  if (intensity >= 2 && burst <= -1) return "fat_burner";
  if (intensity <= -1 && variety >= 1) return "zen_walker";
  if (intensity <= -1 && variety <= 0) return "marathon_soul";
  return "precision_hunter";
}

export function getProfile(type: PersonalityType): PersonalityProfile {
  return PERSONALITY_PROFILES[type];
}
```

测试 `tests/personality.test.ts`：覆盖 8 种性格的边界用例。

#### Task 8：性格测试题与测试页

`src/lib/quiz.ts`：

```typescript
import type { PersonalityScore } from "./personality";
import { inferPersonality } from "./personality";
import type { PersonalityType } from "@/types";

export interface QuizOption {
  label: string;
  delta: Partial<PersonalityScore>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "期末考试周你会……",
    options: [
      { label: "早起跑步清空大脑", delta: { morning: 2, intensity: 1 } },
      { label: "深夜健身房泄压", delta: { morning: -2, intensity: 2 } },
      { label: "做做瑜伽缓一缓", delta: { morning: 0, intensity: -2, variety: 1 } },
      { label: "完全摆烂", delta: { burst: 1 } },
    ],
  },
  {
    id: "q2",
    prompt: "你心目中理想的运动节奏是……",
    options: [
      { label: "每周固定 3 次，雷打不动", delta: { burst: -2 } },
      { label: "想动就动，看心情", delta: { burst: 2, variety: 1 } },
      { label: "跟着课表来", delta: { burst: -1, variety: -1 } },
      { label: "周末连刷三天", delta: { burst: 1, intensity: 1 } },
    ],
  },
  {
    id: "q3",
    prompt: "你最享受的运动场景是……",
    options: [
      { label: "汗流浃背的力量训练", delta: { intensity: 2 } },
      { label: "公园慢跑/骑行", delta: { intensity: 0, variety: 1 } },
      { label: "瑜伽垫上拉伸", delta: { intensity: -2 } },
      { label: "组队打篮球/羽毛球", delta: { intensity: 1, variety: 1 } },
    ],
  },
  {
    id: "q4",
    prompt: "你更愿意尝试……",
    options: [
      { label: "深耕一种运动到很厉害", delta: { variety: -2 } },
      { label: "什么都试一点", delta: { variety: 2 } },
      { label: "有计划地搭配几种", delta: { variety: 0, burst: -1 } },
      { label: "随机选今天想干啥", delta: { variety: 1, burst: 2 } },
    ],
  },
  {
    id: "q5",
    prompt: "运动这件事对你来说是……",
    options: [
      { label: "目标驱动，要见到效果", delta: { intensity: 2, burst: -1 } },
      { label: "和自己独处的时间", delta: { intensity: -1 } },
      { label: "和朋友一起的快乐", delta: { variety: 1, burst: 0 } },
      { label: "一种长跑式的坚持", delta: { burst: -2, intensity: 0 } },
    ],
  },
  {
    id: "q6",
    prompt: "运动结束后你最想……",
    options: [
      { label: "看数据、对比上次", delta: { intensity: 1, burst: -1 } },
      { label: "拉伸放空", delta: { intensity: -1, variety: 1 } },
      { label: "继续加一组挑战", delta: { intensity: 2, burst: 1 } },
      { label: "拍张照分享给朋友", delta: { variety: 1 } },
    ],
  },
];

export function calculateQuizResult(
  answers: Record<string, number> // questionId -> optionIndex
): PersonalityType {
  const score: PersonalityScore = { morning: 0, intensity: 0, burst: 0, variety: 0 };
  for (const q of QUIZ_QUESTIONS) {
    const idx = answers[q.id];
    if (idx === undefined) continue;
    const opt = q.options[idx];
    if (!opt) continue;
    score.morning += opt.delta.morning ?? 0;
    score.intensity += opt.delta.intensity ?? 0;
    score.burst += opt.delta.burst ?? 0;
    score.variety += opt.delta.variety ?? 0;
  }
  return inferPersonality(score);
}
```

`src/app/api/quiz/result/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateQuizResult } from "@/lib/quiz";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const { answers } = await request.json();
  const personalityType = calculateQuizResult(answers);

  await prisma.user.update({
    where: { id: userId },
    data: { personalityType },
  });

  return NextResponse.json({ personalityType });
}
```

`src/app/quiz/page.tsx`：6 道题逐题展示 + 结果页（emoji + 名字 + 标语 + 分享按钮 + 「进入首页」按钮）。结果卡片用 `gradientClass`，**纯静态**，不带任何能量条、动画、粒子。

> **特别说明**：用户首次完成测试后，性格写入即定型；如想重测，需要在「我的」页面手动重做（系统不会自动重算）。

---

### Phase 3：运动记录与统计（Tasks 9-11）

#### Task 9：周活跃连续计算

`src/lib/streak.ts`：

```typescript
/**
 * 周活跃连续：以 ISO 周（周一为一周起点）为单位。
 * 当周或连续到当周的「有运动记录的周」数量。
 *
 * 例：本周已运动 → 1 周；本周 + 上周都有运动 → 2 周；
 * 上周有运动但本周没动 → 仍计入 1 周（保留上周战绩，正向激励）。
 *
 * 一旦某周没有任何运动 → 连续中断，从最近一周重新计数。
 */
export function getISOWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export function calculateWeeklyStreak(workoutDates: Date[]): number {
  if (workoutDates.length === 0) return 0;

  const weeks = new Set(workoutDates.map(getISOWeekKey));
  const sortedWeeks = Array.from(weeks).sort().reverse(); // 最新在前

  let streak = 1;
  let prev = sortedWeeks[0];
  for (let i = 1; i < sortedWeeks.length; i++) {
    const curr = sortedWeeks[i];
    if (isPreviousWeek(prev, curr)) {
      streak++;
      prev = curr;
    } else {
      break;
    }
  }
  return streak;
}

function isPreviousWeek(later: string, earlier: string): boolean {
  const [ly, lw] = later.split("-W").map(Number);
  const [ey, ew] = earlier.split("-W").map(Number);
  if (ly === ey && lw === ew + 1) return true;
  if (ly === ey + 1 && lw === 1 && ew >= 52) return true;
  return false;
}

export function getThisWeekWorkoutCount(workoutDates: Date[]): number {
  const thisWeek = getISOWeekKey(new Date());
  return workoutDates.filter(d => getISOWeekKey(d) === thisWeek).length;
}
```

测试 `tests/streak.test.ts`：覆盖空数组、单周、连续两周、跨年（W52→W01）、断档等。

#### Task 10：运动记录 API（无 Badge / Energy 副作用）

`src/app/api/workouts/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const { type, duration, distance, buddySessionId } = await request.json();

  if (!type || !duration) {
    return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
  }

  const workout = await prisma.workout.create({
    data: {
      userId,
      type,
      duration: Number(duration),
      distance: distance ? Number(distance) : null,
      buddySessionId: buddySessionId || null,
    },
  });

  // 更新 lastWorkoutAt（不再写 personalityEnergy）
  await prisma.user.update({
    where: { id: userId },
    data: { lastWorkoutAt: workout.recordedAt },
  });

  // 处理搭子会话
  let buddyCompleted = false;
  if (buddySessionId) {
    await prisma.buddySessionParticipant.update({
      where: {
        sessionId_userId: { sessionId: buddySessionId, userId },
      },
      data: { workoutId: workout.id, joinedAt: workout.recordedAt },
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

  // 写入 Feed
  if (buddyCompleted && buddySessionId) {
    await prisma.feedItem.create({
      data: {
        userId,
        type: "buddy_workout",
        content: { sessionId: buddySessionId, type, duration },
      },
    });
  } else {
    await prisma.feedItem.create({
      data: {
        userId,
        type: "workout",
        content: { type, duration, distance: distance ?? null },
      },
    });
  }

  return NextResponse.json({ id: workout.id, buddyCompleted });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { recordedAt: "desc" },
    take: 100,
  });
  return NextResponse.json(workouts);
}
```

> 流程相比旧版本简化很多：无徽章解锁检查、无能量重算、无性格重算。

#### Task 11：用户统计聚合模块

`src/lib/stats.ts`（首页和「我的」页面共用）：

```typescript
import { prisma } from "./prisma";
import { calculateWeeklyStreak, getThisWeekWorkoutCount } from "./streak";
import type { UserStats } from "@/types";

export async function getUserStats(userId: string): Promise<UserStats> {
  const [user, workouts] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.workout.findMany({
      where: { userId },
      select: { recordedAt: true, type: true, duration: true },
    }),
  ]);

  const dates = workouts.map(w => w.recordedAt);
  const types = new Set(workouts.map(w => w.type));
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);

  return {
    weeklyActiveStreak: calculateWeeklyStreak(dates),
    weeklyTarget: user?.weeklyTarget ?? 3,
    thisWeekCount: getThisWeekWorkoutCount(dates),
    totalDuration,
    uniqueTypes: types.size,
    totalWorkouts: workouts.length,
  };
}
```

> 这个模块替代旧版 `lib/badges.ts` 中的 `getUserStats`，但不再返回 `buddySessionsCompleted`、`totalDurationHours`、`totalWitnesses` 等只用于徽章解锁的字段。

---

### Phase 4：社交 + 搭子系统（Tasks 12-15）

#### Task 12：好友 API

`src/app/api/friends/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { userAId: userId, status: "accepted" },
        { userBId: userId, status: "accepted" },
      ],
    },
    include: {
      userA: { select: { id: true, name: true, avatar: true, personalityType: true, lastWorkoutAt: true } },
      userB: { select: { id: true, name: true, avatar: true, personalityType: true, lastWorkoutAt: true } },
    },
  });

  const friends = friendships.map(f =>
    f.userAId === userId ? f.userB : f.userA
  );
  return NextResponse.json(friends);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const { friendEmail } = await request.json();
  const friend = await prisma.user.findUnique({ where: { email: friendEmail } });
  if (!friend) return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  if (friend.id === userId) return NextResponse.json({ error: "不能加自己" }, { status: 400 });

  const [a, b] = userId < friend.id ? [userId, friend.id] : [friend.id, userId];

  const existing = await prisma.friendship.findUnique({
    where: { userAId_userBId: { userAId: a, userBId: b } },
  });
  if (existing) {
    return NextResponse.json({ error: "已是好友或已发送请求" }, { status: 409 });
  }

  await prisma.friendship.create({
    data: { userAId: a, userBId: b, status: "accepted" }, // MVP：双向自动接受
  });

  return NextResponse.json({ ok: true });
}
```

`src/components/FriendSummary.tsx`：展示好友列表（头像 + 名字 + 「正在运动中」标记，根据 lastWorkoutAt 离当前 30 分钟内判断）。

#### Task 13：搭子会话 API

`src/app/api/buddy-sessions/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 创建搭子会话
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const { friendIds, windowStart, windowEnd } = await request.json();
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
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

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
          user: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
    orderBy: { windowStart: "asc" },
  });
  return NextResponse.json(sessions);
}
```

> 状态机：到达 `windowStart` 时由前端首次访问触发更新为 `active`（或加一个轻量后台 cron，MVP 先在 GET 里懒更新）；所有人都完成 → `completed`；窗口过期且未全员完成 → `expired`。

#### Task 14：Feed 列表与组件

`src/app/api/feed/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { userAId: userId, status: "accepted" },
        { userBId: userId, status: "accepted" },
      ],
    },
  });
  const friendIds = friendships.map(f =>
    f.userAId === userId ? f.userBId : f.userAId
  );

  const visibleUserIds = [userId, ...friendIds];

  const items = await prisma.feedItem.findMany({
    where: { userId: { in: visibleUserIds } },
    include: {
      user: { select: { id: true, name: true, avatar: true, personalityType: true } },
      interactions: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(items);
}
```

`src/components/FeedItem.tsx`（**只处理 workout / buddy_workout 两种类型**）：

```tsx
import type { InteractionType } from "@/types";
import { PERSONALITY_PROFILES } from "@/lib/personality";

type FeedItemData = {
  id: string;
  type: "workout" | "buddy_workout";
  content: Record<string, unknown>;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null; personalityType: string | null };
  interactions: { id: string; type: InteractionType; user: { id: string; name: string } }[];
};

export default function FeedItem({ item, onInteract }: {
  item: FeedItemData;
  onInteract: (feedItemId: string, type: InteractionType) => void;
}) {
  const profile = item.user.personalityType
    ? PERSONALITY_PROFILES[item.user.personalityType as keyof typeof PERSONALITY_PROFILES]
    : null;

  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm">
      <header className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          {profile?.emoji ?? "🙂"}
        </div>
        <div>
          <div className="font-medium">{item.user.name}</div>
          <div className="text-xs text-text-soft">{new Date(item.createdAt).toLocaleString("zh-CN")}</div>
        </div>
      </header>

      <div className="text-sm">
        {item.type === "workout" && <WorkoutContent content={item.content} />}
        {item.type === "buddy_workout" && <BuddyContent content={item.content} />}
      </div>

      <footer className="mt-3 flex gap-3 text-sm text-text-soft">
        <button onClick={() => onInteract(item.id, "like")}>👍 {countByType(item, "like")}</button>
        <button onClick={() => onInteract(item.id, "witness")}>🙌 见证 {countByType(item, "witness")}</button>
        <button onClick={() => onInteract(item.id, "comment")}>💬 {countByType(item, "comment")}</button>
      </footer>
    </article>
  );
}

function countByType(item: FeedItemData, type: InteractionType) {
  return item.interactions.filter(i => i.type === type).length;
}

function WorkoutContent({ content }: { content: Record<string, unknown> }) {
  return (
    <p>记录了一次 {String(content.type)}，时长 {String(content.duration)} 分钟。</p>
  );
}

function BuddyContent({ content }: { content: Record<string, unknown> }) {
  return (
    <p>和搭子一起完成了一次 {String(content.type)}！</p>
  );
}
```

> **不再有** `BadgeContent` / `EvolveContent` 分支，因为 FeedItemType 只剩两种。

`src/components/FeedList.tsx`：包装 fetch + 列表渲染 + 互动回调。

#### Task 15：互动 API（点赞 / 评论 / 见证）

`src/app/api/interactions/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const { feedItemId, type, content } = await request.json();
  if (!feedItemId || !type) {
    return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
  }
  if (!["like", "comment", "witness"].includes(type)) {
    return NextResponse.json({ error: "未知互动类型" }, { status: 400 });
  }

  // 同一用户对同一 feed 的 like / witness 不重复
  if (type !== "comment") {
    const existing = await prisma.interaction.findFirst({
      where: { feedItemId, userId, type },
    });
    if (existing) {
      await prisma.interaction.delete({ where: { id: existing.id } });
      return NextResponse.json({ removed: true });
    }
  }

  const interaction = await prisma.interaction.create({
    data: {
      feedItemId,
      userId,
      type,
      content: type === "comment" ? (content as string) : null,
    },
  });
  return NextResponse.json(interaction);
}
```

---

### Phase 5：UI 组装（Tasks 16-20）

#### Task 16：首页核心组件（无 EnergyBar / NextBadgeProgress）

`src/components/GreetingHeader.tsx`（顶部 chip-style 头部 = 性格 emoji + 名字 + 一句问候）：

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERSONALITY_PROFILES } from "@/lib/personality";

export default async function GreetingHeader() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userId = (session.user as { id: string }).id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const profile = user.personalityType
    ? PERSONALITY_PROFILES[user.personalityType as keyof typeof PERSONALITY_PROFILES]
    : null;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{profile?.emoji ?? "👋"}</span>
        <div>
          <div className="text-xs text-text-soft">嗨，{user.name}</div>
          <div className="text-sm font-medium">
            {profile ? profile.name : "未测性格"}
          </div>
        </div>
      </div>
      {profile && (
        <span className={`text-xs px-2 py-1 rounded-full ${profile.gradientClass}`}
              style={{ color: profile.textColor }}>
          {profile.slogan.slice(0, 8)}
        </span>
      )}
    </div>
  );
}
```

> 性格只是顶部 chip，**不占视觉重心**。无能量条、无动画。

`src/components/BuddyStatus.tsx`（首要触发器）：

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BuddyStatus() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userId = (session.user as { id: string }).id;

  const now = new Date();
  const halfHourAgo = new Date(now.getTime() - 30 * 60 * 1000);

  // 1. 即将开始的搭子会话
  const upcomingSession = await prisma.buddySession.findFirst({
    where: {
      participants: { some: { userId } },
      status: { in: ["pending", "active"] },
      windowEnd: { gte: now },
    },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
    },
    orderBy: { windowStart: "asc" },
  });

  if (upcomingSession) {
    const others = upcomingSession.participants.filter(p => p.userId !== userId);
    const startInMin = Math.max(0, Math.floor(
      (upcomingSession.windowStart.getTime() - now.getTime()) / 60000
    ));
    return (
      <div className="bg-purple-100 rounded-2xl p-4">
        <div className="text-sm text-purple-900 font-medium mb-1">
          {startInMin > 0 ? `${startInMin} 分钟后和搭子一起动` : "搭子时间到啦！"}
        </div>
        <div className="text-xs text-purple-700">
          {others.map(p => p.user.name).join("、")}
        </div>
      </div>
    );
  }

  // 2. 当前正在动的好友
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { userAId: userId, status: "accepted" },
        { userBId: userId, status: "accepted" },
      ],
    },
  });
  const friendIds = friendships.map(f => f.userAId === userId ? f.userBId : f.userAId);
  const activeFriends = await prisma.user.findMany({
    where: {
      id: { in: friendIds },
      lastWorkoutAt: { gte: halfHourAgo },
    },
    select: { id: true, name: true, avatar: true, personalityType: true },
  });

  if (activeFriends.length > 0) {
    return (
      <div className="bg-orange-50 rounded-2xl p-4">
        <div className="text-sm text-orange-900 font-medium mb-2">
          🔥 此刻有 {activeFriends.length} 位搭子正在运动
        </div>
        <div className="flex gap-2 flex-wrap">
          {activeFriends.slice(0, 5).map(f => (
            <span key={f.id} className="text-xs bg-white px-2 py-1 rounded-full">
              {f.name} 正在动
            </span>
          ))}
        </div>
      </div>
    );
  }

  // 3. 无搭子状态：引导添加好友 / 分享性格卡片
  return (
    <div className="bg-purple-50 rounded-2xl p-4">
      <div className="text-sm text-purple-900 font-medium mb-1">
        还没有搭子？
      </div>
      <div className="text-xs text-purple-700">
        分享你的运动性格卡片，邀请好友一起动
      </div>
    </div>
  );
}
```

`src/components/WeeklyProgress.tsx`：

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserStats } from "@/lib/stats";

export default async function WeeklyProgress() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userId = (session.user as { id: string }).id;

  const stats = await getUserStats(userId);
  const remaining = Math.max(0, stats.weeklyTarget - stats.thisWeekCount);
  const percent = Math.min(100, (stats.thisWeekCount / stats.weeklyTarget) * 100);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-sm font-medium">本周进度</div>
        <div className="text-xs text-text-soft">
          {stats.thisWeekCount} / {stats.weeklyTarget} 次
        </div>
      </div>
      <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-xs text-text-soft mt-2">
        {remaining > 0
          ? `再运动 ${remaining} 次就能完成本周目标！`
          : "本周目标已达成 🎉"}
      </div>
    </div>
  );
}
```

`src/components/QuickRecord.tsx`：全宽紫色渐变按钮，点击跳转 `/record`。

> 不再有 `EnergyBar.tsx`、`NextBadgeProgress.tsx`、卡片式 `PersonalityCard.tsx`。

#### Task 17：首页装配（3 段结构：BuddyStatus → WeeklyProgress → CTA）

`src/app/page.tsx`：

```tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import GreetingHeader from "@/components/GreetingHeader";
import BuddyStatus from "@/components/BuddyStatus";
import WeeklyProgress from "@/components/WeeklyProgress";
import QuickRecord from "@/components/QuickRecord";
import BottomNav from "@/components/BottomNav";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");
  if (!user.personalityType) redirect("/quiz");

  return (
    <main className="min-h-screen pb-20 max-w-md mx-auto">
      <GreetingHeader />
      <div className="px-4 space-y-3">
        <BuddyStatus />
        <WeeklyProgress />
        <QuickRecord />
      </div>
      <BottomNav active="home" />
    </main>
  );
}
```

> 首页结构：**GreetingHeader → BuddyStatus → WeeklyProgress → CTA**。砍掉了 NextBadgeProgress、能量条、性格卡片大图。3 段为限。

#### Task 18：底部导航

`src/components/BottomNav.tsx`：

```tsx
import Link from "next/link";

export default function BottomNav({ active }: { active: "home" | "circle" | "profile" }) {
  const items = [
    { key: "home", label: "首页", emoji: "🏠", href: "/" },
    { key: "circle", label: "运动圈", emoji: "👥", href: "/circle" },
    { key: "profile", label: "我的", emoji: "🙂", href: "/profile" },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-border flex">
      {items.map(it => (
        <Link
          key={it.key}
          href={it.href}
          className={`flex-1 py-2 text-center text-xs ${
            active === it.key ? "text-primary font-medium" : "text-text-soft"
          }`}
        >
          <div className="text-lg">{it.emoji}</div>
          <div>{it.label}</div>
        </Link>
      ))}
    </nav>
  );
}
```

#### Task 19：运动圈页面

`src/app/circle/page.tsx`：

```tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FeedList from "@/components/FeedList";
import BottomNav from "@/components/BottomNav";

export default async function CirclePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <main className="min-h-screen pb-20 max-w-md mx-auto">
      <header className="px-4 py-3">
        <h1 className="text-lg font-medium">运动圈</h1>
        <p className="text-xs text-text-soft">看看搭子们都在动什么</p>
      </header>
      <div className="px-4 space-y-3">
        <FeedList />
      </div>
      <BottomNav active="circle" />
    </main>
  );
}
```

#### Task 20：「我的」页面（无徽章墙）

`src/app/profile/page.tsx`：

```tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERSONALITY_PROFILES } from "@/lib/personality";
import { getUserStats } from "@/lib/stats";
import HeatmapGrid from "@/components/HeatmapGrid";
import BottomNav from "@/components/BottomNav";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const [user, workouts, stats] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.workout.findMany({
      where: { userId },
      orderBy: { recordedAt: "desc" },
      take: 365,
      select: { recordedAt: true, type: true, duration: true },
    }),
    getUserStats(userId),
  ]);

  if (!user) redirect("/login");

  const profile = user.personalityType
    ? PERSONALITY_PROFILES[user.personalityType as keyof typeof PERSONALITY_PROFILES]
    : null;

  return (
    <main className="min-h-screen pb-20 max-w-md mx-auto">
      {/* 顶部：性格身份卡（静态展示） */}
      {profile && (
        <section className={`px-4 py-6 ${profile.gradientClass} rounded-b-3xl`}
                  style={{ color: profile.textColor }}>
          <div className="text-4xl mb-1">{profile.emoji}</div>
          <div className="text-lg font-medium">{profile.name}</div>
          <div className="text-sm opacity-90">{profile.slogan}</div>
          <div className="text-xs mt-2 opacity-80">{user.name}</div>
        </section>
      )}

      {/* 数据概览 */}
      <section className="px-4 mt-4 grid grid-cols-3 gap-2">
        <Stat label="连续周数" value={stats.weeklyActiveStreak} unit="周" />
        <Stat label="累计次数" value={stats.totalWorkouts} unit="次" />
        <Stat label="累计时长" value={Math.round(stats.totalDuration / 60)} unit="小时" />
      </section>

      {/* 年度热力图 */}
      <section className="px-4 mt-4">
        <h2 className="text-sm font-medium mb-2">年度热力图</h2>
        <HeatmapGrid workouts={workouts} />
      </section>

      {/* 运动历史 */}
      <section className="px-4 mt-4">
        <h2 className="text-sm font-medium mb-2">运动历史</h2>
        <ul className="space-y-2">
          {workouts.slice(0, 10).map((w, i) => (
            <li key={i} className="bg-white rounded-xl p-3 text-sm flex justify-between">
              <span>{w.type}</span>
              <span className="text-text-soft">
                {w.duration} 分钟 · {new Date(w.recordedAt).toLocaleDateString("zh-CN")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 重做性格测试入口 */}
      <section className="px-4 mt-6">
        <a href="/quiz" className="text-sm text-primary">重新测一次运动性格 →</a>
      </section>

      <BottomNav active="profile" />
    </main>
  );
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="bg-white rounded-xl p-3 text-center">
      <div className="text-lg font-medium">{value}</div>
      <div className="text-xs text-text-soft">{label}（{unit}）</div>
    </div>
  );
}
```

`src/components/HeatmapGrid.tsx`：用 CSS Grid 渲染过去 1 年（53 周 × 7 天）的方格，每格的颜色根据当天总时长分桶。**不引入 Recharts**。

> 没有 `BadgeWall`，没有 `NextBadgeProgress`。

---

### Phase 6：测试与部署（Tasks 21-22）

#### Task 21：Jest 配置 + 关键测试

`jest.config.ts`：

```typescript
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
};

export default config;
```

`package.json` scripts：

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

测试覆盖：
- `tests/personality.test.ts`：8 种性格的边界用例（每种性格至少 1 个能命中的输入分数）
- `tests/streak.test.ts`：周活跃连续的空数组、单周、连续两周、跨年（W52→W01）、断档场景

> **不再有** `tests/energy.test.ts` 与 `tests/badges.test.ts`。

#### Task 22：Vercel 部署

1. 在 GitHub 创建仓库 `dabble`
2. 推送代码：`git push -u origin main`
3. 在 Vercel Dashboard 关联仓库
4. 在 Vercel 环境变量中配置：
   - `DATABASE_URL`（Supabase Pooler URL，含 `?pgbouncer=true&connection_limit=1`）
   - `DIRECT_URL`（Supabase 直连 URL，供 Prisma migrate 用）
   - `NEXTAUTH_SECRET`（`openssl rand -base64 32`）
   - `NEXTAUTH_URL`（生产域名，如 `https://dabble.vercel.app`）
5. 在 `package.json` 中 `"build": "prisma generate && prisma migrate deploy && next build"`
6. 触发部署，验证：
   - 注册、登录可用
   - 性格测试可用
   - 记录运动后首页本周进度更新
   - 加好友 → 双方 Feed 互见
   - 创建搭子会话 → 双方都记录后生成 buddy_workout Feed

---

## 自检清单（Self-Review）

完成全部任务后，根据设计稿做一次走查：

- ✅ §1 产品哲学：3 页结构（首页 / 运动圈 / 我的）→ Task 17、19、20
- ✅ §2 引擎一（搭子）：BuddyStatus + 搭子会话 → Task 13、16
- ✅ §2 引擎二（周活跃正向）：WeeklyProgress + ISO 周连续 → Task 9、16
- ✅ §2 砍掉的引擎：徽章 ❌、能量状态 ❌、性格进化 ❌、特效动画 ❌ → 整体计划已无对应任务
- ✅ §3.1 首页 3 段：GreetingHeader chip + BuddyStatus + WeeklyProgress + CTA → Task 16、17
- ✅ §3.2 运动圈：FeedList + 点赞/评论/见证 → Task 14、15、19
- ✅ §3.3 我的：性格静态卡 + 热力图 + 运动历史 + 重测入口（**无徽章墙**）→ Task 20
- ✅ §4 搭子时间窗口模型：BuddySession + ±30min 软窗口 → Task 13、16
- ✅ §5 性格仅冷启动 + 8 种 + 分享卡片 → Task 7、8
- ✅ §5.4 不做能量值/状态条/重算/动画 → 类型与组件中均无对应字段
- ✅ §7 V1 手动记录运动 → Task 10
- ✅ §8 数据模型：User、Workout、BuddySession*、Friendship、FeedItem、Interaction（**无 Badge、无 personalityEnergy**）→ Task 3
- ✅ §8 核心数据流（无 badge / energy 副作用）→ Task 10
- ✅ §9 V2 推迟项：Keep API、周报告卡、弱关系激活、搭子匹配推荐 → 不在 MVP 范围

类型一致性：
- `PersonalityType` 与 schema `User.personalityType` 字符串集一致
- `WorkoutType` 与录入表单选项一致
- `FeedItemType` 仅 `workout | buddy_workout`
- `InteractionType` 与 API 校验集一致
- 不再出现 `EnergyState` / `BadgeSeries` / `BadgeTier` 类型引用

> 任务从原 23 个精简到 22 个：删除了「Energy 系统」「Badge 定义」「Badge API & 组件」三块内容；新增了独立的「用户统计聚合模块（lib/stats.ts）」承接首页和「我的」页面共用的统计需求。
