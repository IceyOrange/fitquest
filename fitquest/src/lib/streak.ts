function toLocalDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function calculateStreak(workoutDates: Date[]): number {
  if (workoutDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDays = new Set<string>();
  for (const d of workoutDates) {
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    uniqueDays.add(toLocalDateStr(day));
  }

  const sortedDays = Array.from(uniqueDays).sort().reverse();

  const firstDay = parseLocalDate(sortedDays[0]);
  firstDay.setHours(0, 0, 0, 0);
  const diffFromToday = Math.floor(
    (today.getTime() - firstDay.getTime()) / 86400000
  );

  if (diffFromToday > 1) return 0;

  let streak = 1;
  let prevDay = firstDay;

  for (let i = 1; i < sortedDays.length; i++) {
    const currentDay = parseLocalDate(sortedDays[i]);
    currentDay.setHours(0, 0, 0, 0);
    const diff = Math.floor(
      (prevDay.getTime() - currentDay.getTime()) / 86400000
    );

    if (diff === 1) {
      streak++;
      prevDay = currentDay;
    } else {
      break;
    }
  }

  return streak;
}
