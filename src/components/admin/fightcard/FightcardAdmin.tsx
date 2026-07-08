"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useMemo, useRef, useState, useTransition } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Code2,
  Copy,
  Download,
  Eye,
  FileText,
  Filter,
  Flag,
  ImageIcon,
  ListChecks,
  Loader2,
  Monitor,
  MoreVertical,
  Pencil,
  Plus,
  Printer,
  Save,
  Scale,
  Search,
  Settings,
  Shield,
  Star,
  Swords,
  Trash2,
  Trophy,
  Upload,
  X
} from "lucide-react";
import { useAdminUi } from "@/components/admin/ui/AdminUiProvider";
import { FighterProfilePicker, type FighterProfileOption } from "@/components/admin/FighterProfilePicker";
import {
  type FightMatchupType,
  type FightParticipantRow,
  type FightRow,
  type FightStatus,
  createFightAction,
  deleteFightAction,
  duplicateFightAction,
  saveFightcardSettingsAction,
  setFightWinnerAction,
  updateFightAction,
  updateFightStatusAction
} from "@/lib/admin/actions/fightcards";
import type { FightcardSettings } from "@/lib/admin/fightcard-settings";
import {
  EVENT_DISCIPLINES,
  FIGHT_MATCHUP_TYPE_LABELS,
  FIGHT_STATUSES,
  FIGHT_STATUS_LABELS
} from "@/lib/admin/resource-shared";

type EventOption = {
  id: number;
  slug: string;
  name: string;
  dateLabel: string;
  location: string;
};

type FightcardTab = "overview" | "list" | "tournament" | "add" | "settings";
type ActionResult = { ok: true; message: string } | { ok: false; error: string };
type CountryOption = { code: string; short: string; name: string; className: string };

type FightcardBoardProps = {
  events: EventOption[];
  activeEventId: number;
  fights: FightRow[];
  fighterOptions: FighterProfileOption[];
  settings: FightcardSettings;
  initialTab?: FightcardTab;
  editFightId?: string | null;
};

const tabs: Array<{ id: FightcardTab; label: string }> = [
  { id: "overview", label: "Übersicht" },
  { id: "list", label: "Kampf Liste" },
  { id: "tournament", label: "Turnier Baum" },
  { id: "add", label: "Kampf hinzufügen" },
  { id: "settings", label: "Einstellungen" }
];

const countries: CountryOption[] = [
  { code: "DEU", short: "DE", name: "Deutschland", className: "de" },
  { code: "FRA", short: "FR", name: "Frankreich", className: "fr" },
  { code: "USA", short: "US", name: "USA", className: "us" },
  { code: "JPN", short: "JP", name: "Japan", className: "jp" },
  { code: "BRA", short: "BR", name: "Brasilien", className: "br" },
  { code: "POL", short: "PL", name: "Polen", className: "pl" },
  { code: "ESP", short: "ES", name: "Spanien", className: "es" },
  { code: "ITA", short: "IT", name: "Italien", className: "it" },
  { code: "AUT", short: "AT", name: "Österreich", className: "at" },
  { code: "GBR", short: "GB", name: "Großbritannien", className: "gb" }
];

const emptyParticipant = "Wird bekanntgegeben";

function isTeamFight(matchupType: string) {
  return matchupType.startsWith("team_");
}

function teamSizeForMatchup(matchupType: string) {
  if (!isTeamFight(matchupType)) {
    return 1;
  }
  const parsed = Number.parseInt(matchupType.match(/team_(\d)v\d/)?.[1] ?? "1", 10);
  return [1, 2, 3, 4].includes(parsed) ? parsed : 1;
}

function countryByCode(code: string | null | undefined) {
  return countries.find((country) => country.code === code) ?? countries[0];
}

function countryByName(name: string | null | undefined) {
  const normalized = name?.toLowerCase();
  return countries.find((country) => country.name.toLowerCase() === normalized) ?? null;
}

function cornerCountry(fight: FightRow, corner: "red" | "blue") {
  const code = corner === "red" ? fight.corner_a_country_code : fight.corner_b_country_code;
  const label = corner === "red" ? fight.corner_a_label ?? fight.fighter_a : fight.corner_b_label ?? fight.fighter_b;
  return code ? countryByCode(code) : countryByName(label) ?? null;
}

function cornerLabel(fight: FightRow, corner: "red" | "blue") {
  return corner === "red"
    ? fight.corner_a_label ?? fight.fighter_a ?? emptyParticipant
    : fight.corner_b_label ?? fight.fighter_b ?? emptyParticipant;
}

function participantLabel(participant: FightParticipantRow | null | undefined, fallback?: string | null) {
  return participant?.display_name ?? fallback ?? emptyParticipant;
}

function sortedParticipants(fight: FightRow, corner: "red" | "blue"): Array<FightParticipantRow | null> {
  const teamSize = teamSizeForMatchup(fight.matchup_type);
  const participants = (fight.fight_card_participants ?? [])
    .filter((participant) => participant.corner === corner)
    .sort((a, b) => a.slot - b.slot);

  if (participants.length > 0) {
    return Array.from({ length: teamSize }, (_, index) => participants.find((participant) => participant.slot === index + 1) ?? null);
  }

  if (corner === "red") {
    return [{ corner: "red", slot: 1, display_name: fight.fighter_a, fighter_user_id: fight.fighter_a_user_id, image_path: fight.fighter_a_image_path, is_tba: fight.fighter_a_is_tba }];
  }

  return [{ corner: "blue", slot: 1, display_name: fight.fighter_b, fighter_user_id: fight.fighter_b_user_id, image_path: fight.fighter_b_image_path, is_tba: fight.fighter_b_is_tba }];
}

function fightTitle(fight: FightRow) {
  return `${cornerLabel(fight, "red")} vs ${cornerLabel(fight, "blue")}`;
}

function sectionLabel(fight: FightRow, index: number) {
  if (fight.label) {
    return fight.label;
  }
  if (fight.is_main_event || index === 0) {
    return "Hauptkampf";
  }
  if (index === 1) {
    return "Co-Main Event";
  }
  return "Main Card";
}

function matchupLabel(fight: FightRow) {
  if (isTeamFight(fight.matchup_type)) {
    const size = teamSizeForMatchup(fight.matchup_type);
    return `${size} vs ${size} Länderturnier`;
  }
  return "1 vs 1 Einzelkampf";
}

function statusClass(status: FightStatus) {
  return `adm-fc2-status--${status}`;
}

function roundsLabel(fight: FightRow) {
  return `${fight.rounds ?? 3} x ${fight.round_duration ?? "3 Minuten"}`;
}

function formatScheduledAt(value: string | null) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("de-AT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function datetimeLocalValue(value: string | null) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function nextSortOrder(fights: FightRow[]) {
  return Math.max(0, ...fights.map((fight) => fight.sort_order)) + 10;
}

function tabHref(eventId: number, tab: FightcardTab, editId?: number | null) {
  const params = new URLSearchParams({ event: String(eventId), tab });
  if (editId) {
    params.set("edit", String(editId));
  }
  return `/admin/fightcards?${params.toString()}`;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="adm-fc2-label">{children}</span>;
}

function FlagMark({ country }: { country: CountryOption | null }) {
  if (!country) {
    return <span className="adm-fc2-flag adm-fc2-flag--empty" aria-hidden="true" />;
  }
  return (
    <span className={`adm-fc2-flag adm-fc2-flag--${country.className}`} aria-hidden="true">
      <span>{country.short}</span>
    </span>
  );
}

function ToggleField({
  name,
  label,
  description,
  defaultChecked
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="adm-fc2-toggle">
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <input type="hidden" name={name} value="false" />
      <span aria-hidden="true" />
    </label>
  );
}

function CornerDisplay({ fight, corner, compact = false }: { fight: FightRow; corner: "red" | "blue"; compact?: boolean }) {
  const country = cornerCountry(fight, corner);
  const participants = sortedParticipants(fight, corner);
  const fallback = corner === "red" ? fight.fighter_a : fight.fighter_b;

  return (
    <div className={`adm-fc2-corner ${compact ? "adm-fc2-corner--compact" : ""}`}>
      <FlagMark country={country} />
      <div>
        <strong>{cornerLabel(fight, corner)}</strong>
        <small>
          {isTeamFight(fight.matchup_type)
            ? participants.map((participant) => participantLabel(participant)).join(" & ")
            : participantLabel(participants[0], fallback)}
        </small>
      </div>
    </div>
  );
}

export function FightcardBoard({
  events,
  activeEventId,
  fights,
  fighterOptions,
  settings,
  initialTab = "overview",
  editFightId
}: FightcardBoardProps) {
  const router = useRouter();
  const activeEvent = events.find((event) => event.id === activeEventId) ?? events[0];
  const editId = editFightId ? Number.parseInt(editFightId, 10) : null;
  const editFight = Number.isFinite(editId) ? fights.find((fight) => fight.id === editId) ?? null : null;
  const tab = initialTab;
  const previewHref = activeEvent?.slug ? `/veranstaltungen/${activeEvent.slug}#fightcard` : "/veranstaltungen";

  return (
    <section className="adm-fc2">
      <div className="adm-fc2-head">
        <div>
          <h1>Fightcard</h1>
          <p>Verwalte alle Kämpfe und Turniere für dein Event.</p>
        </div>
        <div className="adm-fc2-head__controls">
          <label>
            Event wählen
            <select
              value={activeEventId}
              onChange={(event) => router.push(`/admin/fightcards?event=${event.target.value}&tab=${tab}`)}
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </label>
          <Link className="adm-fc2-btn adm-fc2-btn--gold" href={previewHref}>
            <Eye aria-hidden="true" size={17} /> Vorschau anzeigen
          </Link>
        </div>
      </div>

      <nav className="adm-fc2-tabs" aria-label="Fightcard Bereiche">
        {tabs.map((item) => (
          <Link
            key={item.id}
            className={item.id === tab ? "is-active" : ""}
            href={tabHref(activeEventId, item.id)}
            aria-current={item.id === tab ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {tab === "overview" ? (
        <OverviewTab event={activeEvent} fights={fights} settings={settings} />
      ) : null}
      {tab === "list" ? (
        <ListTab eventId={activeEventId} fights={fights} />
      ) : null}
      {tab === "tournament" ? (
        <TournamentTab event={activeEvent} fights={fights} />
      ) : null}
      {tab === "add" ? (
        <FightEditor
          key={editFight?.id ?? "new"}
          event={activeEvent}
          fights={fights}
          fight={editFight}
          fighterOptions={fighterOptions}
          settings={settings}
        />
      ) : null}
      {tab === "settings" ? (
        <SettingsTab event={activeEvent} settings={settings} />
      ) : null}
    </section>
  );
}

function OverviewTab({ event, fights, settings }: { event: EventOption; fights: FightRow[]; settings: FightcardSettings }) {
  const completed = fights.filter((fight) => fight.status === "completed").length;
  const teamTypes = new Set(fights.filter((fight) => isTeamFight(fight.matchup_type)).map((fight) => fight.matchup_type));
  const visibleFights = settings.display.hideCompleted
    ? fights.filter((fight) => fight.status !== "completed")
    : fights;

  return (
    <div className="adm-fc2-overview">
      <div className="adm-fc2-overview__main">
        <div className="adm-fc2-stat-grid">
          <StatTile label="Gesamt Kämpfe" value={fights.length} help="Alle Kämpfe im Event" icon={<Swords />} tone="red" />
          <StatTile label="Abgeschlossen" value={completed} help={`${fights.length ? Math.round((completed / fights.length) * 100) : 0}% der Kämpfe`} icon={<Trophy />} tone="gold" />
          <StatTile label="Zeitplan" value={event?.dateLabel ?? "Datum offen"} help={event?.location ?? "Ort offen"} icon={<CalendarDays />} tone="gold" />
          <StatTile label="Kampf Typen" value={Math.max(1, teamTypes.size + (fights.some((fight) => fight.matchup_type === "single") ? 1 : 0))} help="1vs1, Länderturniere" icon={<Flag />} tone="red" />
        </div>

        <section className="adm-fc2-panel adm-fc2-panel--tight">
          <div className="adm-fc2-panel__head">
            <h2>Fightcard Übersicht</h2>
            <div className="adm-fc2-actions">
              <Link className="adm-fc2-btn" href={tabHref(event.id, "list")}>
                <Filter aria-hidden="true" size={16} /> Sortieren
              </Link>
              <Link className="adm-fc2-btn adm-fc2-btn--red" href={tabHref(event.id, "add")}>
                <Plus aria-hidden="true" size={16} /> Kampf hinzufügen
              </Link>
            </div>
          </div>

          {visibleFights.length === 0 ? (
            <div className="adm-fc2-empty">
              <Swords aria-hidden="true" size={28} />
              <strong>Noch keine Kämpfe angelegt</strong>
              <p>Lege den ersten Kampf an. Fehlende Teilnehmer bleiben ehrlich als Wird bekanntgegeben markiert.</p>
              <Link className="adm-fc2-btn adm-fc2-btn--red" href={tabHref(event.id, "add")}>
                <Plus aria-hidden="true" size={16} /> Kampf hinzufügen
              </Link>
            </div>
          ) : (
            <div className="adm-fc2-fight-rows">
              {visibleFights.slice(0, 5).map((fight, index) => (
                <OverviewFightRow key={fight.id} fight={fight} index={index} eventId={event.id} />
              ))}
            </div>
          )}
        </section>

        <div className="adm-fc2-info-grid">
          <InfoBlock title="Turnier Informationen" rows={[
            ["Turnier Format", settings.tournament.enabled ? "Länderturnier aktiv" : "Einzelkämpfe"],
            ["Team Größe", `${settings.tournament.maxTeamSize} Kämpfer pro Team`],
            ["Gewichtsklasse", settings.weightClasses[0] ?? "Offen"],
            ["Regeln", settings.rules.format]
          ]} />
          <InfoBlock title="Punkte System" rows={[
            ["Sieg", `${settings.points.win} Punkte`],
            ["Unentschieden", `${settings.points.draw} Punkt`],
            ["Niederlage", `${settings.points.loss} Punkte`],
            ["Team Sieg", settings.points.teamWin]
          ]} />
          <div className="adm-fc2-info-block adm-fc2-info-block--actions">
            <h3>Export & Teilen</h3>
            <Link className="adm-fc2-btn adm-fc2-btn--gold" href={tabHref(event.id, "tournament")}>
              <Download aria-hidden="true" size={16} /> Turnierbaum öffnen
            </Link>
            <Link className="adm-fc2-btn adm-fc2-btn--gold" href={`/veranstaltungen/${event.slug}#fightcard`}>
              <Eye aria-hidden="true" size={16} /> Öffentliche Ansicht
            </Link>
          </div>
        </div>
      </div>

      <QuickAddPanel eventId={event.id} nextOrder={nextSortOrder(fights)} />
    </div>
  );
}

function StatTile({ label, value, help, icon, tone }: { label: string; value: ReactNode; help: string; icon: ReactNode; tone: "red" | "gold" }) {
  return (
    <article className={`adm-fc2-stat adm-fc2-stat--${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{help}</small>
      </div>
      <span aria-hidden="true">{icon}</span>
    </article>
  );
}

function OverviewFightRow({ fight, index, eventId }: { fight: FightRow; index: number; eventId: number }) {
  return (
    <article className="adm-fc2-fight-row">
      <span className="adm-fc2-fight-row__number">{index + 1}</span>
      <div className="adm-fc2-fight-row__category">
        <strong>{sectionLabel(fight, index)}</strong>
        <small>{matchupLabel(fight)}</small>
      </div>
      <CornerDisplay fight={fight} corner="red" />
      <span className="adm-fc2-vs">VS</span>
      <CornerDisplay fight={fight} corner="blue" />
      <div className="adm-fc2-fight-row__meta">
        <small>Gewichtsklasse</small>
        <strong>{fight.weight_class ?? "Offen"}</strong>
        <span>{roundsLabel(fight)}</span>
      </div>
      <Link className="adm-fc2-icon-btn" href={tabHref(eventId, "add", fight.id)} aria-label="Kampf bearbeiten">
        <Pencil aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}

function InfoBlock({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <div className="adm-fc2-info-block">
      <h3>{title}</h3>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function QuickAddPanel({ eventId, nextOrder }: { eventId: number; nextOrder: number }) {
  const { toast } = useAdminUi();
  const [isPending, startTransition] = useTransition();
  const [matchupType, setMatchupType] = useState<FightMatchupType>("team_2v2");
  const [countryA, setCountryA] = useState("DEU");
  const [countryB, setCountryB] = useState("FRA");
  const countryLeft = countryByCode(countryA);
  const countryRight = countryByCode(countryB);
  const teamSize = teamSizeForMatchup(matchupType);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      void (async () => {
        const result = await createFightAction(null, formData);
        toast(result.ok ? "success" : "error", result.ok ? "Kampf erstellt" : "Kampf konnte nicht erstellt werden", result.ok ? result.message : result.error);
      })();
    });
  };

  return (
    <aside className="adm-fc2-side-panel">
      <h2>
        <CirclePlus aria-hidden="true" size={22} /> Kampf hinzufügen
      </h2>
      <form onSubmit={submit}>
        <input type="hidden" name="event_id" value={eventId} />
        <input type="hidden" name="sort_order" value={nextOrder} />
        <input type="hidden" name="status" value="planned" />
        <input type="hidden" name="is_visible" value="false" />
        <input type="hidden" name="corner_a_label" value={countryLeft.name} />
        <input type="hidden" name="corner_b_label" value={countryRight.name} />

        <div className="adm-fc2-form-section">
          <h3>1. Kampf Typ wählen</h3>
          <div className="adm-fc2-choice-grid adm-fc2-choice-grid--two">
            <button
              type="button"
              className={matchupType === "single" ? "is-selected" : ""}
              onClick={() => setMatchupType("single")}
            >
              <Trophy aria-hidden="true" size={24} />
              <strong>Normaler Kampf</strong>
              <span>1vs1 Einzelkampf</span>
            </button>
            <button
              type="button"
              className={isTeamFight(matchupType) ? "is-selected" : ""}
              onClick={() => setMatchupType("team_2v2")}
            >
              <Trophy aria-hidden="true" size={24} />
              <strong>Sonderturnier</strong>
              <span>Länderturnier</span>
            </button>
          </div>
        </div>

        <input type="hidden" name="matchup_type" value={matchupType} />

        {isTeamFight(matchupType) ? (
          <>
            <div className="adm-fc2-form-section">
              <h3>2. Turnier Format</h3>
              <div className="adm-fc2-mini-segments">
                {[1, 2, 3, 4].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={teamSize === size ? "is-selected" : ""}
                    onClick={() => setMatchupType(`team_${size}v${size}` as FightMatchupType)}
                  >
                    {size} vs {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="adm-fc2-form-section">
              <h3>3. Teams & Länder</h3>
              <div className="adm-fc2-two-cols">
                <label>
                  <FieldLabel>Team links</FieldLabel>
                  <select name="corner_a_country_code" value={countryA} onChange={(event) => setCountryA(event.target.value)}>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <FieldLabel>Team rechts</FieldLabel>
                  <select name="corner_b_country_code" value={countryB} onChange={(event) => setCountryB(event.target.value)}>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button className="adm-fc2-btn adm-fc2-btn--ghost" type="button" disabled>
                <Plus aria-hidden="true" size={15} /> Team hinzufügen
              </button>
            </div>
          </>
        ) : (
          <div className="adm-fc2-form-section">
            <h3>2. Einzelkampf vorbereiten</h3>
            <input type="hidden" name="corner_a_country_code" value={countryA} />
            <input type="hidden" name="corner_b_country_code" value={countryB} />
            <input type="text" name="fighter_a" placeholder="Kämpfer links optional" />
            <input type="text" name="fighter_b" placeholder="Kämpfer rechts optional" />
          </div>
        )}

        <div className="adm-fc2-form-section">
          <h3>4. Kampf Details</h3>
          <div className="adm-fc2-two-cols adm-fc2-two-cols--three">
            <label>
              <FieldLabel>Gewichtsklasse</FieldLabel>
              <input name="weight_class" placeholder="Offen" />
            </label>
            <label>
              <FieldLabel>Runden</FieldLabel>
              <select name="rounds" defaultValue="3">
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
              </select>
            </label>
            <label>
              <FieldLabel>Rundenzeit</FieldLabel>
              <select name="round_duration" defaultValue="3 Minuten">
                <option>2 Minuten</option>
                <option>3 Minuten</option>
                <option>5 Minuten</option>
              </select>
            </label>
          </div>
          <input name="label" placeholder="z.B. Hauptkampf, Titelkampf, etc." />
        </div>

        <button className="adm-fc2-submit" type="submit" disabled={isPending}>
          {isPending ? <Loader2 aria-hidden="true" size={18} /> : null}
          Kampf erstellen
        </button>
      </form>
    </aside>
  );
}

function ListTab({ eventId, fights }: { eventId: number; fights: FightRow[] }) {
  const { toast, confirm } = useAdminUi();
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return fights.filter((fight, index) => {
      const categoryMatch = category === "all" || sectionLabel(fight, index) === category;
      const typeMatch = type === "all" || (type === "team" ? isTeamFight(fight.matchup_type) : fight.matchup_type === "single");
      const searchValue = `${fightTitle(fight)} ${fight.weight_class ?? ""} ${sectionLabel(fight, index)}`.toLowerCase();
      const searchMatch = !normalizedQuery || searchValue.includes(normalizedQuery);
      return categoryMatch && typeMatch && searchMatch;
    });
  }, [category, fights, normalizedQuery, type]);

  const run = (promise: Promise<ActionResult>, successTitle: string, errorTitle: string) => {
    startTransition(() => {
      void (async () => {
        const result = await promise;
        toast(result.ok ? "success" : "error", result.ok ? successTitle : errorTitle, result.ok ? result.message : result.error);
      })();
    });
  };

  const removeFight = async (fight: FightRow) => {
    const approved = await confirm({
      title: "Kampf löschen?",
      message: "Der Kampf wird aus der Fightcard entfernt.",
      itemLabel: fightTitle(fight),
      itemMeta: matchupLabel(fight)
    });
    if (approved) {
      run(deleteFightAction(fight.id), "Kampf gelöscht", "Kampf konnte nicht gelöscht werden");
    }
  };

  return (
    <section className="adm-fc2-panel adm-fc2-list">
      <div className="adm-fc2-list__head">
        <h2>
          Kampf Liste <span>{fights.length} Kämpfe insgesamt</span>
        </h2>
        <div className="adm-fc2-list__filters">
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">Alle Kategorien</option>
            <option>Hauptkampf</option>
            <option>Co-Main Event</option>
            <option>Main Card</option>
            <option>Preliminary</option>
          </select>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="all">Alle Kampftypen</option>
            <option value="single">Einzelkampf</option>
            <option value="team">Länderturnier</option>
          </select>
          <label className="adm-fc2-search">
            <Search aria-hidden="true" size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Suche..." />
          </label>
          <Link className="adm-fc2-btn adm-fc2-btn--red" href={tabHref(eventId, "add")}>
            <Plus aria-hidden="true" size={17} /> Kampf hinzufügen
          </Link>
        </div>
      </div>

      <div className="adm-fc2-table" aria-busy={isPending}>
        <div className="adm-fc2-table__head">
          <span>#</span>
          <span>Kategorie</span>
          <span>Typ</span>
          <span>Kämpfer / Teams</span>
          <span>Gewichtsklasse</span>
          <span>Runden</span>
          <span>Status</span>
          <span>Aktionen</span>
        </div>
        {filtered.slice(0, visibleCount).map((fight, index) => (
          <article className="adm-fc2-table-row" key={fight.id}>
            <span>{index + 1}</span>
            <strong className={`adm-fc2-badge ${index === 0 ? "adm-fc2-badge--red" : index === 1 ? "adm-fc2-badge--gold" : ""}`}>
              {sectionLabel(fight, index)}
            </strong>
            <span>{matchupLabel(fight)}</span>
            <div className="adm-fc2-versus-cell">
              <CornerDisplay fight={fight} corner="red" compact />
              <span className="adm-fc2-vs">VS</span>
              <CornerDisplay fight={fight} corner="blue" compact />
            </div>
            <span>{fight.weight_class ?? "Offen"}</span>
            <span>{roundsLabel(fight)}</span>
            <select
              className={`adm-fc2-status-select ${statusClass(fight.status)}`}
              value={fight.status}
              onChange={(event) => run(updateFightStatusAction(fight.id, event.target.value as FightStatus), "Status gespeichert", "Status konnte nicht gespeichert werden")}
            >
              {FIGHT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {FIGHT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <div className="adm-fc2-row-actions">
              <Link className="adm-fc2-icon-btn" href={tabHref(eventId, "add", fight.id)} aria-label="Kampf bearbeiten">
                <Pencil aria-hidden="true" size={16} />
              </Link>
              <button className="adm-fc2-icon-btn" type="button" onClick={() => run(duplicateFightAction(fight.id), "Kampf dupliziert", "Kampf konnte nicht dupliziert werden")} aria-label="Kampf duplizieren">
                <Copy aria-hidden="true" size={16} />
              </button>
              <button className="adm-fc2-icon-btn" type="button" onClick={() => void removeFight(fight)} aria-label="Kampf löschen">
                <Trash2 aria-hidden="true" size={16} />
              </button>
              <button className="adm-fc2-icon-btn" type="button" aria-label="Weitere Aktionen">
                <MoreVertical aria-hidden="true" size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {filtered.length > visibleCount ? (
        <button className="adm-fc2-load-more" type="button" onClick={() => setVisibleCount((current) => current + 8)}>
          Weitere {filtered.length - visibleCount} Kämpfe anzeigen <ChevronDown aria-hidden="true" size={17} />
        </button>
      ) : null}
    </section>
  );
}

function TournamentTab({ event, fights }: { event: EventOption; fights: FightRow[] }) {
  const { toast } = useAdminUi();
  const [isPending, startTransition] = useTransition();
  const bracketRef = useRef<HTMLDivElement | null>(null);
  const teamFights = fights.filter((fight) => isTeamFight(fight.matchup_type));
  const quarter = teamFights.slice(0, 4);
  const semiOne = winnerLabel(quarter[0], "Gewinner VF 1");
  const semiTwo = winnerLabel(quarter[1], "Gewinner VF 2");
  const semiThree = winnerLabel(quarter[2], "Gewinner VF 3");
  const semiFour = winnerLabel(quarter[3], "Gewinner VF 4");

  const run = (promise: Promise<ActionResult>) => {
    startTransition(() => {
      void (async () => {
        const result = await promise;
        toast(result.ok ? "success" : "error", result.ok ? "Turnierbaum aktualisiert" : "Turnierbaum konnte nicht aktualisiert werden", result.ok ? result.message : result.error);
      })();
    });
  };

  const exportPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast("error", "PNG-Export fehlgeschlagen", "Canvas konnte nicht initialisiert werden.");
      return;
    }
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#D71920";
    ctx.font = "700 48px Arial";
    ctx.fillText("FIGHTCARD TURNIER BAUM", 80, 90);
    ctx.fillStyle = "#C9A24A";
    ctx.font = "700 28px Arial";
    ctx.fillText(event.name, 80, 140);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "600 26px Arial";
    teamFights.slice(0, 8).forEach((fight, index) => {
      const y = 220 + index * 70;
      ctx.strokeStyle = "#3a3a3a";
      ctx.strokeRect(80, y - 34, 680, 52);
      ctx.fillText(`${index + 1}. ${fightTitle(fight)}`, 104, y);
    });
    canvas.toBlob((blob) => {
      if (!blob) {
        toast("error", "PNG-Export fehlgeschlagen", "Das Bild konnte nicht erzeugt werden.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "fightcard-turnierbaum.png";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("success", "PNG-Export gestartet", "Der Turnierbaum wurde als PNG-Download vorbereitet.");
    }, "image/png");
  };

  return (
    <section className="adm-fc2-panel adm-fc2-tournament" ref={bracketRef} aria-busy={isPending}>
      <div className="adm-fc2-panel__head">
        <div>
          <h2>Turnier Baum</h2>
          <p>{teamFights[0] ? matchupLabel(teamFights[0]) : "Noch kein Länderturnier angelegt"}</p>
        </div>
        <div className="adm-fc2-actions">
          <button className="adm-fc2-btn" type="button" onClick={() => window.print()}>
            <Printer aria-hidden="true" size={17} /> Drucken
          </button>
          <button className="adm-fc2-btn" type="button" onClick={exportPng}>
            <Download aria-hidden="true" size={17} /> Exportieren
          </button>
        </div>
      </div>

      {teamFights.length === 0 ? (
        <div className="adm-fc2-empty">
          <Trophy aria-hidden="true" size={30} />
          <strong>Noch kein Länderturnier vorhanden</strong>
          <p>Lege im Tab Kampf hinzufügen ein Länderturnier an. Der Baum wird automatisch aus den Team-Fights erzeugt.</p>
          <Link className="adm-fc2-btn adm-fc2-btn--red" href={tabHref(event.id, "add")}>
            <Plus aria-hidden="true" size={16} /> Länderturnier anlegen
          </Link>
        </div>
      ) : (
        <div className="adm-fc2-bracket">
          <div className="adm-fc2-bracket__col">
            <h3>Viertelfinale</h3>
            {quarter.map((fight, index) => (
              <BracketMatch key={fight.id} fight={fight} seed={index + 1} onWinner={(corner) => run(setFightWinnerAction(fight.id, corner))} />
            ))}
          </div>
          <div className="adm-fc2-bracket__col adm-fc2-bracket__col--mid">
            <h3>Halbfinale</h3>
            <PlaceholderMatch labelA={semiOne} labelB={semiTwo} time="24. Aug · 18:00" />
            <PlaceholderMatch labelA={semiThree} labelB={semiFour} time="24. Aug · 18:00" />
          </div>
          <div className="adm-fc2-bracket__col adm-fc2-bracket__col--final">
            <h3>Finale</h3>
            <PlaceholderMatch labelA="Gewinner HF 1" labelB="Gewinner HF 2" time="24. Aug · 20:00" />
            <div className="adm-fc2-winner-card">
              <Trophy aria-hidden="true" size={46} />
              <strong>TBD</strong>
              <span>Turnier Sieger</span>
            </div>
          </div>
        </div>
      )}

      <div className="adm-fc2-legend">
        <span><i className="adm-fc2-dot adm-fc2-dot--planned" /> Geplant</span>
        <span><i className="adm-fc2-dot adm-fc2-dot--confirmed" /> In Kürze</span>
        <span><i className="adm-fc2-dot adm-fc2-dot--cancelled" /> Live</span>
        <span><i className="adm-fc2-dot adm-fc2-dot--completed" /> Abgeschlossen</span>
      </div>
    </section>
  );
}

function winnerLabel(fight: FightRow | undefined, fallback: string) {
  if (!fight?.winner_corner) {
    return fallback;
  }
  return cornerLabel(fight, fight.winner_corner);
}

function BracketMatch({ fight, seed, onWinner }: { fight: FightRow; seed: number; onWinner: (corner: "red" | "blue" | null) => void }) {
  return (
    <article className={`adm-fc2-bracket-match ${statusClass(fight.status)}`}>
      <span className="adm-fc2-bracket-match__seed">{seed}</span>
      <button type="button" className={fight.winner_corner === "red" ? "is-winner" : ""} onClick={() => onWinner("red")}>
        <FlagMark country={cornerCountry(fight, "red")} /> {cornerLabel(fight, "red")}
      </button>
      <button type="button" className={fight.winner_corner === "blue" ? "is-winner" : ""} onClick={() => onWinner("blue")}>
        <FlagMark country={cornerCountry(fight, "blue")} /> {cornerLabel(fight, "blue")}
      </button>
      {fight.winner_corner ? (
        <button className="adm-fc2-reset-winner" type="button" onClick={() => onWinner(null)}>
          <X aria-hidden="true" size={14} />
        </button>
      ) : null}
    </article>
  );
}

function PlaceholderMatch({ labelA, labelB, time }: { labelA: string; labelB: string; time: string }) {
  return (
    <article className="adm-fc2-bracket-match adm-fc2-bracket-match--placeholder">
      <button type="button">{labelA}</button>
      <button type="button">{labelB}</button>
      <small>{time}</small>
    </article>
  );
}

function FightEditor({
  event,
  fights,
  fight,
  fighterOptions,
  settings
}: {
  event: EventOption;
  fights: FightRow[];
  fight: FightRow | null;
  fighterOptions: FighterProfileOption[];
  settings: FightcardSettings;
}) {
  const { toast } = useAdminUi();
  const [isPending, startTransition] = useTransition();
  const initialTeam = fight ? isTeamFight(fight.matchup_type) : settings.general.defaultMatchupType !== "single";
  const [isTeam, setIsTeam] = useState(initialTeam);
  const [teamSize, setTeamSize] = useState(fight ? teamSizeForMatchup(fight.matchup_type) : Math.min(settings.tournament.maxTeamSize, 2));
  const [countryA, setCountryA] = useState(fight?.corner_a_country_code ?? countryByName(fight?.corner_a_label)?.code ?? "DEU");
  const [countryB, setCountryB] = useState(fight?.corner_b_country_code ?? countryByName(fight?.corner_b_label)?.code ?? "FRA");
  const redCountry = countryByCode(countryA);
  const blueCountry = countryByCode(countryB);
  const matchupType = (isTeam ? `team_${teamSize}v${teamSize}` : "single") as FightMatchupType;
  const redParticipants = sortedParticipants(fight ?? emptyFight(event.id), "red");
  const blueParticipants = sortedParticipants(fight ?? emptyFight(event.id), "blue");
  const [previewRed, setPreviewRed] = useState(redParticipants.map((participant) => participantLabel(participant)));
  const [previewBlue, setPreviewBlue] = useState(blueParticipants.map((participant) => participantLabel(participant)));

  const submit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    const formData = new FormData(submitEvent.currentTarget);
    startTransition(() => {
      void (async () => {
        const result = fight
          ? await updateFightAction(fight.id, null, formData)
          : await createFightAction(null, formData);
        toast(result.ok ? "success" : "error", result.ok ? "Kampf gespeichert" : "Kampf konnte nicht gespeichert werden", result.ok ? result.message : result.error);
      })();
    });
  };

  const updatePreview = (corner: "red" | "blue", index: number, option: FighterProfileOption | null) => {
    const setter = corner === "red" ? setPreviewRed : setPreviewBlue;
    setter((current) => {
      const next = [...current];
      next[index] = option?.name ?? emptyParticipant;
      return next;
    });
  };

  return (
    <section className="adm-fc2-editor">
      <div className="adm-fc2-editor__intro">
        <h2>{fight ? "Kampf bearbeiten" : "Kampf hinzufügen"}</h2>
        <p>
          {fight
            ? "Bearbeite Kampfdetails direkt in der Fightcard-Maske."
            : `Füge einen neuen Kampf zur Fightcard von ${event.name} hinzu.`}
        </p>
      </div>

      <div className="adm-fc2-editor__grid">
        <aside className="adm-fc2-stepper">
          {[
            ["1", "Kampf Typ", "Wähle den Kampftyp"],
            ["2", "Turnier Format", "Wähle das Turnier Format"],
            ["3", "Teams & Länder", "Wähle Teams und Fighter"],
            ["4", "Kampf Details", "Gewichtsklasse, Runden, etc."],
            ["5", "Zusätzliche Optionen", "Regeln, Reihenfolge, Notizen"],
            ["6", "Überprüfen & Erstellen", "Überprüfe deine Angaben"]
          ].map(([number, title, text], index) => (
            <span className={index === 0 ? "is-active" : ""} key={number}>
              <b>{number}</b>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
          ))}
          <Link className="adm-fc2-btn" href={tabHref(event.id, "overview")}>Abbrechen</Link>
        </aside>

        <form className="adm-fc2-editor-form" onSubmit={submit}>
          <input type="hidden" name="event_id" value={event.id} />
          <input type="hidden" name="sort_order" value={fight?.sort_order ?? nextSortOrder(fights)} />
          <input type="hidden" name="matchup_type" value={matchupType} />
          <input type="hidden" name="corner_a_label" value={redCountry.name} />
          <input type="hidden" name="corner_b_label" value={blueCountry.name} />

          <div className="adm-fc2-form-section">
            <h3>1. Kampf Typ wählen</h3>
            <div className="adm-fc2-choice-grid adm-fc2-choice-grid--two adm-fc2-choice-grid--large">
              <button type="button" className={!isTeam ? "is-selected" : ""} onClick={() => setIsTeam(false)}>
                <Swords aria-hidden="true" size={30} />
                <strong>Normaler Kampf</strong>
                <span>1 vs 1 Einzelkampf</span>
                <small>Klassischer Kampf zwischen zwei Kämpfern.</small>
              </button>
              <button type="button" className={isTeam ? "is-selected" : ""} onClick={() => setIsTeam(true)}>
                <Trophy aria-hidden="true" size={30} />
                <strong>Sonderturnier</strong>
                <span>Länderturnier (Team vs Team)</span>
                <small>Kämpfe zwischen Teams aus verschiedenen Ländern.</small>
              </button>
            </div>
          </div>

          {isTeam ? (
            <div className="adm-fc2-form-section">
              <h3>2. Turnier Format wählen</h3>
              <p>Wähle die Teamgröße für das Länderturnier.</p>
              <div className="adm-fc2-format-grid">
                {[1, 2, 3, 4].map((size) => (
                  <button key={size} type="button" className={teamSize === size ? "is-selected" : ""} onClick={() => setTeamSize(size)}>
                    <strong>{size} vs {size}</strong>
                    <span>Länderturnier</span>
                    {teamSize === size ? <Check aria-hidden="true" size={18} /> : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="adm-fc2-form-section">
            <h3>3. Teams & Länder auswählen</h3>
            <p>Wähle Länder und Fighter für beide Seiten.</p>
            <div className="adm-fc2-team-select-grid">
              <div>
                <label>
                  <FieldLabel>{isTeam ? "Team links" : "Seite links"}</FieldLabel>
                  <select name="corner_a_country_code" value={countryA} onChange={(event) => setCountryA(event.target.value)}>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </label>
                <FighterSlots
                  corner="red"
                  slots={isTeam ? teamSize : 1}
                  prefix={isTeam ? "participant_red" : "fighter_a"}
                  participants={redParticipants}
                  fighterOptions={fighterOptions}
                  onSelectionChange={updatePreview}
                />
              </div>

              <span className="adm-fc2-editor-vs">VS</span>

              <div>
                <label>
                  <FieldLabel>{isTeam ? "Team rechts" : "Seite rechts"}</FieldLabel>
                  <select name="corner_b_country_code" value={countryB} onChange={(event) => setCountryB(event.target.value)}>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </label>
                <FighterSlots
                  corner="blue"
                  slots={isTeam ? teamSize : 1}
                  prefix={isTeam ? "participant_blue" : "fighter_b"}
                  participants={blueParticipants}
                  fighterOptions={fighterOptions}
                  onSelectionChange={updatePreview}
                />
              </div>
            </div>
          </div>

          <div className="adm-fc2-form-section">
            <h3>4. Kampf Details</h3>
            <div className="adm-fc2-two-cols adm-fc2-two-cols--three">
              <label>
                <FieldLabel>Gewichtsklasse</FieldLabel>
                <input name="weight_class" defaultValue={fight?.weight_class ?? settings.weightClasses[0] ?? "Offen"} />
              </label>
              <label>
                <FieldLabel>Runden</FieldLabel>
                <select name="rounds" defaultValue={fight?.rounds ?? settings.general.defaultRounds}>
                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                </select>
              </label>
              <label>
                <FieldLabel>Rundenzeit</FieldLabel>
                <select name="round_duration" defaultValue={fight?.round_duration ?? settings.general.defaultRoundDuration}>
                  <option>2 Minuten</option>
                  <option>3 Minuten</option>
                  <option>5 Minuten</option>
                </select>
              </label>
            </div>
            <div className="adm-fc2-two-cols">
              <label>
                <FieldLabel>Disziplin</FieldLabel>
                <select name="discipline" defaultValue={fight?.discipline ?? EVENT_DISCIPLINES[0]}>
                  {EVENT_DISCIPLINES.map((discipline) => (
                    <option key={discipline}>{discipline}</option>
                  ))}
                </select>
              </label>
              <label>
                <FieldLabel>Geplanter Zeitpunkt</FieldLabel>
                <input type="datetime-local" name="scheduled_at" defaultValue={datetimeLocalValue(fight?.scheduled_at ?? null)} />
              </label>
            </div>
            <input name="label" defaultValue={fight?.label ?? ""} placeholder="z.B. Hauptevent, Titelkampf, etc." />
          </div>

          <div className="adm-fc2-form-section">
            <h3>5. Zusätzliche Optionen</h3>
            <div className="adm-fc2-two-cols">
              <label>
                <FieldLabel>Status</FieldLabel>
                <select name="status" defaultValue={fight?.status ?? settings.general.defaultStatus}>
                  {FIGHT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {FIGHT_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <FieldLabel>Gewinner</FieldLabel>
                <select name="winner_corner" defaultValue={fight?.winner_corner ?? ""}>
                  <option value="">Noch offen</option>
                  <option value="red">{redCountry.name}</option>
                  <option value="blue">{blueCountry.name}</option>
                </select>
              </label>
            </div>
            <div className="adm-fc2-check-grid">
              <label>
                <input type="checkbox" name="is_main_event" defaultChecked={fight?.is_main_event ?? false} />
                <input type="hidden" name="is_main_event" value="false" />
                Main Event markieren
              </label>
              <label>
                <input type="checkbox" name="is_visible" defaultChecked={fight?.is_visible ?? settings.general.defaultVisibility === "public"} />
                <input type="hidden" name="is_visible" value="false" />
                Öffentlich sichtbar
              </label>
            </div>
            <textarea name="notes" defaultValue={fight?.notes ?? ""} placeholder="Interne Notizen" rows={4} />
          </div>

          <div className="adm-fc2-hint">
            <Shield aria-hidden="true" size={20} />
            <p>Du kannst Teams und Fighter später jederzeit bearbeiten. Änderungen werden erst beim Speichern übernommen.</p>
          </div>

          <button className="adm-fc2-submit" type="submit" disabled={isPending}>
            {isPending ? <Loader2 aria-hidden="true" size={18} /> : <Save aria-hidden="true" size={18} />}
            {fight ? "Kampf speichern" : "Kampf erstellen"}
          </button>
        </form>

        <aside className="adm-fc2-preview">
          <h3>Kampf Vorschau</h3>
          <div className="adm-fc2-preview-card">
            <strong>{isTeam ? `${teamSize} vs ${teamSize} Länderturnier` : "1 vs 1 Einzelkampf"}</strong>
            <div className="adm-fc2-preview-teams">
              <span><FlagMark country={redCountry} /> {redCountry.name}</span>
              <b>VS</b>
              <span><FlagMark country={blueCountry} /> {blueCountry.name}</span>
            </div>
            <div className="adm-fc2-preview-avatars">
              <span>{previewRed.slice(0, isTeam ? teamSize : 1).join(" & ")}</span>
              <b>vs</b>
              <span>{previewBlue.slice(0, isTeam ? teamSize : 1).join(" & ")}</span>
            </div>
          </div>
          <dl>
            <div><dt>Gewichtsklasse</dt><dd>{fight?.weight_class ?? settings.weightClasses[0] ?? "Offen"}</dd></div>
            <div><dt>Runden</dt><dd>{fight?.rounds ?? settings.general.defaultRounds}</dd></div>
            <div><dt>Rundenzeit</dt><dd>{fight?.round_duration ?? settings.general.defaultRoundDuration}</dd></div>
            <div><dt>Status</dt><dd>{FIGHT_STATUS_LABELS[fight?.status ?? settings.general.defaultStatus]}</dd></div>
            <div><dt>Geplanter Zeitpunkt</dt><dd>{formatScheduledAt(fight?.scheduled_at ?? null) || "Offen"}</dd></div>
            <div><dt>Position auf der Card</dt><dd>{fight?.is_main_event ? "Main Event" : "Main Card"}</dd></div>
          </dl>
          <button className="adm-fc2-submit" type="submit" form="" disabled>
            Weiter <ChevronRight aria-hidden="true" size={18} />
          </button>
        </aside>
      </div>
    </section>
  );
}

function emptyFight(eventId: number): FightRow {
  return {
    id: 0,
    event_id: eventId,
    sort_order: 0,
    matchup_type: "single",
    label: null,
    corner_a_label: null,
    corner_b_label: null,
    corner_a_country_code: null,
    corner_b_country_code: null,
    fighter_a_user_id: null,
    fighter_b_user_id: null,
    fighter_a: null,
    fighter_b: null,
    fighter_a_image_path: null,
    fighter_b_image_path: null,
    fighter_a_is_tba: true,
    fighter_b_is_tba: true,
    weight_class: null,
    discipline: null,
    rounds: 3,
    round_duration: "3 Minuten",
    scheduled_at: null,
    winner_corner: null,
    is_main_event: false,
    is_visible: false,
    status: "planned",
    notes: null,
    fight_card_participants: []
  };
}

function FighterSlots({
  corner,
  slots,
  prefix,
  participants,
  fighterOptions,
  onSelectionChange
}: {
  corner: "red" | "blue";
  slots: number;
  prefix: string;
  participants: Array<FightParticipantRow | null>;
  fighterOptions: FighterProfileOption[];
  onSelectionChange: (corner: "red" | "blue", index: number, option: FighterProfileOption | null) => void;
}) {
  return (
    <div className="adm-fc2-fighter-slots">
      {Array.from({ length: slots }, (_, index) => {
        const participant = participants[index];
        const fieldPrefix = slots === 1 && (prefix === "fighter_a" || prefix === "fighter_b") ? prefix : `${prefix}_${index + 1}`;
        return (
          <FighterProfilePicker
            key={fieldPrefix}
            name={`${fieldPrefix}_user_id`}
            legacyFieldName={fieldPrefix}
            label={`Fighter ${index + 1} auswählen`}
            options={fighterOptions}
            initialUserId={participant?.fighter_user_id ?? null}
            legacyName={participant?.display_name ?? null}
            corner={corner}
            emptyLabel="Wird bekanntgegeben"
            onSelectionChange={(option) => onSelectionChange(corner, index, option)}
          />
        );
      })}
    </div>
  );
}

function SettingsTab({ event, settings }: { event: EventOption; settings: FightcardSettings }) {
  const { toast } = useAdminUi();
  const [isPending, startTransition] = useTransition();
  const [section, setSection] = useState("general");
  const [bannerPreview, setBannerPreview] = useState(settings.media.bannerUrl ?? "");
  const [logoPreview, setLogoPreview] = useState(settings.media.logoUrl ?? "");
  const [bannerCleared, setBannerCleared] = useState(false);
  const [logoCleared, setLogoCleared] = useState(false);

  const submit = (eventSubmit: FormEvent<HTMLFormElement>) => {
    eventSubmit.preventDefault();
    const formData = new FormData(eventSubmit.currentTarget);
    startTransition(() => {
      void (async () => {
        const result = await saveFightcardSettingsAction(null, formData);
        toast(result.ok ? "success" : "error", result.ok ? "Einstellungen gespeichert" : "Einstellungen konnten nicht gespeichert werden", result.ok ? result.message : result.error);
      })();
    });
  };

  const settingNav = [
    ["general", Settings, "Grundeinstellungen", "Allgemeine Fightcard Optionen"],
    ["categories", ListChecks, "Kategorien", "Kampf Kategorien verwalten"],
    ["weights", Scale, "Gewichtsklassen", "Gewichtsklassen verwalten"],
    ["rules", FileText, "Turnier Regeln", "Regeln für Turniere festlegen"],
    ["points", Star, "Punkte System", "Punkte und Bewertungen"],
    ["display", Monitor, "Darstellung", "Anzeige Einstellungen"],
    ["notifications", Bell, "Benachrichtigungen", "Benachrichtigung & Alerts"],
    ["export", Upload, "Export & Teilen", "Export Optionen"],
    ["api", Code2, "API & Integration", "Externe Integrationen"]
  ] as const;

  return (
    <form className="adm-fc2-settings" onSubmit={submit}>
      <input type="hidden" name="event_id" value={event.id} />
      <input type="hidden" name="media_banner_url" value={bannerPreview} />
      <input type="hidden" name="media_logo_url" value={logoPreview} />
      <input type="hidden" name="clear_banner_url" value={bannerCleared ? "on" : ""} />
      <input type="hidden" name="clear_logo_url" value={logoCleared ? "on" : ""} />

      <aside className="adm-fc2-settings-nav">
        <h2>Einstellungen</h2>
        {settingNav.map(([id, Icon, label, text]) => (
          <button key={id} type="button" className={section === id ? "is-active" : ""} onClick={() => setSection(id)}>
            <Icon aria-hidden="true" size={21} />
            <span>
              <strong>{label}</strong>
              <small>{text}</small>
            </span>
          </button>
        ))}
        <div className="adm-fc2-support">
          <LifeBuoyIcon />
          <strong>Hilfe & Support</strong>
          <p>Benötigst du Hilfe? Sieh dir unsere Anleitung an oder kontaktiere unser Support Team.</p>
          <ChevronRight aria-hidden="true" size={18} />
        </div>
      </aside>

      <div className="adm-fc2-settings-main">
        <section className="adm-fc2-panel">
          <h2>Grundeinstellungen</h2>
          <div className="adm-fc2-two-cols adm-fc2-two-cols--three">
            <label>
              <FieldLabel>Standard Kampf Typ</FieldLabel>
              <select name="default_matchup_type" defaultValue={settings.general.defaultMatchupType}>
                {Object.entries(FIGHT_MATCHUP_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <FieldLabel>Standard Runden</FieldLabel>
              <select name="default_rounds" defaultValue={settings.general.defaultRounds}>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
              </select>
            </label>
            <label>
              <FieldLabel>Standard Rundenzeit</FieldLabel>
              <select name="default_round_duration" defaultValue={settings.general.defaultRoundDuration}>
                <option>2 Minuten</option>
                <option>3 Minuten</option>
                <option>5 Minuten</option>
              </select>
            </label>
          </div>
          <div className="adm-fc2-two-cols">
            <label>
              <FieldLabel>Status nach Erstellung</FieldLabel>
              <select name="default_status" defaultValue={settings.general.defaultStatus}>
                {FIGHT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {FIGHT_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <FieldLabel>Sichtbarkeit neuer Kämpfe</FieldLabel>
              <select name="default_visibility" defaultValue={settings.general.defaultVisibility}>
                <option value="admin">Nur für Administratoren</option>
                <option value="public">Öffentlich sichtbar</option>
              </select>
            </label>
          </div>
        </section>

        <section className="adm-fc2-panel">
          <h2>Anzeige Optionen</h2>
          <div className="adm-fc2-toggle-grid">
            <ToggleField name="display_auto_numbering" label="Kampf Nummerierung automatisch" description="Kämpfe werden automatisch nummeriert" defaultChecked={settings.display.autoNumbering} />
            <ToggleField name="display_show_team_logos" label="Team Logos anzeigen" description="Zeige Team Logos in Kämpfen und Turnieren" defaultChecked={settings.display.showTeamLogos} />
            <ToggleField name="display_show_nationality" label="Kämpfer Nationalität anzeigen" description="Zeige die Nationalität der Kämpfer" defaultChecked={settings.display.showNationality} />
            <ToggleField name="display_show_team_flags" label="Team Flaggen anzeigen" description="Zeige Länderflaggen bei Länderturnieren" defaultChecked={settings.display.showTeamFlags} />
            <ToggleField name="display_show_weight_class" label="Gewichtsklasse anzeigen" description="Zeige die Gewichtsklasse in der Fightcard" defaultChecked={settings.display.showWeightClass} />
            <ToggleField name="display_hide_completed" label="Abgeschlossene Kämpfe verstecken" description="Verstecke abgeschlossene Kämpfe automatisch" defaultChecked={settings.display.hideCompleted} />
          </div>
        </section>

        <section className="adm-fc2-panel">
          <h2>Turnier Optionen</h2>
          <div className="adm-fc2-toggle-grid">
            <ToggleField name="tournament_enabled" label="Länderturniere aktivieren" description="Aktiviere Länderturniere in der Fightcard" defaultChecked={settings.tournament.enabled} />
            <label>
              <FieldLabel>Maximale Team Größe</FieldLabel>
              <select name="tournament_max_team_size" defaultValue={settings.tournament.maxTeamSize}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>
            <ToggleField name="tournament_public_bracket" label="Turnier Baum öffentlich anzeigen" description="Zeige den Turnier Baum auf der Event Seite" defaultChecked={settings.tournament.publicBracket} />
            <ToggleField name="tournament_live_updates" label="Live Updates aktivieren" description="Echtzeit Updates im Turnier Baum" defaultChecked={settings.tournament.liveUpdates} />
          </div>
        </section>

        <section className="adm-fc2-panel adm-fc2-settings-textareas">
          <div>
            <h2>Kategorien</h2>
            <textarea name="categories" defaultValue={settings.categories.join("\n")} rows={5} />
          </div>
          <div>
            <h2>Gewichtsklassen</h2>
            <textarea name="weight_classes" defaultValue={settings.weightClasses.join("\n")} rows={5} />
          </div>
          <div>
            <h2>Regeln & Punkte</h2>
            <input name="rules_format" defaultValue={settings.rules.format} />
            <input name="rules_tiebreaker" defaultValue={settings.rules.tiebreaker} />
            <div className="adm-fc2-two-cols adm-fc2-two-cols--three">
              <input name="points_win" type="number" defaultValue={settings.points.win} />
              <input name="points_draw" type="number" defaultValue={settings.points.draw} />
              <input name="points_loss" type="number" defaultValue={settings.points.loss} />
            </div>
            <input name="points_team_win" defaultValue={settings.points.teamWin} />
          </div>
        </section>

        <section className="adm-fc2-panel adm-fc2-system">
          <h2>System Optionen</h2>
          <ToggleField name="system_autosave" label="Automatisches Speichern" description="Änderungen automatisch speichern" defaultChecked={settings.system.autosave} />
          <ToggleField name="system_save_history" label="Kampf Historie speichern" description="Verfolge alle Änderungen an Kämpfen" defaultChecked={settings.system.saveHistory} />
          <ToggleField name="system_backup" label="Backup erstellen" description="Regelmäßige Backups der Fightcard" defaultChecked={settings.system.backupEnabled} />
          <button className="adm-fc2-btn adm-fc2-btn--gold" type="button" onClick={() => toast("warning", "Backup vorbereitet", "Die Backup-Aktion ist als Admin-Kontrolle sichtbar; die Speicherung läuft über Einstellungen speichern.")}>
            <Shield aria-hidden="true" size={16} /> Jetzt sichern
          </button>
        </section>

        <button className="adm-fc2-submit adm-fc2-submit--settings" type="submit" disabled={isPending}>
          {isPending ? <Loader2 aria-hidden="true" size={18} /> : <Save aria-hidden="true" size={18} />}
          Einstellungen speichern
        </button>
      </div>

      <aside className="adm-fc2-media-panel">
        <h2>Banner & Medien</h2>
        <label>
          <FieldLabel>Standard Banner</FieldLabel>
          <span className="adm-fc2-media-preview adm-fc2-media-preview--banner" style={bannerPreview ? { backgroundImage: `url(${bannerPreview})` } : undefined}>
            {!bannerPreview ? <ImageIcon aria-hidden="true" size={28} /> : null}
          </span>
          <span className="adm-fc2-file-btn">
            <Upload aria-hidden="true" size={16} /> Ändern
            <input type="file" name="banner_file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setBannerPreview(URL.createObjectURL(file));
                setBannerCleared(false);
              }
            }} />
          </span>
          {bannerPreview ? (
            <button className="adm-fc2-file-btn adm-fc2-file-btn--danger" type="button" onClick={() => {
              setBannerPreview("");
              setBannerCleared(true);
            }}>
              <Trash2 aria-hidden="true" size={16} /> Entfernen
            </button>
          ) : null}
          <small>Empfohlen: 1920x600px (JPG, PNG)</small>
        </label>
        <label>
          <FieldLabel>Event Logo</FieldLabel>
          <span className="adm-fc2-media-preview adm-fc2-media-preview--logo" style={logoPreview ? { backgroundImage: `url(${logoPreview})` } : undefined}>
            {!logoPreview ? <ImageIcon aria-hidden="true" size={28} /> : null}
          </span>
          <span className="adm-fc2-file-btn">
            <Upload aria-hidden="true" size={16} /> Ändern
            <input type="file" name="logo_file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setLogoPreview(URL.createObjectURL(file));
                setLogoCleared(false);
              }
            }} />
          </span>
          {logoPreview ? (
            <button className="adm-fc2-file-btn adm-fc2-file-btn--danger" type="button" onClick={() => {
              setLogoPreview("");
              setLogoCleared(true);
            }}>
              <Trash2 aria-hidden="true" size={16} /> Entfernen
            </button>
          ) : null}
          <small>Empfohlen: 512x512px (PNG)</small>
        </label>
      </aside>
    </form>
  );
}

function LifeBuoyIcon() {
  return <span className="adm-fc2-support__icon">?</span>;
}
