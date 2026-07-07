import { cn } from "@/lib/utils";
import { SectionHead } from "@/components/ui/SectionHead";

type SectionTitleProps = {
  children: React.ReactNode;
  align?: "left" | "center";
  kicker?: string;
  className?: string;
};

export function SectionTitle({
  children,
  align = "center",
  kicker,
  className
}: SectionTitleProps) {
  return (
    <SectionHead
      title={String(children)}
      description={kicker}
      align={align}
      className={cn("section-title", align === "left" && "section-title--left", className)}
    />
  );
}
