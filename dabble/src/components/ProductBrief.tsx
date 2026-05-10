/**
 * Desktop-only product brief shown in the left margin during showcase.
 * Hidden under lg breakpoint so the mobile-first product is unaffected.
 */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[11px] uppercase"
      style={{
        color: "var(--color-ink-tertiary)",
        letterSpacing: "0.18em",
      }}
    >
      {children}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="mt-9 pt-7"
      style={{ borderTop: "1px solid var(--color-line-soft)" }}
    >
      <Eyebrow>{label}</Eyebrow>
      <div
        className="mt-4 text-[13.5px]"
        style={{
          color: "var(--color-ink-secondary)",
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default function ProductBrief() {
  return (
    <aside
      className="hidden lg:flex fixed inset-y-0 left-0 w-[300px] flex-col px-9 pt-16 pb-10 overflow-y-auto"
      style={{
        borderRight: "1px solid var(--color-line-soft)",
        backgroundColor: "var(--color-surface-base)",
      }}
      aria-label="产品简介"
    >
      {/* Header: project name + tagline */}
      <Eyebrow>DABBLE · 2026</Eyebrow>
      <h2
        className="font-display mt-4"
        style={{
          color: "var(--color-ink-primary)",
          fontSize: "26px",
          lineHeight: 1.3,
          letterSpacing: "0.005em",
        }}
      >
        一个让你
        <br />
        忍不住动起来的
        <br />
        <span style={{ color: "var(--color-brand-700)" }}>搭子</span>产品
      </h2>

      {/* §1 Product */}
      <Section label="产 品">
        为大学生设计。
        <br />
        不是健身追踪，不是数据控，
        <br />
        不是打卡积分。
        <br />
        <br />
        核心是——
        <br />
        在你最想偷懒的那一刻，
        <br />
        <span style={{ color: "var(--color-ink-primary)" }}>
          看见熟人正在动。
        </span>
      </Section>

      {/* §2 Design */}
      <Section label="设 计">
        干净温柔现代派。
        <br />
        暖象牙 · 墨绿 ·{" "}
        <span style={{ color: "var(--color-coral-500)" }}>珊瑚红</span>。
        <br />
        Smiley Sans · Geist ·
        <br />
        <span className="font-mono-num">数字 mono</span>。
        <br />
        <br />
        细线优先于卡片，
        <br />
        留白优先于装饰。
      </Section>

      {/* Footer mark */}
      <div
        className="mt-auto pt-12 text-[11px] font-mono-num flex items-center justify-between"
        style={{ color: "var(--color-ink-muted)" }}
      >
        <span>MVP · 2026.05</span>
        <span
          className="live-dot"
          style={{ width: "6px", height: "6px" }}
          aria-hidden="true"
        />
      </div>
    </aside>
  );
}
