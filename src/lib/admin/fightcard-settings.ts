import { FIGHT_MATCHUP_TYPES, FIGHT_STATUSES } from "@/lib/admin/resource-shared";

export type FightMatchupType = (typeof FIGHT_MATCHUP_TYPES)[number];
export type FightStatus = (typeof FIGHT_STATUSES)[number];

export type FightcardVisibility = "admin" | "public";

export type FightcardSettings = {
  general: {
    defaultMatchupType: FightMatchupType;
    defaultRounds: number;
    defaultRoundDuration: string;
    defaultStatus: FightStatus;
    defaultVisibility: FightcardVisibility;
  };
  display: {
    autoNumbering: boolean;
    showNationality: boolean;
    showWeightClass: boolean;
    showTeamLogos: boolean;
    showTeamFlags: boolean;
    hideCompleted: boolean;
  };
  tournament: {
    enabled: boolean;
    maxTeamSize: number;
    publicBracket: boolean;
    liveUpdates: boolean;
  };
  system: {
    autosave: boolean;
    saveHistory: boolean;
    backupEnabled: boolean;
  };
  categories: string[];
  weightClasses: string[];
  rules: {
    format: string;
    tiebreaker: string;
  };
  points: {
    win: number;
    draw: number;
    loss: number;
    teamWin: string;
  };
  media: {
    bannerUrl: string | null;
    logoUrl: string | null;
  };
};

export type FightcardSettingsRow = {
  event_id: number;
  general: Partial<FightcardSettings["general"]> | null;
  display: Partial<FightcardSettings["display"]> | null;
  tournament: Partial<FightcardSettings["tournament"]> | null;
  system: Partial<FightcardSettings["system"]> | null;
  categories: string[] | null;
  weight_classes: string[] | null;
  rules: Partial<FightcardSettings["rules"]> | null;
  points: Partial<FightcardSettings["points"]> | null;
  media: Partial<FightcardSettings["media"]> | null;
};

export const DEFAULT_FIGHTCARD_SETTINGS: FightcardSettings = {
  general: {
    defaultMatchupType: "single",
    defaultRounds: 3,
    defaultRoundDuration: "3 Minuten",
    defaultStatus: "planned",
    defaultVisibility: "admin"
  },
  display: {
    autoNumbering: true,
    showNationality: true,
    showWeightClass: true,
    showTeamLogos: true,
    showTeamFlags: true,
    hideCompleted: false
  },
  tournament: {
    enabled: true,
    maxTeamSize: 4,
    publicBracket: true,
    liveUpdates: true
  },
  system: {
    autosave: true,
    saveHistory: true,
    backupEnabled: true
  },
  categories: ["Hauptkampf", "Co-Main Event", "Main Card", "Preliminary"],
  weightClasses: ["Offen", "-66 kg", "-70 kg", "-72 kg", "-77 kg", "-80 kg", "-84 kg"],
  rules: {
    format: "Best of 3",
    tiebreaker: "Entscheidung durch Kampfgericht"
  },
  points: {
    win: 3,
    draw: 1,
    loss: 0,
    teamWin: "2 von 3 Kämpfen"
  },
  media: {
    bannerUrl: null,
    logoUrl: "/images/logo/smashtime-logo.png"
  }
};

export function mergeFightcardSettings(row?: Partial<FightcardSettingsRow> | null): FightcardSettings {
  if (!row) {
    return DEFAULT_FIGHTCARD_SETTINGS;
  }

  return {
    general: { ...DEFAULT_FIGHTCARD_SETTINGS.general, ...(row.general ?? {}) },
    display: { ...DEFAULT_FIGHTCARD_SETTINGS.display, ...(row.display ?? {}) },
    tournament: { ...DEFAULT_FIGHTCARD_SETTINGS.tournament, ...(row.tournament ?? {}) },
    system: { ...DEFAULT_FIGHTCARD_SETTINGS.system, ...(row.system ?? {}) },
    categories: Array.isArray(row.categories) && row.categories.length > 0
      ? row.categories
      : DEFAULT_FIGHTCARD_SETTINGS.categories,
    weightClasses: Array.isArray(row.weight_classes) && row.weight_classes.length > 0
      ? row.weight_classes
      : DEFAULT_FIGHTCARD_SETTINGS.weightClasses,
    rules: { ...DEFAULT_FIGHTCARD_SETTINGS.rules, ...(row.rules ?? {}) },
    points: { ...DEFAULT_FIGHTCARD_SETTINGS.points, ...(row.points ?? {}) },
    media: { ...DEFAULT_FIGHTCARD_SETTINGS.media, ...(row.media ?? {}) }
  };
}
