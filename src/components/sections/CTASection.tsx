import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CTASectionProps = {
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export function CTASection({ title, text, ctaLabel, ctaHref }: CTASectionProps) {
  return (
    <section className="ticket-cta-band" aria-label={title}>
      <div className="container ticket-cta-band__inner">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Link href={ctaHref} className="btn btn--premium">
          <span>{ctaLabel}</span>
          <ArrowRight aria-hidden="true" size={17} strokeWidth={2.6} />
        </Link>
      </div>
    </section>
  );
}
