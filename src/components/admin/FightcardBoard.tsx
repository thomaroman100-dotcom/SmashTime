"use client";

import { type ReactNode, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Flag,
  GripVertical,
  Info,
  Loader2,
  Pencil,
  Plus,
  Rocket,
  Save,
  Star,
  Trash2,
  X
} from "lucide-react";
import {
  type FightRow,
  createFightAction,
  deleteFightAction,
  publishFightcardAction,
  reorderFightsAction,
  updateFightAction
} from "@/lib/admin/actions/fightcards";
import { EVENT_DISCIPLINES, FIGHT_SECTIONS, FIGHT_STATUSES, FIGHT_STATUS_LABELS } from "@/lib/admin/resource-shared";
import { useAdminUi } from "@/components/admin/ui/AdminUiProvider";
import { InitialsAvatar } from "@/components/admin/ui/primitives";
import { FighterProfilePicker, type FighterProfileOption } from "@/components/admin/FighterProfilePicker";

type EventOption = {
  id: number;
  name: string;
  dateLabel: string;
  location: string;
};

type FightcardBoardProps = {
  events: EventOption[];
  activeEventId: number;
  fights: FightRow[];
  fighterOptions: FighterProfileOption[];
};

type Section = (typeof FIGHT_SECTIONS)[number];

function sectionOf(fight: FightRow): Section {
  const label = (fight.label ?? "").trim();
  const match = FIGHT_SECTIONS.find((section) => section.toLowerCase() === label.toLowerCase());
  if (match) {
    return match;
  }
  return fight.is_main_event ? "Main Event" : "Main Card";
}

const SECTION_ICONS: Record<Section, typeof Star> = {
  "Main Event": Star,
  "Co-Main Event": Star,
  "Main Card": Flag,
  "Preliminary Card": Flag
};

function StepHeader({
  step,
  title,
  description
}: {
  step: number;
  title: string;
  description?: string;
}) {
  return (
    <div className="adm-fsection__head adm-fight-modal__step-head">
      <span className="adm-step-badge">{step}</span>
      <div className="adm-fight-modal__step-copy">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

function ModalSection({
  step,
  title,
  description,
  className,
  children
}: {
  step: number;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={["adm-fsection adm-fight-modal__card", className].filter(Boolean).join(" ")}>
      <StepHeader step={step} title={title} description={description} />
      <div className="adm-fsection__body adm-fight-modal__card-body">{children}</div>
    </section>
  );
}

type ModalState =
  | { mode: "closed" }
  | { mode: "create"; section: Section }
  | { mode: "edit"; fight: FightRow };

export function FightcardBoard({ events, activeEventId, fights, fighterOptions }: FightcardBoardProps) {
  const router = useRouter();
  const ui = useAdminUi();
  const [pending, startTransition] = useTransition();

  const [order, setOrder] = useState<number[]>(() => fights.map((fight) => fight.id));
  const [orderDirty, setOrderDirty] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  const fightById = useMemo(() => new Map(fights.map((fight) => [fight.id, fight])), [fights]);
  const orderedFights = useMemo(
    () =>
      [
        ...order.map((id) => fightById.get(id)).filter((fight): fight is FightRow => Boolean(fight)),
        ...fights.filter((fight) => !order.includes(fight.id))
      ],
    [order, fightById, fights]
  );

  const sections = useMemo(() => {
    const map = new Map<Section, FightRow[]>();
    for (const section of FIGHT_SECTIONS) {
      map.set(section, []);
    }
    for (const fight of orderedFights) {
      map.get(sectionOf(fight))!.push(fight);
    }
    return map;
  }, [orderedFights]);

  const activeEvent = events.find((event) => event.id === activeEventId);

  const moveWithin = (section: Section, fromId: number, toId: number) => {
    if (fromId === toId) {
      return;
    }
    const sectionFights = sections.get(section)!.map((fight) => fight.id);
    const fromIndex = sectionFights.indexOf(fromId);
    const toIndex = sectionFights.indexOf(toId);
    if (fromIndex < 0 || toIndex < 0) {
      return;
    }
    const reordered = [...sectionFights];
    reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, fromId);

    const nextOrder: number[] = [];
    for (const sec of FIGHT_SECTIONS) {
      const ids = sec === section ? reordered : sections.get(sec)!.map((fight) => fight.id);
      nextOrder.push(...ids);
    }
    setOrder(nextOrder);
    setOrderDirty(true);
  };

  const saveOrder = () => {
    startTransition(async () => {
      const result = await reorderFightsAction(activeEventId, orderedFights.map((fight) => fight.id));
      if (result.ok) {
        ui.toast("success", "Erfolg", "Die Fightcard wurde erfolgreich gespeichert.");
        setOrderDirty(false);
        router.refresh();
      } else {
        ui.toast("error", "Fehler", result.error);
      }
    });
  };

  const publish = async () => {
    const confirmed = await ui.confirm({
      title: "Fightcard veröffentlichen?",
      message: "Alle Kämpfe dieses Events werden öffentlich sichtbar geschaltet.",
      itemLabel: activeEvent?.name ?? "Fightcard",
      itemMeta: `${fights.length} Kämpfe`,
      confirmLabel: "Veröffentlichen"
    });
    if (!confirmed) {
      return;
    }
    startTransition(async () => {
      const result = await publishFightcardAction(activeEventId);
      if (result.ok) {
        ui.toast("success", "Erfolg", result.message);
        router.refresh();
      } else {
        ui.toast("error", "Fehler", result.error);
      }
    });
  };

  const removeFight = async (fight: FightRow) => {
    const confirmed = await ui.confirm({
      title: "Kampf löschen?",
      message: "Der Kampf wird dauerhaft aus der Fightcard entfernt.",
      itemLabel: `${fight.fighter_a ?? "TBA"} vs. ${fight.fighter_b ?? "TBA"}`,
      itemMeta: fight.weight_class ?? sectionOf(fight)
    });
    if (!confirmed) {
      return;
    }
    startTransition(async () => {
      const result = await deleteFightAction(fight.id);
      if (result.ok) {
        ui.toast("success", "Erfolg", result.message);
        setOrder((current) => current.filter((id) => id !== fight.id));
        router.refresh();
      } else {
        ui.toast("error", "Fehler", result.error);
      }
    });
  };

  return (
    <div>
      <section className="adm-panel" style={{ marginBottom: 16 }}>
        <div className="adm-toolbar">
          <div className="adm-filter" style={{ flex: 1, minWidth: 260 }}>
            <span>Event</span>
            <select
              value={activeEventId}
              onChange={(event) => router.push(`/admin/fightcards?event=${event.target.value}`)}
              aria-label="Event wählen"
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} · {event.dateLabel} · {event.location}
                </option>
              ))}
            </select>
          </div>
          <button className="adm-btn" type="button" onClick={() => setModal({ mode: "create", section: "Main Event" })}>
            <Plus aria-hidden="true" size={16} /> Kampf hinzufügen
          </button>
          <button className="adm-btn" type="button" disabled={pending || !orderDirty} onClick={saveOrder}>
            {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : <Save aria-hidden="true" size={16} />}
            Fightcard speichern
          </button>
          <button className="adm-btn adm-btn--primary" type="button" disabled={pending || fights.length === 0} onClick={publish}>
            <Rocket aria-hidden="true" size={16} /> Veröffentlichen
          </button>
        </div>
        <div
          className="adm-panel__body"
          style={{ display: "flex", gap: 8, alignItems: "center", borderTop: "1px solid var(--adm-border-soft)", color: "var(--adm-muted)", fontSize: 12.5 }}
        >
          <Info aria-hidden="true" size={14} />
          Ziehe Kämpfe per Drag &amp; Drop, um die Reihenfolge zu ändern. Änderungen mit „Fightcard speichern“ übernehmen.
        </div>
      </section>

      {FIGHT_SECTIONS.map((section) => {
        const sectionFights = sections.get(section)!;
        const Icon = SECTION_ICONS[section];
        return (
          <section className="adm-fc-section" key={section}>
            <h2 className="adm-fc-section__title">
              <Icon aria-hidden="true" size={15} /> {section}
            </h2>
            {sectionFights.length === 0 ? (
              <button
                type="button"
                className="adm-dropzone"
                style={{ width: "100%", padding: "16px 20px" }}
                onClick={() => setModal({ mode: "create", section })}
              >
                <Plus aria-hidden="true" size={16} /> Kampf zu „{section}“ hinzufügen
              </button>
            ) : (
              sectionFights.map((fight) => (
                <article
                  className={`adm-fight${dragId === fight.id ? " adm-fight--dragging" : ""}`}
                  key={fight.id}
                  draggable
                  onDragStart={() => setDragId(fight.id)}
                  onDragEnd={() => setDragId(null)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (dragId != null && dragId !== fight.id && sectionOf(fightById.get(dragId)!) === section) {
                      moveWithin(section, dragId, fight.id);
                    }
                  }}
                >
                  <button className="adm-fight__grip" type="button" aria-label="Kampf verschieben (ziehen)">
                    <GripVertical aria-hidden="true" size={17} />
                  </button>
                  <div className="adm-fight__fighter">
                    <InitialsAvatar name={fight.fighter_a ?? "T B A"} />
                    <div style={{ minWidth: 0 }}>
                      <strong>{fight.fighter_a ?? "Wird bekanntgegeben"}</strong>
                      <span>{fight.fighter_a_is_tba ? "TBA" : FIGHT_STATUS_LABELS[fight.status]}</span>
                    </div>
                  </div>
                  <span className="adm-fight__vs">vs.</span>
                  <div className="adm-fight__meta">
                    <strong>{fight.weight_class ?? "Klasse offen"}</strong>
                    {fight.discipline ?? "Disziplin offen"}
                    {!fight.is_visible ? (
                      <span className="adm-badge adm-badge--gray" style={{ marginTop: 4 }}>
                        Verborgen
                      </span>
                    ) : null}
                  </div>
                  <div className="adm-fight__fighter adm-fight__fighter--right">
                    <InitialsAvatar name={fight.fighter_b ?? "T B A"} />
                    <div style={{ minWidth: 0 }}>
                      <strong>{fight.fighter_b ?? "Wird bekanntgegeben"}</strong>
                      <span>{fight.fighter_b_is_tba ? "TBA" : sectionOf(fight)}</span>
                    </div>
                  </div>
                  <div className="adm-row-actions">
                    <button
                      className="adm-icon-btn"
                      type="button"
                      aria-label="Kampf bearbeiten"
                      onClick={() => setModal({ mode: "edit", fight })}
                    >
                      <Pencil aria-hidden="true" size={15} />
                    </button>
                    <button
                      className="adm-icon-btn adm-icon-btn--danger"
                      type="button"
                      aria-label="Kampf löschen"
                      disabled={pending}
                      onClick={() => removeFight(fight)}
                    >
                      <Trash2 aria-hidden="true" size={15} />
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        );
      })}

      <button
        type="button"
        className="adm-dropzone"
        style={{ width: "100%" }}
        onClick={() => setModal({ mode: "create", section: "Main Card" })}
      >
        <Plus aria-hidden="true" size={17} /> Kampf hinzufügen
      </button>

      {modal.mode !== "closed" ? (
        <FightModal
          key={modal.mode === "edit" ? `edit-${modal.fight.id}` : `create-${modal.section}`}
          eventId={activeEventId}
          eventName={activeEvent?.name ?? ""}
          fighterOptions={fighterOptions}
          initial={modal.mode === "edit" ? modal.fight : null}
          initialSection={modal.mode === "create" ? modal.section : undefined}
          nextSortOrder={(fights.length + 1) * 10}
          onClose={() => setModal({ mode: "closed" })}
        />
      ) : null}
    </div>
  );
}

type FightModalProps = {
  eventId: number;
  eventName: string;
  fighterOptions: FighterProfileOption[];
  initial: FightRow | null;
  initialSection?: Section;
  nextSortOrder: number;
  onClose: () => void;
};

function FightModal({ eventId, eventName, fighterOptions, initial, initialSection, nextSortOrder, onClose }: FightModalProps) {
  const ui = useAdminUi();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [section, setSection] = useState<Section>(initial ? sectionOf(initial) : initialSection ?? "Main Event");
  const [fighterAUserId, setFighterAUserId] = useState(initial?.fighter_a_user_id ?? "");
  const [fighterBUserId, setFighterBUserId] = useState(initial?.fighter_b_user_id ?? "");
  const [weightClass, setWeightClass] = useState(initial?.weight_class ?? "");
  const [discipline, setDiscipline] = useState(initial?.discipline ?? "");
  const [status, setStatus] = useState(initial?.status ?? "planned");
  const [isVisible, setIsVisible] = useState(initial?.is_visible ?? false);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? nextSortOrder);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const fighterOptionById = useMemo(() => new Map(fighterOptions.map((option) => [option.userId, option])), [fighterOptions]);
  const fighterA = fighterOptionById.get(fighterAUserId)?.name ?? initial?.fighter_a ?? "";
  const fighterB = fighterOptionById.get(fighterBUserId)?.name ?? initial?.fighter_b ?? "";

  const submit = () => {
    const formData = new FormData();
    formData.set("event_id", String(eventId));
    formData.set("label", section);
    formData.set("fighter_a_user_id", fighterAUserId);
    formData.set("fighter_b_user_id", fighterBUserId);
    if (!fighterAUserId && initial?.fighter_a) {
      formData.set("fighter_a", initial.fighter_a);
    }
    if (!fighterBUserId && initial?.fighter_b) {
      formData.set("fighter_b", initial.fighter_b);
    }
    formData.set("weight_class", weightClass);
    formData.set("discipline", discipline);
    formData.set("status", status);
    formData.set("sort_order", String(sortOrder));
    formData.set("notes", notes);
    if (section === "Main Event") {
      formData.set("is_main_event", "on");
    }
    if (isVisible) {
      formData.set("is_visible", "on");
    }

    startTransition(async () => {
      const result = initial
        ? await updateFightAction(initial.id, null, formData)
        : await createFightAction(null, formData);
      if (result.ok) {
        ui.toast("success", "Erfolg", result.message);
        router.refresh();
        onClose();
      } else {
        ui.toast("error", "Fehler", result.error);
      }
    });
  };

  return (
    <div
      className="adm-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={initial ? "Kampf bearbeiten" : "Kampf hinzufügen"}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="adm-modal adm-fight-modal">
        <div className="adm-modal__head">
          <span className="adm-modal__icon" aria-hidden="true">
            {initial ? <Pencil aria-hidden="true" size={15} /> : <Plus aria-hidden="true" size={16} />}
          </span>
          <div className="adm-modal__title">
            <h2>{initial ? "Kampf bearbeiten" : "Kampf hinzufügen"}</h2>
            <p>
              {initial
                ? `Bearbeite den ausgewählten Kampf für ${eventName}.`
                : `Füge einen neuen Kampf zur Fightcard von ${eventName} hinzu.`}
            </p>
          </div>
          <button className="adm-modal__close" type="button" aria-label="Schließen" onClick={onClose}>
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="adm-modal__body adm-fight-modal__body">
          <ModalSection step={1} title="Abschnitt auswählen" className="adm-fight-modal__section-card">
              <div className="adm-fight-modal__section-buttons">
                {FIGHT_SECTIONS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`adm-btn adm-fight-modal__section-button${section === value ? " adm-btn--primary" : ""}`}
                    onClick={() => setSection(value)}
                  >
                    {value === "Main Event" || value === "Co-Main Event" ? (
                      <Star aria-hidden="true" size={14} />
                    ) : (
                      <Flag aria-hidden="true" size={14} />
                    )}
                    {value.toUpperCase()}
                  </button>
                ))}
              </div>
          </ModalSection>

          <div className="adm-fight-modal__feature-grid">
            <ModalSection step={2} title="Kämpfer auswählen" className="adm-fight-modal__fighters-card">
                <div className="adm-fighter-picker-grid">
                  <div className="adm-field adm-fighter-picker adm-fighter-picker--red">
                    <label htmlFor="fight-fighter-a">
                      KÄMPFER A
                    </label>
                    <FighterProfilePicker
                      name="fighter_a_user_id"
                      label="KÄMPFER A"
                      options={fighterOptions}
                      initialUserId={fighterAUserId}
                      legacyName={initial?.fighter_a}
                      legacyFieldName="fighter_a"
                      corner="red"
                      onSelectionChange={(option) => setFighterAUserId(option?.userId ?? "")}
                    />
                  </div>
                  <span className="adm-vs-hex adm-fight-modal__vs">VS.</span>
                  <div className="adm-field adm-fighter-picker adm-fighter-picker--blue">
                    <FighterProfilePicker
                      name="fighter_b_user_id"
                      label="KÄMPFER B"
                      options={fighterOptions}
                      initialUserId={fighterBUserId}
                      legacyName={initial?.fighter_b}
                      legacyFieldName="fighter_b"
                      corner="blue"
                      onSelectionChange={(option) => setFighterBUserId(option?.userId ?? "")}
                    />
                  </div>
                </div>
            </ModalSection>

            <ModalSection
              step={9}
              title="Vorschau"
              description="So wird der Kampf in der Fightcard angezeigt."
              className="adm-fight-modal__preview-card"
            >
                <div className="adm-fight-preview-card">
                  <div className="adm-fight-preview-card__fighter">
                    <span className="adm-fight-preview-card__avatar">{fighterA ? fighterA.slice(0, 2).toUpperCase() : "TB"}</span>
                    <div>
                      <strong>{fighterA || "Kämpfer A"}</strong>
                      <span>{weightClass || "Gewichtsklasse"}</span>
                    </div>
                  </div>
                  <span className="adm-fight-preview-card__vs">vs.</span>
                  <div className="adm-fight-preview-card__fighter adm-fight-preview-card__fighter--right">
                    <span className="adm-fight-preview-card__avatar">{fighterB ? fighterB.slice(0, 2).toUpperCase() : "TB"}</span>
                    <div>
                      <strong>{fighterB || "Kämpfer B"}</strong>
                      <span>{discipline || "Disziplin"}</span>
                    </div>
                  </div>
                </div>
                <p className="adm-preview__hintnote adm-fight-preview-card__meta">
                  {section} · {FIGHT_STATUS_LABELS[status as keyof typeof FIGHT_STATUS_LABELS]}
                </p>
            </ModalSection>
          </div>

          <div className="adm-fight-modal__detail-grid">
            <ModalSection step={3} title="Gewichtsklasse" className="adm-fight-modal__detail-card">
                <input
                  aria-label="Gewichtsklasse"
                  value={weightClass}
                  onChange={(event) => setWeightClass(event.target.value)}
                  placeholder="z. B. Mittelgewicht (-84 kg)"
                />
            </ModalSection>
            <ModalSection step={4} title="Disziplin" className="adm-fight-modal__detail-card">
                <select aria-label="Disziplin" value={discipline} onChange={(event) => setDiscipline(event.target.value)}>
                  <option value="">Disziplin wählen</option>
                  {EVENT_DISCIPLINES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
            </ModalSection>
            <ModalSection step={5} title="Kampfstatus" className="adm-fight-modal__detail-card">
                <select aria-label="Kampfstatus" value={status} onChange={(event) => setStatus(event.target.value as FightRow["status"])}>
                  {FIGHT_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {FIGHT_STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
            </ModalSection>
            <ModalSection step={6} title="Sichtbarkeit" className="adm-fight-modal__detail-card">
                <label className="adm-switch-row" htmlFor="fight-visible">
                  <span>
                    <strong>Öffentlich sichtbar</strong>
                    <p>Erst aktivieren, wenn der Kampf bestätigt ist.</p>
                  </span>
                  <span className="adm-switch">
                    <input
                      id="fight-visible"
                      type="checkbox"
                      checked={isVisible}
                      onChange={(event) => setIsVisible(event.target.checked)}
                    />
                    <i />
                  </span>
                </label>
            </ModalSection>
            <ModalSection step={7} title="Reihenfolge" className="adm-fight-modal__detail-card">
                <input
                  aria-label="Reihenfolge"
                  type="number"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(Number.parseInt(event.target.value, 10) || 0)}
                />
                <span className="adm-field__hint">Bestimmt die Reihenfolge im Abschnitt.</span>
            </ModalSection>
            <ModalSection step={8} title="Notizen (optional)" className="adm-fight-modal__detail-card">
                <textarea
                  aria-label="Notizen"
                  rows={3}
                  maxLength={200}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Zusätzliche Informationen zum Kampf…"
                />
                <span className="adm-field__count">{notes.length} / 200</span>
            </ModalSection>
          </div>
        </div>

        <div className="adm-modal__foot">
          <button className="adm-btn" type="button" onClick={onClose}>
            <X aria-hidden="true" size={15} /> Abbrechen
          </button>
          <button className="adm-btn adm-btn--primary" type="button" disabled={pending} onClick={submit}>
            {pending ? (
              <Loader2 aria-hidden="true" size={16} className="adm-spin" />
            ) : initial ? (
              <Save aria-hidden="true" size={16} />
            ) : (
              <Plus aria-hidden="true" size={16} />
            )}
            {initial ? "Änderungen speichern" : "Kampf hinzufügen"}
          </button>
        </div>
      </div>
    </div>
  );
}
