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
  text = "Sichere dir jetzt deine Tickets und sei dabei, wenn es knallt.",
  button = "Tickets sichern",
  href = site.ticketHref
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
