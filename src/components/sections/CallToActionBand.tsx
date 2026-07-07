import { site } from "@/data/site";
import { CTAButton } from "@/components/ui/CTAButton";

type CallToActionBandProps = {
  title?: string;
  text?: string;
  button?: string;
  href?: string;
};

export function CallToActionBand({
  title = "Sei dabei. Erlebe Geschichte.",
  text = "Alle Ticketpakete, Einlassinfos und Hinweise zum nächsten Kampfabend findest du auf der Ticketseite.",
  button = "Ticketinfos ansehen",
  href = site.headerCta.href
}: CallToActionBandProps) {
  return (
    <section className="ticket-cta-band cta-band" aria-label={title}>
      <div className="container ticket-cta-band__inner cta-band__inner">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <CTAButton href={href} variant="premium">
          {button}
        </CTAButton>
      </div>
    </section>
  );
}
