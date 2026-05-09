interface StreakBlockProps { streakDays: number; }

export default function StreakBlock({ streakDays }: StreakBlockProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-3xl font-extrabold">
            {streakDays}<span className="text-sm font-normal text-gray-400 ml-1">天连续</span> 🔥
          </div>
          <div className={`text-xs mt-1 ${streakDays > 0 ? "text-accent-orange" : "text-gray-400"}`}>
            {streakDays > 0 ? "今天不运动就会断链！" : "今天开始新的连续记录"}
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${i < Math.min(streakDays, 7) ? "bg-accent-green" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
