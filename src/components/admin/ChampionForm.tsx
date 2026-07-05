"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import {
  ArrowLeft,
  Award,
  FileText,
  Image as ImageIcon,
  Loader2,
  Save,
  Settings2,
  UserRound
} from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import type { ChampionRow } from "@/lib/admin/actions/champions";
import { useAdminUi } from "@/components/admin/ui/AdminUiProvider";
import { Badge } from "@/components/admin/ui/primitives";

type ChampionFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  initial?: ChampionRow | null;
  heading: string;
  subheading: string;
};

export function ChampionForm({ action, initial, heading, subheading }: ChampionFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const ui = useAdminUi();

  const [name, setName] = useState(initial?.name ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [weightClass, setWeightClass] = useState(initial?.weight_class ?? "");
  const [record, setRecord] = useState(initial?.record ?? "");
  const [origin, setOrigin] = useState(initial?.origin ?? "");
  const [imagePath, setImagePath] = useState(initial?.image_path ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.ok) {
      ui.toast("success", "Erfolg", state.message);
    } else {
      ui.toast("error", "Fehler", state.error);
    }
  }, [state, ui]);

  return (
    <form action={formAction}>
      <div className="adm-head">
        <div>
          <Link className="adm-head__back" href="/admin/champions">
            <ArrowLeft aria-hidden="true" size={14} /> Champions
          </Link>
          <h1>{heading}</h1>
          <p>{subheading}</p>
        </div>
        <div className="adm-head__actions">
          <Link className="adm-btn" href="/admin/champions">
            Zurück zur Übersicht
          </Link>
          <button className="adm-btn adm-btn--primary" type="submit" disabled={pending}>
            {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : <Save aria-hidden="true" size={16} />}
            {pending ? "Speichert…" : "Änderungen speichern"}
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
                  <label htmlFor="champion-name">
                    Name <em>*</em>
                  </label>
                  <input
                    id="champion-name"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Vor- und Nachname"
                    required
                  />
                </div>
                <div className="adm-field">
                  <label htmlFor="champion-slug">Slug (URL)</label>
                  <input id="champion-slug" name="slug" defaultValue={initial?.slug ?? ""} placeholder="wird aus dem Namen erzeugt" />
                  <span className="adm-field__hint">Nur Kleinbuchstaben, Zahlen und Bindestriche.</span>
                </div>
              </div>
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label htmlFor="champion-origin">Herkunft</label>
                  <input
                    id="champion-origin"
                    name="origin"
                    value={origin}
                    onChange={(event) => setOrigin(event.target.value)}
                    placeholder="z. B. Österreich"
                  />
                </div>
                <div className="adm-field">
                  <label htmlFor="champion-age">Alter</label>
                  <input id="champion-age" name="age" defaultValue={initial?.age ?? ""} placeholder="z. B. 27" />
                </div>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">2</span>
              <h2>Titel & Kampfdaten</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label htmlFor="champion-title">Titel</label>
                  <input
                    id="champion-title"
                    name="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="z. B. SmashTime Champion"
                  />
                </div>
                <div className="adm-field">
                  <label htmlFor="champion-record">Bilanz</label>
                  <input
                    id="champion-record"
                    name="record"
                    value={record}
                    onChange={(event) => setRecord(event.target.value)}
                    placeholder="z. B. 12-2-0"
                  />
                </div>
              </div>
              <div className="adm-grid-3">
                <div className="adm-field">
                  <label htmlFor="champion-weight-class">Gewichtsklasse</label>
                  <input
                    id="champion-weight-class"
                    name="weight_class"
                    value={weightClass}
                    onChange={(event) => setWeightClass(event.target.value)}
                    placeholder="z. B. Mittelgewicht"
                  />
                </div>
                <div className="adm-field">
                  <label htmlFor="champion-weight">Gewicht</label>
                  <input id="champion-weight" name="weight" defaultValue={initial?.weight ?? ""} placeholder="z. B. 84 kg" />
                </div>
                <div className="adm-field">
                  <label htmlFor="champion-stance">Auslage</label>
                  <input id="champion-stance" name="stance" defaultValue={initial?.stance ?? ""} placeholder="z. B. Orthodox" />
                </div>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">3</span>
              <h2>Profiltexte</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-field">
                <label htmlFor="champion-quote">Zitat</label>
                <input id="champion-quote" name="quote" defaultValue={initial?.quote ?? ""} placeholder="Kurzes Statement des Champions" />
              </div>
              <div className="adm-field">
                <label htmlFor="champion-bio">Biografie</label>
                <textarea id="champion-bio" name="bio" rows={6} defaultValue={initial?.bio ?? ""} placeholder="Werdegang, Erfolge, Besonderheiten…" />
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">4</span>
              <h2>Foto</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-field">
                <label htmlFor="champion-image">Bildpfad</label>
                <input
                  id="champion-image"
                  name="image_path"
                  value={imagePath}
                  onChange={(event) => setImagePath(event.target.value)}
                  placeholder="/images/champions/… oder Medien-URL"
                />
                <span className="adm-field__hint">Empfohlen: Hochformat, mindestens 800 px Breite.</span>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">5</span>
              <h2>Sichtbarkeit & Reihenfolge</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-grid-2">
                <label className="adm-switch-row" htmlFor="champion-active">
                  <span>
                    <strong>
                      <Settings2 aria-hidden="true" size={15} /> Aktiv
                    </strong>
                    <p>Champion auf der Website anzeigen.</p>
                  </span>
                  <span className="adm-switch">
                    <input
                      id="champion-active"
                      type="checkbox"
                      name="is_active"
                      checked={isActive}
                      onChange={(event) => setIsActive(event.target.checked)}
                    />
                    <i />
                  </span>
                </label>
                <div className="adm-field">
                  <label htmlFor="champion-sort">Reihenfolge (Sortierung)</label>
                  <input id="champion-sort" type="number" name="sort_order" defaultValue={initial?.sort_order ?? 0} />
                  <span className="adm-field__hint">Kleinere Zahlen werden zuerst angezeigt.</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="adm-rail">
          <section className="adm-panel">
            <div className="adm-panel__head">
              <FileText aria-hidden="true" size={16} />
              <div className="adm-panel__head-text">
                <h2>Öffentliche Vorschau</h2>
                <p>So wird der Champion auf der Website angezeigt.</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <div className="adm-preview">
                <div className="adm-preview__img" style={{ aspectRatio: "4 / 5" }}>
                  {imagePath ? (
                    <Image src={imagePath} alt="" fill sizes="380px" style={{ objectFit: "cover" }} unoptimized />
                  ) : (
                    <span
                      className="adm-thumb--empty"
                      style={{ display: "flex", height: "100%", flexDirection: "column", gap: 8 }}
                    >
                      <ImageIcon aria-hidden="true" size={26} />
                      Foto wird hier angezeigt
                    </span>
                  )}
                </div>
                <div className="adm-preview__body">
                  <span className="adm-preview__kicker">{weightClass || "Gewichtsklasse"}</span>
                  <h3>{name || "Champion Name"}</h3>
                  {title ? (
                    <p style={{ display: "flex", gap: 6, alignItems: "center", color: "var(--adm-gold)", fontWeight: 700 }}>
                      <Award aria-hidden="true" size={15} /> {title}
                    </p>
                  ) : (
                    <p>Noch kein Titel hinterlegt.</p>
                  )}
                  <div className="adm-preview__meta">
                    <span>
                      <UserRound aria-hidden="true" size={14} /> {origin || "Herkunft offen"}
                    </span>
                    {record ? <span>Bilanz: {record}</span> : null}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Badge tone={isActive ? "green" : "gray"} uppercase>
                      {isActive ? "Aktiv" : "Inaktiv"}
                    </Badge>
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
