import type { ReactNode } from "react";

type StatePanelProps = {
  action?: ReactNode;
  description: string;
  icon?: ReactNode;
  title: string;
  titleLevel?: 1 | 2;
  tone?: "danger" | "neutral" | "warning";
};

const toneClasses = {
  danger: "border-danger/25 bg-danger-soft",
  neutral: "border-line bg-surface",
  warning: "border-warning/25 bg-warning-soft",
};

export function StatePanel({
  action,
  description,
  icon,
  title,
  titleLevel = 2,
  tone = "neutral",
}: StatePanelProps) {
  const titleClasses = "mt-5 text-2xl font-bold text-ink sm:text-3xl";

  return (
    <section
      className={`mx-auto w-full max-w-2xl rounded-lg border p-7 text-center sm:p-10 ${toneClasses[tone]}`}
    >
      {icon ? (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-accent">
          {icon}
        </div>
      ) : null}
      {titleLevel === 1 ? (
        <h1 className={titleClasses}>{title}</h1>
      ) : (
        <h2 className={titleClasses}>{title}</h2>
      )}
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted sm:text-base sm:leading-7">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
