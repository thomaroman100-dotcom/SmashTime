export type FightCardEntry = {
  id: string;
  eventId: string;
  order: number;
  fighterA: string;
  fighterB: string;
  weightClass: string;
  discipline: string;
  label?: string;
  visible: boolean;
};

export const fightcards: FightCardEntry[] = [];
