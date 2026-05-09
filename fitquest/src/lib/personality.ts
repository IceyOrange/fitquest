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
