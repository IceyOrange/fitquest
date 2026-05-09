import WorkoutForm from "@/components/WorkoutForm";

export default function RecordPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-lg font-bold">记录运动</h1>
      </div>
      <WorkoutForm />
    </div>
  );
}
