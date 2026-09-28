import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function PhotoPendingBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-surface/90 backdrop-blur-md text-on-surface-variant px-3 py-1 rounded-full text-label-sm font-bold shadow-md flex items-center gap-1",
        className,
      )}
    >
      <Icon name="photo_camera" className="text-[14px]" />
      Photos à venir
    </span>
  );
}
