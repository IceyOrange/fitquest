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
  timePreference: number;
  intensityPreference: number;
  frequencyPattern: number;
  varietyPreference: number;
}
