import { cn } from "@/lib/utils";

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
    <div className={cn("section-title", align === "left" && "section-title--left", className)}>
      {kicker ? <p className="section-title__kicker">{kicker}</p> : null}
      <h2>{children}</h2>
    </div>
  );
}
