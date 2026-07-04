import { sponsorLogos } from "@/data/sponsors";

export function SponsorStrip() {
  return (
    <section className="sponsor-strip" aria-labelledby="sponsor-strip-title">
      <h2 id="sponsor-strip-title">Unsere Sponsoren</h2>
      <div className="sponsor-strip__logos">
        {sponsorLogos.map((logo) => (
          <div className="sponsor-logo" key={logo.name}>
            <strong>{logo.name}</strong>
            <span>{logo.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
