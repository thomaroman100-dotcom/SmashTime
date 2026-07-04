"use client";

import { useMemo, useState } from "react";
import type { Champion } from "@/data/champions";
import { weightFilters } from "@/data/champions";
import { ChampionCard } from "@/components/sections/ChampionCard";

type ChampionGridProps = {
  champions: Champion[];
};

export function ChampionGrid({ champions }: ChampionGridProps) {
  const [active, setActive] = useState("Alle");
  const filteredChampions = useMemo(() => {
    if (active === "Alle") {
      return champions;
    }

    return champions.filter((champion) => champion.weightClass === active);
  }, [active, champions]);

  return (
    <section className="champion-grid" id="gewichtsklassen" aria-labelledby="champion-filter-title">
      <h2 id="champion-filter-title">Gewichtsklassen</h2>
      <div className="champion-grid__filters" role="list" aria-label="Gewichtsklassen filtern">
        {weightFilters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={active === filter ? "is-active" : ""}
            onClick={() => setActive(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="champion-grid__cards">
        {filteredChampions.map((champion) => (
          <ChampionCard key={champion.slug} champion={champion} />
        ))}
      </div>
    </section>
  );
}
