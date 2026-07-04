import { cn } from "@/lib/utils";

type BrushLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function BrushLabel({ children, className }: BrushLabelProps) {
  return <span className={cn("brush-label", className)}>{children}</span>;
}
