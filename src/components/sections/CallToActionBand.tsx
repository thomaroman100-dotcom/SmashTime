import { site } from "@/data/site";
import { CTAButton } from "@/components/ui/CTAButton";

type CallToActionBandProps = {
  title?: string;
  text?: string;
  button?: string;
  href?: string;
};

export function CallToActionBand({
  title = "Bereit für SmashTime?",
  text = "Sieh dir die nächste Veranstaltung an und bleib nah am Kampfabend.",
  button = "Nächste Veranstaltung ansehen",
  href = site.headerCta.href
}: CallToActionBandProps) {
  return (
    <section className="cta-band card-grunge card-grunge--cta" aria-label={title}>
      <div className="cta-band__inner">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <CTAButton href={href} variant="outline">
          {button}
        </CTAButton>
      </div>
    </section>
  );
}
