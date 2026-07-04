import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorPackageCard } from "@/components/sections/SponsorPackageCard";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { IconBadge } from "@/components/ui/IconBadge";
import { CTAButton } from "@/components/ui/CTAButton";
import { pageHeroes } from "@/data/heroes";
import { sponsorBenefits, sponsorPackages } from "@/data/sponsors";

export const metadata = {
  title: "Sponsoren | SmashTime"
};

export default function SponsorsPage() {
  return (
    <>
      <PageHero
        title="Sponsoren."
        redTitle="Starke Marken."
        text="Gemeinsam für echten Kampfsport. Werde Teil von SmashTime und präsentiere deine Marke in einem starken Umfeld."
        image={pageHeroes.sponsors.image}
        imagePosition={pageHeroes.sponsors.position}
        compact
      >
        <CTAButton href="/kontakt" variant="outline">
          Kontakt aufnehmen
        </CTAButton>
      </PageHero>

      <SponsorStrip />

      <section className="sponsors-page">
        <div className="container">
          <SectionTitle>Warum Sponsor werden?</SectionTitle>
          <div className="benefit-grid">
            {sponsorBenefits.map((benefit) => (
              <article key={benefit.title}>
                <IconBadge name={benefit.icon} size="lg" />
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
              </article>
            ))}
          </div>

          <SectionTitle>Unsere Sponsorenpakete</SectionTitle>
          <div className="package-grid">
            {sponsorPackages.map((item) => (
              <SponsorPackageCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>
      <CallToActionBand
        title="Werde Teil der SmashTime-Familie!"
        text="Unterstütze den Kampfsport. Stärke deine Marke. Erlebe echte Action."
        button="Sponsor werden"
        href="/kontakt"
      />
    </>
  );
}
