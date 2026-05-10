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
