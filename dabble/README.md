<p align="center">
  <a href="#english">English</a> · <a href="#chinese">中文</a>
</p>

---

<h1 id="english" align="center">Dabble</h1>
<p align="center"><strong>Move with Your Buddy</strong></p>

<p align="center">
  Next.js 16 · TypeScript · Tailwind CSS v4 · PostgreSQL
</p>

> When you're about to skip your workout, you see a friend moving. So you move too.

## The Problem

Fitness apps give you data, plans, and guilt. What they don't give you is someone moving alongside you.

Most college students don't need another calorie tracker or training program. They need to get past that single moment when the couch feels irresistible. And the only thing that reliably works is seeing someone you know — moving right now.

## The Philosophy

Everything in Dabble exists to create that exact moment. Everything else is cut.

No data anxiety. No plan pressure. No leaderboard shame. Just the quiet realization: *"They're moving. I should too."*

## Features

| | Feature | What it does |
|---|---|---|
| 🏃‍♂️ | **Buddy Sessions** | Schedule a soft time window (±30 min) with friends. Move in your own space, feel each other's presence. |
| 👥 | **Buddy Status Card** | Right at the top of your home screen — who's working out right now. The primary trigger. |
| 📊 | **Weekly Heatmap** | GitHub-style activity streak, weekly cadence. Framed positively: "Just 2 more to hit your goal!" |
| 🧠 | **Personality Quiz** | 6-question cold-start. One of 8 workout personalities. Share your card to invite friends. |
| 💬 | **Social Feed** | Friends' workouts only. Like, comment, or "Witness" — a lightweight way to say *I see you*. |
| ⚡ | **30-Second Log** | Type + duration. That's it. No fields, no friction. |

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) App Router + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/) (credentials + bcryptjs)
- **Testing**: [Jest](https://jestjs.io/) + [ts-jest](https://kulshekhar.github.io/ts-jest/)
- **Fonts**: [Geist](https://vercel.com/font) + Geist Mono

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/IceyOrange/Dabble-Move_with_your_click.git
cd dabble
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase DB URL and NextAuth secret

# 3. Push database schema
npx prisma db push

# 4. Seed demo data (optional)
# The app includes demo data for local development

# 5. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection | `postgresql://...` |
| `NEXTAUTH_SECRET` | Session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App base URL | `http://localhost:3000` |

See [`.env.example`](.env.example) for the full template.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/          # Login & Register
│   ├── api/             # API routes (workouts, feed, friends, ...)
│   ├── circle/          # Social feed page
│   ├── profile/         # User profile & settings
│   ├── quiz/            # Personality quiz
│   ├── record/          # Quick workout log
│   ├── page.tsx         # Home page
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── BuddyStatus.tsx      # Live buddy presence
│   ├── FeedList.tsx         # Social feed
│   ├── QuickRecord.tsx      # Quick log form
│   ├── StreakHeatmap.tsx    # Weekly heatmap
│   └── ...
├── lib/                 # Utilities & config
│   ├── prisma.ts            # Prisma client
│   ├── auth.config.ts       # NextAuth config
│   ├── personality.ts       # 8 personality profiles
│   ├── quiz-questions.ts    # Quiz data
│   └── demo-data.ts         # Local dev seed data
└── types/               # Shared TypeScript types
```

## Roadmap

- [x] MVP core features (buddy sessions, feed, quiz, profile)
- [x] Authentication (email + password)
- [x] Workout logging & heatmap
- [ ] Real-time buddy presence (WebSockets / SSE)
- [ ] Push notifications for session reminders
- [ ] Group challenges & streak competitions
- [ ] PWA support for mobile install

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run test` | Run Jest test suite |
| `npm run lint` | ESLint check |

---

<p align="center"><a href="#chinese">↓ 切换到中文版</a></p>

---

<h1 id="chinese" align="center">搭搭动</h1>
<p align="center"><strong>跟你的运动搭子一起动</strong></p>

<p align="center">
  Next.js 16 · TypeScript · Tailwind CSS v4 · PostgreSQL
</p>

> 在你最想偷懒的那一刻，看见熟人正在动。然后你也跟着动了起来。

## 问题

健身 App 给你数据、计划和愧疚感。唯独没有给你一个「正在动」的人。

大多数大学生不需要再多一个卡路里计数器或训练计划。他们只需要跨过那一个瞬间——沙发好像有磁性，根本起不来。而唯一 reliably 有用的，是看见一个你认识的人，此刻正在运动。

## 哲学

搭搭动的每个功能，都只为制造那一刻而存在。其他东西能砍就砍。

没有数据焦虑，没有计划压力，没有排行榜羞辱。只有那个安静的想法：*「Ta 都动了，那我也动一下吧。」*

## 功能

| | 功能 | 说明 |
|---|---|---|
| 🏃‍♂️ | **搭子时间窗口** | 和好友约定一个软时间窗口（±30 分钟）。各自在自己的空间运动，但感知彼此在场。 |
| 👥 | **搭子状态卡** | 首页置顶显示「正在运动的搭子」，首要触发器。 |
| 📊 | **周活跃热力图** | GitHub 风格热力图，以周为单位。文案永远正向：「再运动 2 次就能完成本周目标！」 |
| 🧠 | **运动性格测试** | 6 道冷启动趣味题，生成 8 种运动性格之一。分享性格卡片邀请好友。 |
| 💬 | **运动圈 Feed** | 仅看好友动态。点赞、评论、「见证」—— 比点赞重，比评论轻的社交动作。 |
| ⚡ | **30 秒记录** | 运动类型 + 时长。仅此而已。没有多余字段，没有摩擦。 |

## 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) App Router + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **数据库**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **认证**: [NextAuth.js](https://next-auth.js.org/)（邮箱密码 + bcryptjs）
- **测试**: [Jest](https://jestjs.io/) + [ts-jest](https://kulshekhar.github.io/ts-jest/)
- **字体**: [Geist](https://vercel.com/font) + Geist Mono

## 快速开始

```bash
# 1. 克隆并安装依赖
git clone https://github.com/IceyOrange/Dabble-Move_with_your_click.git
cd dabble
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 Supabase 数据库地址和 NextAuth 密钥

# 3. 推送数据库表结构
npx prisma db push

# 4. 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

### 环境变量

| 变量 | 用途 | 示例 |
|---|---|---|
| `DATABASE_URL` | Supabase PostgreSQL 连接串 | `postgresql://...` |
| `NEXTAUTH_SECRET` | 会话加密密钥 | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | 应用基础地址 | `http://localhost:3000` |

完整模板见 [`.env.example`](.env.example)。

## 项目结构

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/          # 登录与注册
│   ├── api/             # API 路由（运动记录、动态、好友等）
│   ├── circle/          # 运动圈页面
│   ├── profile/         # 个人主页与设置
│   ├── quiz/            # 性格测试
│   ├── record/          # 快速记运动
│   ├── page.tsx         # 首页
│   └── layout.tsx       # 根布局
├── components/          # React 组件
│   ├── BuddyStatus.tsx      # 搭子实时状态
│   ├── FeedList.tsx         # 社交动态流
│   ├── QuickRecord.tsx      # 快捷记录表单
│   ├── StreakHeatmap.tsx    # 周热力图
│   └── ...
├── lib/                 # 工具与配置
│   ├── prisma.ts            # Prisma 客户端
│   ├── auth.config.ts       # NextAuth 配置
│   ├── personality.ts       # 8 种运动性格档案
│   ├── quiz-questions.ts    # 测试题目数据
│   └── demo-data.ts         # 本地开发模拟数据
└── types/               # 共享 TypeScript 类型
```

## 路线图

- [x] MVP 核心功能（搭子约练、运动圈、性格测试、个人主页）
- [x] 用户认证（邮箱 + 密码）
- [x] 运动记录与热力图
- [ ] 搭子实时在线状态（WebSockets / SSE）
- [ ] 训练提醒推送通知
- [ ] 组队挑战与连击竞赛
- [ ] PWA 移动端支持

## 常用命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run test` | 运行 Jest 测试 |
| `npm run lint` | ESLint 检查 |

---

<p align="center"><a href="#english">↑ Back to English</a></p>
