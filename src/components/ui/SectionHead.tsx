import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionHeadProps = {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHead({
  title,
  description,
  ctaLabel,
  ctaHref,
  align = "left",
  className
}: SectionHeadProps) {
  return (
    <div className={cn("section-head", align === "center" && "section-head--center", className)}>
      <div>
        <h2>{title}</h2>
        {description ? <p className="section-head__description">{description}</p> : null}
      </div>
      {ctaLabel && ctaHref ? (
        <Link href={ctaHref} className="section-head__cta">
          {ctaLabel} <ArrowRight aria-hidden="true" size={15} strokeWidth={2.6} />
        </Link>
      ) : null}
    </div>
  );
}
