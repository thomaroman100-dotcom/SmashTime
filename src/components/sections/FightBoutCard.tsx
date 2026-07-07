import Image from "next/image";
import { formatFightCardLabel, type FightCardEntry, type FightParticipant } from "@/data/fightcards";

type FightBoutCardProps = {
  fight: FightCardEntry;
  variant?: "default" | "compact";
};

type FightPortraitProps = {
  name: string;
  image?: string;
  corner: "red" | "blue";
};

function FightPortrait({ name, image, corner }: FightPortraitProps) {
  return (
    <div className={`fight-bout-card__fighter fight-bout-card__fighter--${corner}`}>
      {image ? (
        <Image
          src={image}
          alt={`${name} Fightcard-Portrait`}
          fill
          sizes="(max-width: 767px) 86vw, (max-width: 1180px) 28vw, 360px"
        />
      ) : (
        <span className="fight-bout-card__fallback" aria-hidden="true">
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <strong>{name}</strong>
    </div>
  );
}

export function FightBoutCard({ fight, variant = "default" }: FightBoutCardProps) {
  const redParticipant = fight.redCorner.participants[0];
  const blueParticipant = fight.blueCorner.participants[0];
  const fighterA = redParticipant?.name ?? fight.fighterA;
  const fighterB = blueParticipant?.name ?? fight.fighterB;
  const fighterAImage = redParticipant?.image ?? fight.fighterAImage;
  const fighterBImage = blueParticipant?.image ?? fight.fighterBImage;

  return (
    <article className={`fight-bout-card fight-bout-card--${variant}`}>
      <FightPortrait name={fighterA} image={fighterAImage} corner="red" />
      <div className="fight-bout-card__center">
        <span>{formatFightCardLabel(fight.label)}</span>
        <b>VS</b>
        <small>
          {fight.weightClass} · {fight.discipline}
        </small>
      </div>
      <FightPortrait name={fighterB} image={fighterBImage} corner="blue" />
    </article>
  );
}

type TeamParticipantProps = {
  participant: FightParticipant;
};

function TeamParticipant({ participant }: TeamParticipantProps) {
  return (
    <li>
      <span className="team-bout-card__avatar">
        {participant.image ? (
          <Image src={participant.image} alt="" fill sizes="46px" />
        ) : (
          participant.name.slice(0, 2).toUpperCase()
        )}
      </span>
      <strong>{participant.name}</strong>
      {participant.isTba ? <small>Wird bekanntgegeben</small> : null}
    </li>
  );
}

function normalizedTeamParticipants(participants: FightParticipant[]) {
  const slots = [1, 2];
  return slots.map((slot) => {
    const participant = participants.find((item) => item.slot === slot);
    return participant ?? {
      slot,
      name: "Wird bekanntgegeben",
      isTba: true
    };
  });
}

export function TeamBoutCard({ fight, variant = "default" }: FightBoutCardProps) {
  const redParticipants = normalizedTeamParticipants(fight.redCorner.participants);
  const blueParticipants = normalizedTeamParticipants(fight.blueCorner.participants);

  return (
    <article className={`team-bout-card team-bout-card--${variant}`}>
      <div className="team-bout-card__corner team-bout-card__corner--red">
        <span>{fight.redCorner.countryCode ?? "Team Rot"}</span>
        <h3>{fight.redCorner.label}</h3>
        <ul>
          {redParticipants.map((participant) => (
            <TeamParticipant key={`red-${participant.slot}`} participant={participant} />
          ))}
        </ul>
      </div>

      <div className="team-bout-card__center">
        <span>{formatFightCardLabel(fight.label)}</span>
        <b>2 VS 2</b>
        <small>
          {fight.weightClass} · {fight.discipline}
        </small>
      </div>

      <div className="team-bout-card__corner team-bout-card__corner--blue">
        <span>{fight.blueCorner.countryCode ?? "Team Blau"}</span>
        <h3>{fight.blueCorner.label}</h3>
        <ul>
          {blueParticipants.map((participant) => (
            <TeamParticipant key={`blue-${participant.slot}`} participant={participant} />
          ))}
        </ul>
      </div>
    </article>
  );
}
