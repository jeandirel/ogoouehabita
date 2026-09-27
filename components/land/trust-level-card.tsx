import { cn } from "@/lib/utils";
import type { TRUST_LEVELS } from "@/data/land";

type TrustLevel = (typeof TRUST_LEVELS)[number];

export function TrustLevelCard({ level }: { level: TrustLevel }) {
  return (
    <div
      className={cn(
        "bg-surface p-5 rounded-xl shadow-sm flex flex-col justify-between gap-4",
        "highlighted" in level && level.highlighted && "border-2 border-primary",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "w-8 h-8 rounded-full font-bold flex items-center justify-center text-label-md",
            level.badgeClass,
          )}
        >
          {level.level}
        </span>
        <span className={cn("text-label-sm font-bold", level.tagClass)}>{level.tag}</span>
      </div>
      <div>
        <div className="font-headline-sm text-on-surface mb-1">{level.title}</div>
        <p className="text-body-sm text-on-surface-variant">{level.description}</p>
      </div>
    </div>
  );
}
