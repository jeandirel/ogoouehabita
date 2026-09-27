import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  "aria-hidden"?: boolean;
}

// Thin wrapper around Google's "Material Symbols Outlined" ligature font,
// which is the exact icon set used across every Stitch reference screen.
// Swapping this for Lucide would change every glyph's shape, so it stays.
export function Icon({ name, className, filled, ...props }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", filled && "fill", className)}
      aria-hidden={props["aria-hidden"] ?? true}
    >
      {name}
    </span>
  );
}
