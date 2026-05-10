import type { PersonalityType } from "@/types";

export interface DemoFeedItem {
  id: string; type: string; content: Record<string, unknown>; createdAt: string;
  user: { id: string; name: string; personalityType: string | null };
  interactions: { id: string; userId: string; type: string; content: string | null }[];
}

export interface DemoFriend {
  id: string; name: string; personalityType: string | null; exercisedToday: boolean;
}

export interface DemoWorkout {
  type: string;
  duration: number;
  distance: number | null;
  recordedAt: string;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const DEMO_FEED: DemoFeedItem[] = [
  {
    id: "demo-1", type: "workout",
    content: { workoutType: "running", duration: 35, distance: 5.2 },
    createdAt: hoursAgo(0.5),
    user: { id: "du-1", name: "小明", personalityType: "dawn_walker" },
    interactions: [
      { id: "di-1", userId: "du-2", type: "like", content: null },
      { id: "di-2", userId: "du-3", type: "like", content: null },
      { id: "di-3", userId: "du-4", type: "witness", content: null },
      { id: "di-4", userId: "du-5", type: "like", content: null },
    ],
  },
  {
    id: "demo-2", type: "workout",
    content: { workoutType: "gym", duration: 45 },
    createdAt: hoursAgo(1.5),
    user: { id: "du-2", name: "小红", personalityType: "fat_burner" },
    interactions: [
      { id: "di-5", userId: "du-1", type: "like", content: null },
      { id: "di-6", userId: "du-3", type: "like", content: null },
      { id: "di-7", userId: "du-4", type: "witness", content: null },
    ],
  },
  {
    id: "demo-3", type: "workout",
    content: { workoutType: "yoga", duration: 60 },
    createdAt: hoursAgo(3),
    user: { id: "du-3", name: "小林", personalityType: "zen_walker" },
    interactions: [
      { id: "di-8", userId: "du-1", type: "like", content: null },
    ],
  },
  {
    id: "demo-4", type: "workout",
    content: { workoutType: "cycling", duration: 40, distance: 12 },
    createdAt: hoursAgo(5),
    user: { id: "du-4", name: "小李", personalityType: "all_round" },
    interactions: [
      { id: "di-9", userId: "du-2", type: "witness", content: null },
      { id: "di-10", userId: "du-3", type: "like", content: null },
    ],
  },
  {
    id: "demo-5", type: "buddy_workout",
    content: { workoutType: "basketball", duration: 90 },
    createdAt: hoursAgo(6),
    user: { id: "du-5", name: "阿杰", personalityType: "night_owl" },
    interactions: [
      { id: "di-11", userId: "du-1", type: "like", content: null },
      { id: "di-12", userId: "du-4", type: "witness", content: null },
    ],
  },
];

export const DEMO_FRIENDS: DemoFriend[] = [
  { id: "du-1", name: "小明", personalityType: "dawn_walker", exercisedToday: true },
  { id: "du-2", name: "小红", personalityType: "fat_burner", exercisedToday: true },
  { id: "du-3", name: "小林", personalityType: "zen_walker", exercisedToday: false },
  { id: "du-4", name: "小李", personalityType: "all_round", exercisedToday: true },
  { id: "du-5", name: "阿杰", personalityType: "night_owl", exercisedToday: false },
];

export const DEMO_USER = {
  id: "demo-user",
  name: "小宇",
  email: "demo@dabble.app",
  personalityType: "dawn_walker" as PersonalityType,
  weeklyTarget: 3,
  image: null,
};

export const DEMO_WORKOUTS: DemoWorkout[] = [
  { type: "running", duration: 35, distance: 5.2, recordedAt: daysAgo(0) },
  { type: "gym", duration: 45, distance: null, recordedAt: daysAgo(1) },
  { type: "yoga", duration: 60, distance: null, recordedAt: daysAgo(2) },
  { type: "cycling", duration: 40, distance: 12, recordedAt: daysAgo(4) },
  { type: "basketball", duration: 90, distance: null, recordedAt: daysAgo(5) },
  { type: "running", duration: 30, distance: 4.8, recordedAt: daysAgo(7) },
  { type: "swimming", duration: 45, distance: 1.5, recordedAt: daysAgo(9) },
  { type: "hiking", duration: 120, distance: 8, recordedAt: daysAgo(12) },
  { type: "gym", duration: 50, distance: null, recordedAt: daysAgo(14) },
  { type: "running", duration: 25, distance: 4, recordedAt: daysAgo(16) },
  { type: "badminton", duration: 60, distance: null, recordedAt: daysAgo(18) },
  { type: "yoga", duration: 45, distance: null, recordedAt: daysAgo(21) },
  { type: "cycling", duration: 35, distance: 10, recordedAt: daysAgo(23) },
  { type: "running", duration: 40, distance: 6.5, recordedAt: daysAgo(25) },
  { type: "gym", duration: 55, distance: null, recordedAt: daysAgo(28) },
];

export function generateHeatmapData(totalDays = 182): { date: string; count: number }[] {
  const workoutDays: Record<string, number> = {};
  for (const w of DEMO_WORKOUTS) {
    const date = new Date(w.recordedAt).toISOString().slice(0, 10);
    workoutDays[date] = (workoutDays[date] || 0) + 1;
  }

  const result: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    result.push({ date: iso, count: workoutDays[iso] || 0 });
  }
  return result;
}
