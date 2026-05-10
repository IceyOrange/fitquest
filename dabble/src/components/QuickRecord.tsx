import Link from "next/link";

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 -mr-0.5"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export default function QuickRecord() {
  return (
    <Link href="/record" className="block">
      <button
        type="button"
        className="btn-primary tap-shrink flex items-center justify-center gap-2"
      >
        <span>记录今日运动</span>
        <ArrowRightIcon />
      </button>
    </Link>
  );
}
