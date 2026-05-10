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
  return workoutDates.filter((d) => getISOWeekKey(d) === thisWeek).length;
}
