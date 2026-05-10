import type { PersonalityType } from "@/types";

export interface DemoFeedItem {
  id: string; type: string; content: Record<string, unknown>; createdAt: string;
  user: { id: string; name: string; personalityType: string | null };
  interactions: { id: string; userId: string; type: string; content: string | null }[];
}

export interface DemoFriend {
  id: string; name: string; personalityType: string | null; exercisedToday: boolean;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

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
