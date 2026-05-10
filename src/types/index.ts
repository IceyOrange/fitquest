export type PersonalityType =
  | "dawn_walker"
  | "night_owl"
  | "fat_burner"
  | "zen_walker"
  | "free_spirit"
  | "precision_hunter"
  | "all_round"
  | "marathon_soul";

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

export type FeedItemType = "workout" | "buddy_workout";

export type InteractionType = "like" | "comment" | "witness";

export interface PersonalityProfile {
  type: PersonalityType;
  emoji: string;
  name: string;
  slogan: string;
  gradientClass: string;
  textColor: string;
}

export interface UserStats {
  weeklyActiveStreak: number;
  weeklyTarget: number;
  thisWeekCount: number;
  totalDuration: number;
  uniqueTypes: number;
  totalWorkouts: number;
}

export interface QuizAnswer {
  timePreference: number;
  intensityPreference: number;
  frequencyPattern: number;
  varietyPreference: number;
}
