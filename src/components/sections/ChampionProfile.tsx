import Image from "next/image";
import { Crown } from "lucide-react";
import type { Champion } from "@/data/champions";
import { formatRecord } from "@/lib/utils";

type ChampionProfileProps = {
  champion: Champion;
};

export function ChampionProfile({ champion }: ChampionProfileProps) {
  return (
    <article className="champion-profile">
      <div className="champion-profile__top">
        <div className="champion-profile__portrait">
          <Image
            src={champion.image}
            alt={champion.name}
            fill
            sizes="(max-width: 768px) 90vw, 36vw"
            priority
          />
        </div>
        <div className="champion-profile__facts">
          <span className="champion-profile__badge">
            <Crown aria-hidden="true" size={19} /> Champion
          </span>
          <h2>{champion.name}</h2>
          <p className="champion-profile__stance">{champion.stance}</p>
          <dl>
            <div>
              <dt>Gewichtsklasse</dt>
              <dd>{champion.weightClass}</dd>
            </div>
            <div>
              <dt>Rekord</dt>
              <dd>{formatRecord(champion.record)}</dd>
            </div>
            <div>
              <dt>Alter</dt>
              <dd>{champion.age}</dd>
            </div>
            <div>
              <dt>Gewicht</dt>
              <dd>{champion.weight}</dd>
            </div>
            <div>
              <dt>Kampfstil</dt>
              <dd>Wird nachgetragen</dd>
            </div>
          </dl>
        </div>
        <div className="champion-profile__bio">
          <h3>Über den Kämpfer</h3>
          <p>{champion.bio}</p>
          <blockquote>„{champion.quote}“</blockquote>
        </div>
      </div>

      <div className="champion-profile__stats">
        {champion.stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="champion-profile__grid">
        <section className="title-panel">
          <div className="title-panel__belt" aria-hidden="true">
            <span>SmashTime</span>
          </div>
          <div>
            <h3>Titel</h3>
            <p>{champion.title}</p>
          </div>
        </section>
        <section className="next-fight-panel">
          <h3>Nächster Kampf</h3>
          <p>Der nächste Kampf wird offiziell bekanntgegeben.</p>
        </section>
      </div>

      <section className="last-fights">
        <h3>Letzte Kämpfe</h3>
        {champion.lastFights.length === 0 ? (
          <p>Letzte Kämpfe werden nachgetragen, sobald bestätigte Daten vorliegen.</p>
        ) : (
          <ul>
            {champion.lastFights.map((fight) => (
              <li key={`${fight.date}-${fight.opponent}`}>
                <strong>{fight.result}</strong>
                <span>{fight.method}</span>
                <span>{fight.opponent}</span>
                <small>
                  {fight.date} · {fight.event}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
