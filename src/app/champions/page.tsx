import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { ChampionGrid } from "@/components/sections/ChampionGrid";
import { PageHero } from "@/components/sections/PageHero";
import { champions } from "@/data/champions";
import { pageHeroes } from "@/data/heroes";

export const metadata = {
  title: "Champions | SmashTime"
};

export default function ChampionsPage() {
  return (
    <>
      <PageHero
        title="Champions."
        redTitle="Unsere Titelträger."
        text="Hier stehen sie: die bestätigten Titelträger von SmashTime. Vier echte Champions, keine Beispielnamen, keine fremden Fighter."
        preset={pageHeroes.champions}
        compact
      />
      <div className="container">
        <ChampionGrid champions={champions} />
      </div>
      <CallToActionBand />
    </>
  );
}
