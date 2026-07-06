"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { ArrowLeft, Eye, Image as ImageIcon, Loader2, Save } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import type { SponsorRow } from "@/lib/admin/actions/sponsors";
import { SPONSOR_PACKAGES } from "@/lib/admin/resource-shared";
import { useAdminUi } from "@/components/admin/ui/AdminUiProvider";
import { Badge } from "@/components/admin/ui/primitives";

type SponsorFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  initial?: SponsorRow | null;
  heading: string;
  subheading: string;
};

export function SponsorForm({ action, initial, heading, subheading }: SponsorFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const ui = useAdminUi();

  const [name, setName] = useState(initial?.name ?? "");
  const [logoPath, setLogoPath] = useState(initial?.logo_path ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(initial?.website_url ?? "");
  const [packageName, setPackageName] = useState(initial?.package_name ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

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

  return (
    <form action={formAction}>
      <div className="adm-head">
        <div>
          <Link className="adm-head__back" href="/admin/sponsors">
            <ArrowLeft aria-hidden="true" size={14} /> Sponsoren
          </Link>
          <h1>{heading}</h1>
          <p>{subheading}</p>
        </div>
        <div className="adm-head__actions">
          <Link className="adm-btn" href="/sponsoren" target="_blank" rel="noopener noreferrer">
            <Eye aria-hidden="true" size={16} /> Vorschau
          </Link>
          <button className="adm-btn adm-btn--primary" type="submit" disabled={pending}>
            {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : <Save aria-hidden="true" size={16} />}
            Änderungen speichern
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
                  <label htmlFor="sponsor-name">
                    Sponsor Name <em>*</em>
                  </label>
                  <input id="sponsor-name" name="name" required value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div className="adm-field">
                  <label htmlFor="sponsor-package">Paket</label>
                  <select id="sponsor-package" name="package_name" value={packageName} onChange={(event) => setPackageName(event.target.value)}>
                    <option value="">Kein Paket zugewiesen</option>
                    {SPONSOR_PACKAGES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label htmlFor="sponsor-website">Website</label>
                  <input
                    id="sponsor-website"
                    name="website_url"
                    type="url"
                    value={websiteUrl}
                    onChange={(event) => setWebsiteUrl(event.target.value)}
                    placeholder="https://…"
                  />
                </div>
                <div className="adm-field">
                  <label htmlFor="sponsor-sort">Reihenfolge</label>
                  <input
                    id="sponsor-sort"
                    name="sort_order"
                    type="number"
                    value={sortOrder}
                    onChange={(event) => setSortOrder(Number.parseInt(event.target.value, 10) || 0)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">2</span>
              <h2>Logo &amp; Medien</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label htmlFor="sponsor-logo">Logo-Pfad</label>
                  <input
                    id="sponsor-logo"
                    name="logo_path"
                    value={logoPath}
                    onChange={(event) => setLogoPath(event.target.value)}
                    placeholder="/images/sponsors/… oder Medien-URL"
                  />
                </div>
                <div className="adm-field">
                  <label htmlFor="sponsor-logo-file">Logo hochladen</label>
                  <input id="sponsor-logo-file" name="sponsor_logo_file" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" />
                  <span className="adm-field__hint">Max. 6 MB. Ersetzt den Logo-Pfad beim Speichern.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">3</span>
              <h2>Sichtbarkeit</h2>
            </div>
            <div className="adm-fsection__body">
              <label className="adm-switch-row" htmlFor="sponsor-active">
                <span>
                  <strong>Aktiv</strong>
                  <p>Sponsor öffentlich auf der Website anzeigen.</p>
                </span>
                <span className="adm-switch">
                  <input id="sponsor-active" name="is_active" type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
                  <i />
                </span>
              </label>
            </div>
          </section>
        </div>

        <aside className="adm-rail">
          <section className="adm-panel">
            <div className="adm-panel__head">
              <Eye aria-hidden="true" size={16} />
              <div className="adm-panel__head-text">
                <h2>Öffentliche Vorschau</h2>
                <p>So wird der Sponsor auf der Website angezeigt.</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <div className="adm-preview">
                <div className="adm-preview__img" style={{ aspectRatio: "16 / 9" }}>
                  {logoPath ? (
                    <Image src={logoPath} alt="" fill sizes="380px" style={{ objectFit: "contain", padding: 28 }} unoptimized />
                  ) : (
                    <span className="adm-thumb--empty" style={{ display: "flex", height: "100%", flexDirection: "column", gap: 8 }}>
                      <ImageIcon aria-hidden="true" size={26} />
                      Logo fehlt
                    </span>
                  )}
                </div>
                <div className="adm-preview__body">
                  <Badge tone={isActive ? "green" : "gray"} uppercase>
                    {isActive ? "Aktiv" : "Inaktiv"}
                  </Badge>
                  {packageName ? <span className="adm-preview__kicker">{packageName}</span> : null}
                  <h3>{name || "Sponsor Name"}</h3>
                  {websiteUrl ? <p>{websiteUrl}</p> : <p>Website-Link nicht hinterlegt.</p>}
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
