import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { EventLibrary } from "@/components/sections/EventLibrary";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { pageHeroes } from "@/data/heroes";
import { getPublicEvents } from "@/lib/public-events";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "Veranstaltungen | SmashTime"
};

export default async function EventsPage() {
  const [events, publicSettings] = await Promise.all([getPublicEvents(), getPublicSiteSettings()]);

  return (
    <>
      <PageHero
        title="Veranstaltungen"
        redTitle="Die Welt von SmashTime"
        text="Entdecke alle veröffentlichten SmashTime-Events – von kommenden Kämpfen bis zu Nächten, die Geschichte geschrieben haben."
        preset={pageHeroes.events}
        compact
      />
      <div className="container events-page events-page--library">
        <EventLibrary events={events} ticketHref={publicSettings.site.ticketHref} />
      </div>
      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
