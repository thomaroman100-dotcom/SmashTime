import { notFound } from "next/navigation";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { ChampionProfile } from "@/components/sections/ChampionProfile";
import { PageHero } from "@/components/sections/PageHero";
import { champions, getChampion } from "@/data/champions";
import { pageHeroes } from "@/data/heroes";

type ChampionPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return champions.map((champion) => ({ slug: champion.slug }));
}

export async function generateMetadata({ params }: ChampionPageProps) {
  const { slug } = await params;
  const champion = getChampion(slug);

  return {
    title: champion ? `${champion.name} | SmashTime Champion` : "Champion | SmashTime"
  };
}

export default async function ChampionPage({ params }: ChampionPageProps) {
  const { slug } = await params;
  const champion = getChampion(slug);

  if (!champion) {
    notFound();
  }

  return (
    <>
      <PageHero
        title="Champion"
        redTitle="Profil"
        text="Jeder Champion hat seine Geschichte. Hier stehen die bestätigten Daten."
        preset={pageHeroes.championProfile}
        compact
      />
      <div className="container">
        <ChampionProfile champion={champion} />
      </div>
      <CallToActionBand />
    </>
  );
}
