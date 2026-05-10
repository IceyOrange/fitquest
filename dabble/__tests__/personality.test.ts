import { calculatePersonality, PERSONALITY_PROFILES } from "@/lib/personality";
import type { QuizAnswer } from "@/types";

describe("calculatePersonality", () => {
  it("returns dawn_walker for morning, consistent, moderate-high intensity", () => {
    const answer: QuizAnswer = { timePreference: -0.8, intensityPreference: 0.3, frequencyPattern: -0.7, varietyPreference: 0.0 };
    expect(calculatePersonality(answer)).toBe("dawn_walker");
  });

  it("returns night_owl for night, high intensity, burst", () => {
    const answer: QuizAnswer = { timePreference: 0.8, intensityPreference: 0.7, frequencyPattern: 0.5, varietyPreference: -0.2 };
    expect(calculatePersonality(answer)).toBe("night_owl");
  });

  it("returns fat_burner for high intensity, consistent, focused", () => {
    const answer: QuizAnswer = { timePreference: 0.0, intensityPreference: 0.8, frequencyPattern: -0.6, varietyPreference: -0.7 };
    expect(calculatePersonality(answer)).toBe("fat_burner");
  });

  it("returns zen_walker for low intensity, consistent, diverse", () => {
    const answer: QuizAnswer = { timePreference: 0.0, intensityPreference: -0.6, frequencyPattern: -0.5, varietyPreference: 0.6 };
    expect(calculatePersonality(answer)).toBe("zen_walker");
  });

  it("returns free_spirit for burst, diverse, any time", () => {
    const answer: QuizAnswer = { timePreference: 0.2, intensityPreference: 0.1, frequencyPattern: 0.7, varietyPreference: 0.7 };
    expect(calculatePersonality(answer)).toBe("free_spirit");
  });

  it("returns precision_hunter for consistent, focused, planned", () => {
    const answer: QuizAnswer = { timePreference: -0.3, intensityPreference: 0.2, frequencyPattern: -0.8, varietyPreference: -0.8 };
    expect(calculatePersonality(answer)).toBe("precision_hunter");
  });

  it("returns all_round for diverse, balanced everything", () => {
    const answer: QuizAnswer = { timePreference: 0.0, intensityPreference: 0.0, frequencyPattern: 0.0, varietyPreference: 0.8 };
    expect(calculatePersonality(answer)).toBe("all_round");
  });

  it("returns marathon_soul for consistent, moderate, enduring", () => {
    const answer: QuizAnswer = { timePreference: -0.5, intensityPreference: -0.2, frequencyPattern: -0.9, varietyPreference: -0.3 };
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
      expect(profile).toHaveProperty("gradientClass");
    }
  });
});
