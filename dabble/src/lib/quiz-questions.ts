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
      { text: "早起跑步清醒头脑", scores: { timePreference: -0.8, intensityPreference: 0.2, frequencyPattern: -0.6, varietyPreference: -0.3 } },
      { text: "晚上去健身房释放压力", scores: { timePreference: 0.7, intensityPreference: 0.7, frequencyPattern: 0.2, varietyPreference: -0.4 } },
      { text: "不运动，考试要紧", scores: { timePreference: 0, intensityPreference: 0, frequencyPattern: 0.8, varietyPreference: 0 } },
      { text: "随便做点拉伸，保持状态", scores: { timePreference: 0, intensityPreference: -0.6, frequencyPattern: -0.3, varietyPreference: 0.4 } },
    ],
  },
  {
    id: 2,
    question: "理想的运动时长是？",
    options: [
      { text: "30 分钟高效燃烧", scores: { timePreference: 0, intensityPreference: 0.8, frequencyPattern: 0.3, varietyPreference: -0.5 } },
      { text: "1 小时刚好舒服", scores: { timePreference: 0, intensityPreference: 0.2, frequencyPattern: -0.3, varietyPreference: 0.2 } },
      { text: "2 小时以上才过瘾", scores: { timePreference: 0, intensityPreference: 0.4, frequencyPattern: -0.7, varietyPreference: 0.3 } },
      { text: "看心情，10 分钟也行", scores: { timePreference: 0, intensityPreference: -0.4, frequencyPattern: 0.6, varietyPreference: 0.6 } },
    ],
  },
  {
    id: 3,
    question: "你会选哪种运动伙伴？",
    options: [
      { text: "比我强的，能带我进步", scores: { timePreference: 0, intensityPreference: 0.6, frequencyPattern: -0.5, varietyPreference: -0.4 } },
      { text: "有趣的人，边练边聊", scores: { timePreference: 0, intensityPreference: -0.3, frequencyPattern: 0.2, varietyPreference: 0.7 } },
      { text: "固定搭档，互相监督", scores: { timePreference: 0, intensityPreference: 0.1, frequencyPattern: -0.7, varietyPreference: -0.6 } },
      { text: "自己一个人最好", scores: { timePreference: 0, intensityPreference: 0.3, frequencyPattern: 0.3, varietyPreference: -0.2 } },
    ],
  },
  {
    id: 4,
    question: "新学期选体育课，你选？",
    options: [
      { text: "田径，经典永不过时", scores: { timePreference: -0.3, intensityPreference: 0.5, frequencyPattern: -0.6, varietyPreference: -0.7 } },
      { text: "瑜伽，身心合一", scores: { timePreference: 0, intensityPreference: -0.7, frequencyPattern: -0.4, varietyPreference: 0.3 } },
      { text: "都试试，选个没玩过的", scores: { timePreference: 0, intensityPreference: 0.1, frequencyPattern: 0.4, varietyPreference: 0.9 } },
      { text: "篮球，团队竞技才有意思", scores: { timePreference: 0.2, intensityPreference: 0.6, frequencyPattern: 0.1, varietyPreference: -0.2 } },
    ],
  },
  {
    id: 5,
    question: "一周运动的最佳节奏？",
    options: [
      { text: "每天固定时间练", scores: { timePreference: -0.2, intensityPreference: 0.1, frequencyPattern: -0.9, varietyPreference: -0.5 } },
      { text: "周末疯狂，平时休息", scores: { timePreference: 0.3, intensityPreference: 0.5, frequencyPattern: 0.8, varietyPreference: 0.1 } },
      { text: "想练就练，没有计划", scores: { timePreference: 0, intensityPreference: 0, frequencyPattern: 0.7, varietyPreference: 0.5 } },
      { text: "按课表来，一周 3-4 次", scores: { timePreference: 0, intensityPreference: 0.3, frequencyPattern: -0.5, varietyPreference: 0 } },
    ],
  },
  {
    id: 6,
    question: "运动时你在想什么？",
    options: [
      { text: "配速、心率、目标数据", scores: { timePreference: 0, intensityPreference: 0.6, frequencyPattern: -0.7, varietyPreference: -0.6 } },
      { text: "放空自己，享受当下", scores: { timePreference: 0, intensityPreference: -0.5, frequencyPattern: 0, varietyPreference: 0.4 } },
      { text: "今天要试试新动作", scores: { timePreference: 0, intensityPreference: 0.2, frequencyPattern: 0.3, varietyPreference: 0.8 } },
      { text: "再坚持一下，不能断链", scores: { timePreference: 0, intensityPreference: 0.4, frequencyPattern: -0.8, varietyPreference: -0.3 } },
    ],
  },
];

export function calculateQuizResult(
  answers: number[]
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

  const n = answers.length;
  result.timePreference /= n;
  result.intensityPreference /= n;
  result.frequencyPattern /= n;
  result.varietyPreference /= n;

  return result;
}
