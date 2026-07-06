"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Rocket,
  Save
} from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import { slugify } from "@/lib/slug";
import type { EventGalleryRow, EventRow, EventStatus } from "@/lib/admin/actions/events";
import { EVENT_DISCIPLINES } from "@/lib/admin/resource-shared";
import { useAdminUi } from "@/components/admin/ui/AdminUiProvider";
import { AdminImagePreview } from "@/components/admin/ui/AdminImagePreview";
import { Badge, type BadgeTone } from "@/components/admin/ui/primitives";

type EventFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  initial?: EventRow | null;
  gallery?: EventGalleryRow[];
  heading: string;
  subheading: string;
};

function toDatetimeLocal(value: string | null) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const pad = (input: number) => String(input).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const statusMeta: Record<EventStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: "Geplant", tone: "blue" },
  published: { label: "Veröffentlicht", tone: "green" },
  archived: { label: "Archiviert", tone: "gray" }
};

export function EventForm({ action, initial, gallery = [], heading, subheading }: EventFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const ui = useAdminUi();
  const statusRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [status, setStatus] = useState<EventStatus>(initial?.status ?? "draft");
  const [dateLabel, setDateLabel] = useState(initial?.date_label ?? "");
  const [eventDate, setEventDate] = useState(toDatetimeLocal(initial?.event_date ?? null));
  const [startsAt, setStartsAt] = useState(initial?.starts_at ?? "");
  const [admission, setAdmission] = useState(initial?.admission ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [ticketUrl, setTicketUrl] = useState(initial?.ticket_url ?? "");
  const [imagePath, setImagePath] = useState(initial?.image_path ?? "");

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.ok) {
      ui.toast("success", "Erfolg", state.message);
    } else {
      ui.toast("error", "Fehler beim Speichern", state.error);
    }
  }, [state, ui]);

  const submitWithStatus = (value: EventStatus) => {
    setStatus(value);
    if (statusRef.current) {
      statusRef.current.value = value;
    }
  };

  const previewDate = dateLabel || (eventDate ? new Date(eventDate).toLocaleDateString("de-AT", { day: "2-digit", month: "long", year: "numeric" }) : "Datum offen");

  return (
    <form action={formAction}>
      <input ref={statusRef} type="hidden" name="status" value={status} readOnly />

      <div className="adm-head">
        <div>
          <Link className="adm-head__back" href="/admin/events">
            <ArrowLeft aria-hidden="true" size={14} /> Zurück zur Liste
          </Link>
          <h1>{heading}</h1>
          <p>{subheading}</p>
        </div>
        <div className="adm-head__actions">
          <button className="adm-btn" type="submit" disabled={pending} onClick={() => submitWithStatus("draft")}>
            {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : <Save aria-hidden="true" size={16} />}
            Entwurf speichern
          </button>
          <button
            className="adm-btn adm-btn--primary"
            type="submit"
            disabled={pending}
            onClick={() => submitWithStatus("published")}
          >
            {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : <Rocket aria-hidden="true" size={16} />}
            Speichern &amp; veröffentlichen
          </button>
        </div>
      </div>

      {state && !state.ok ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>{state.error}</strong>
        </div>
      ) : null}

      <div className="adm-cols adm-cols--form">
        <div>
          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">1</span>
              <h2>Basisdaten</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label htmlFor="event-name">
                    Event-Name <em>*</em>
                  </label>
                  <input
                    id="event-name"
                    name="name"
                    required
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (!slugTouched) {
                        setSlug(slugify(event.target.value));
                      }
                    }}
                    placeholder="z. B. SmashTime 4"
                    maxLength={100}
                  />
                  <span className="adm-field__count">{name.length} / 100</span>
                </div>
                <div className="adm-field">
                  <label htmlFor="event-slug">
                    Slug (URL) <em>*</em>
                  </label>
                  <input
                    id="event-slug"
                    name="slug"
                    value={slug}
                    onChange={(event) => {
                      setSlug(event.target.value);
                      setSlugTouched(true);
                    }}
                    placeholder="z. B. smashtime-4"
                    maxLength={120}
                  />
                  <span className="adm-field__hint">
                    Wird für die Event-URL verwendet{slug ? `: /veranstaltungen/${slug}` : "."}
                  </span>
                </div>
              </div>
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label htmlFor="event-subtitle">Untertitel / Kategorie</label>
                  <input
                    id="event-subtitle"
                    name="subtitle"
                    value={subtitle}
                    onChange={(event) => setSubtitle(event.target.value)}
                    placeholder="z. B. Title Fight, Main Event, Special Event"
                    maxLength={100}
                  />
                  <span className="adm-field__count">{subtitle.length} / 100</span>
                </div>
                <div className="adm-field">
                  <label htmlFor="event-status">
                    Status <em>*</em>
                  </label>
                  <select
                    id="event-status"
                    value={status}
                    onChange={(event) => {
                      const value = event.target.value as EventStatus;
                      setStatus(value);
                      if (statusRef.current) {
                        statusRef.current.value = value;
                      }
                    }}
                  >
                    <option value="draft">Geplant</option>
                    <option value="published">Veröffentlicht</option>
                    <option value="archived">Archiviert</option>
                  </select>
                  <span className="adm-field__hint">Bestimmt den aktuellen Veröffentlichungsstatus.</span>
                </div>
              </div>
              <div className="adm-field">
                <label htmlFor="event-short-name">
                  Kurzname <em>*</em>
                </label>
                <input
                  id="event-short-name"
                  name="short_name"
                  required
                  defaultValue={initial?.short_name ?? ""}
                  placeholder="z. B. SmashTime 4"
                />
                <span className="adm-field__hint">Wird in kompakten Ansichten (z. B. Countdown) verwendet.</span>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">2</span>
              <h2>Datum &amp; Ort</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-grid-3">
                <div className="adm-field">
                  <label htmlFor="event-date">
                    Datum <em>*</em>
                  </label>
                  <input
                    id="event-date"
                    name="event_date"
                    type="datetime-local"
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                  />
                </div>
                <div className="adm-field">
                  <label htmlFor="event-starts">Beginn (Uhrzeit)</label>
                  <input
                    id="event-starts"
                    name="starts_at"
                    value={startsAt}
                    onChange={(event) => setStartsAt(event.target.value)}
                    placeholder="z. B. 19:00"
                  />
                </div>
                <div className="adm-field">
                  <label htmlFor="event-admission">Einlass (Uhrzeit)</label>
                  <input
                    id="event-admission"
                    name="admission"
                    value={admission}
                    onChange={(event) => setAdmission(event.target.value)}
                    placeholder="z. B. 17:00"
                  />
                </div>
              </div>
              <div className="adm-grid-3">
                <div className="adm-field">
                  <label htmlFor="event-location">
                    Venue / Location <em>*</em>
                  </label>
                  <input
                    id="event-location"
                    name="location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="z. B. Halle, Arena"
                    maxLength={120}
                  />
                  <span className="adm-field__count">{location.length} / 120</span>
                </div>
                <div className="adm-field">
                  <label htmlFor="event-address">Adresse</label>
                  <input
                    id="event-address"
                    name="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Straße, PLZ Ort"
                    maxLength={120}
                  />
                  <span className="adm-field__count">{address.length} / 120</span>
                </div>
                <div className="adm-field">
                  <label htmlFor="event-date-label">Datum als Text</label>
                  <input
                    id="event-date-label"
                    name="date_label"
                    value={dateLabel}
                    onChange={(event) => setDateLabel(event.target.value)}
                    placeholder="z. B. 17. Oktober 2026"
                  />
                  <span className="adm-field__hint">Optional – überschreibt die Datumsanzeige.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">3</span>
              <h2>Event-Details</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-field">
                <label>Disziplinen</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {EVENT_DISCIPLINES.map((discipline) => (
                    <label
                      key={discipline}
                      className="adm-chip"
                      style={{ cursor: "pointer", padding: "8px 12px", fontSize: 12.5 }}
                    >
                      <input
                        type="checkbox"
                        name={`discipline:${discipline}`}
                        defaultChecked={initial?.disciplines?.includes(discipline) ?? false}
                        style={{ accentColor: "var(--adm-red)" }}
                      />
                      {discipline}
                    </label>
                  ))}
                </div>
              </div>
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label htmlFor="event-ticket">Ticket-Link (optional)</label>
                  <input
                    id="event-ticket"
                    name="ticket_url"
                    type="url"
                    value={ticketUrl}
                    onChange={(event) => setTicketUrl(event.target.value)}
                    placeholder="https://…"
                    maxLength={255}
                  />
                  <span className="adm-field__count">{ticketUrl.length} / 255</span>
                </div>
                <div className="adm-field">
                  <label htmlFor="event-gastro">Gastro / Rahmenprogramm</label>
                  <input
                    id="event-gastro"
                    name="gastro"
                    defaultValue={initial?.gastro ?? ""}
                    placeholder="z. B. Getränke- und Foodstände vor Ort"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">4</span>
              <h2>Hero / Poster</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-grid-2" style={{ alignItems: "start" }}>
                <div className="adm-field">
                  <label htmlFor="event-image">Event-Bild / Poster</label>
                  <input
                    id="event-image"
                    name="image_path"
                    value={imagePath}
                    onChange={(event) => setImagePath(event.target.value)}
                    placeholder="/images/events/… oder Medien-URL"
                  />
                  <span className="adm-field__hint">JPG, PNG oder WebP. Empfohlen: 16:9 (z. B. 1920×1080 px).</span>
                </div>
                <div className="adm-field">
                  <label htmlFor="event-image-file">Neues Poster hochladen</label>
                  <input id="event-image-file" name="event_image_file" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" />
                  <span className="adm-field__hint">Max. 6 MB. Ein Upload ersetzt den gespeicherten Poster-Pfad beim Speichern.</span>
                  {imagePath ? (
                    <label className="adm-checkbox-line">
                      <input type="checkbox" name="clear_image_path" onChange={(event) => event.target.checked && setImagePath("")} />
                      Poster beim Speichern entfernen
                    </label>
                  ) : null}
                </div>
                <AdminImagePreview
                  src={imagePath}
                  alt="Event-Poster Vorschau"
                  fallback="Poster wird hier angezeigt"
                  aspectRatio="16 / 9"
                  sizes="360px"
                  className="adm-image-preview--field"
                />
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">5</span>
              <h2>Event-Galerie</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-field">
                <label htmlFor="event-gallery-files">Weitere Eventbilder hochladen</label>
                <input
                  id="event-gallery-files"
                  name="gallery_files"
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
                />
                <span className="adm-field__hint">Mehrere Bilder möglich, max. 6 MB pro Datei.</span>
              </div>

              {gallery.length > 0 ? (
                <div className="adm-gallery-admin" aria-label="Aktuelle Event-Galerie">
                  {gallery.map((image) => (
                    <article className="adm-gallery-admin__item" key={image.id}>
                      <AdminImagePreview
                        src={image.image_path}
                        alt={image.alt_text ?? "Event-Galeriebild"}
                        fallback="Galeriebild"
                        aspectRatio="16 / 10"
                        sizes="180px"
                        className="adm-image-preview--gallery"
                      />
                      <label className="adm-gallery-admin__remove">
                        <input type="checkbox" name="remove_gallery_ids" value={image.id} />
                        <span>Beim Speichern entfernen</span>
                      </label>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="adm-panel-empty">Noch keine zusätzlichen Eventbilder hinterlegt.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="adm-rail">
          <section className="adm-panel">
            <div className="adm-panel__head">
              <Eye aria-hidden="true" size={16} />
              <div className="adm-panel__head-text">
                <h2>Öffentliche Vorschau</h2>
                <p>So wird das Event auf der Website angezeigt.</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <div className="adm-preview">
                <AdminImagePreview
                  src={imagePath}
                  alt={`${name || "Event"} Poster`}
                  fallback="Poster wird hier angezeigt"
                  aspectRatio="16 / 9"
                  sizes="380px"
                  className="adm-preview__img"
                />
                <div className="adm-preview__body">
                  <Badge tone={statusMeta[status].tone} uppercase>
                    {statusMeta[status].label}
                  </Badge>
                  <h3>{name || "Event-Name"}</h3>
                  {subtitle ? <p className="adm-preview__sub">{subtitle}</p> : null}
                  <div className="adm-preview__meta">
                    <span>
                      <CalendarDays aria-hidden="true" size={14} /> {previewDate}
                    </span>
                    <span>
                      <Clock3 aria-hidden="true" size={14} /> Beginn: {startsAt || "–"} · Einlass: {admission || "–"}
                    </span>
                    <span>
                      <MapPin aria-hidden="true" size={14} /> {location || "Ort offen"}
                      {address ? `, ${address}` : ""}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <span className="adm-btn adm-btn--sm" aria-hidden="true">
                      <FileText aria-hidden="true" size={13} /> Event-Details
                    </span>
                    {ticketUrl ? (
                      <a
                        className="adm-btn adm-btn--primary adm-btn--sm"
                        href={ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink aria-hidden="true" size={13} /> Tickets sichern
                      </a>
                    ) : (
                      <span className="adm-btn adm-btn--primary adm-btn--sm" aria-hidden="true" style={{ opacity: 0.6 }}>
                        Tickets sichern
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="adm-preview__hintnote">
                Die Vorschau ist eine vereinfachte Darstellung. Das tatsächliche Design kann abweichen.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
