"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { ArrowLeft, Eye, Image as ImageIcon, Loader2, Rocket, Save } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import type { NewsRow, NewsStatus } from "@/lib/admin/actions/news";
import { NEWS_CATEGORIES } from "@/lib/admin/resource-shared";
import { slugify } from "@/lib/slug";
import { useAdminUi } from "@/components/admin/ui/AdminUiProvider";
import { Badge } from "@/components/admin/ui/primitives";

type NewsFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  initial?: NewsRow | null;
  heading: string;
  subheading: string;
};

const statusMeta: Record<NewsStatus, { label: string; tone: "gray" | "green" | "red" }> = {
  draft: { label: "Entwurf", tone: "gray" },
  published: { label: "Veröffentlicht", tone: "green" },
  archived: { label: "Archiviert", tone: "red" }
};

export function NewsForm({ action, initial, heading, subheading }: NewsFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const ui = useAdminUi();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [category, setCategory] = useState(initial?.category ?? "Neuigkeit");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body?.join("\n\n") ?? "");
  const [imagePath, setImagePath] = useState(initial?.image_path ?? "");
  const [heroImagePath, setHeroImagePath] = useState(initial?.hero_image_path ?? "");
  const [status, setStatus] = useState<NewsStatus>(initial?.status ?? "draft");

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
          <Link className="adm-head__back" href="/admin/news">
            <ArrowLeft aria-hidden="true" size={14} /> Neuigkeiten
          </Link>
          <h1>{heading}</h1>
          <p>{subheading}</p>
        </div>
        <div className="adm-head__actions">
          <Link
            className="adm-btn"
            href={initial ? `/neuigkeiten/${initial.slug}` : "/neuigkeiten"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Eye aria-hidden="true" size={16} /> Vorschau
          </Link>
          <button className="adm-btn" type="submit" disabled={pending} onClick={() => setStatus("draft")}>
            {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : <Save aria-hidden="true" size={16} />}
            Entwurf speichern
          </button>
          <button className="adm-btn adm-btn--primary" type="submit" disabled={pending} onClick={() => setStatus("published")}>
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

      <input type="hidden" name="status" value={status} readOnly />

      <div className="adm-cols adm-cols--form">
        <div>
          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">1</span>
              <h2>Titel &amp; Slug</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label htmlFor="news-title">
                    Titel <em>*</em>
                  </label>
                  <input
                    id="news-title"
                    name="title"
                    required
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      if (!slugTouched) {
                        setSlug(slugify(event.target.value));
                      }
                    }}
                    placeholder="Titel des Beitrags"
                  />
                </div>
                <div className="adm-field">
                  <label htmlFor="news-slug">Slug</label>
                  <input
                    id="news-slug"
                    name="slug"
                    value={slug}
                    onChange={(event) => {
                      setSlug(event.target.value);
                      setSlugTouched(true);
                    }}
                    placeholder="wird aus dem Titel erzeugt"
                  />
                  <span className="adm-field__hint">Nur Kleinbuchstaben, Zahlen und Bindestriche.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">2</span>
              <h2>Kategorie &amp; Status</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label htmlFor="news-category">Kategorie</label>
                  <select id="news-category" name="category" value={category} onChange={(event) => setCategory(event.target.value)}>
                    {NEWS_CATEGORIES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="adm-field">
                  <label htmlFor="news-status-select">Status</label>
                  <select id="news-status-select" value={status} onChange={(event) => setStatus(event.target.value as NewsStatus)}>
                    <option value="draft">Entwurf</option>
                    <option value="published">Veröffentlicht</option>
                    <option value="archived">Archiviert</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">3</span>
              <h2>Kurzbeschreibung</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-field">
                <label htmlFor="news-excerpt">Teaser</label>
                <textarea
                  id="news-excerpt"
                  name="excerpt"
                  rows={3}
                  maxLength={220}
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  placeholder="Kurzer Anrisstext für Karten und Übersichten"
                />
                <span className="adm-field__count">{excerpt.length} / 220</span>
              </div>
            </div>
          </section>

          <section className="adm-fsection">
            <div className="adm-fsection__head">
              <span className="adm-num">4</span>
              <h2>Artikelinhalt</h2>
            </div>
            <div className="adm-fsection__body">
              <div className="adm-field">
                <label htmlFor="news-body">Inhalt</label>
                <textarea
                  id="news-body"
                  name="body"
                  rows={12}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Absätze durch Leerzeile trennen."
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="adm-rail">
          <section className="adm-panel">
            <div className="adm-panel__head">
              <ImageIcon aria-hidden="true" size={16} />
              <div className="adm-panel__head-text">
                <h2>Titelbild / Upload</h2>
                <p>Bilder können als Pfad eingetragen oder direkt hochgeladen werden.</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <div className="adm-field">
                <label htmlFor="news-image">Bildpfad (Karte)</label>
                <input
                  id="news-image"
                  name="image_path"
                  value={imagePath}
                  onChange={(event) => setImagePath(event.target.value)}
                  placeholder="/images/news/… oder Medien-URL"
                />
              </div>
              <div className="adm-field">
                <label htmlFor="news-image-file">Beitragsbild hochladen</label>
                <input id="news-image-file" name="news_image_file" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" />
                <span className="adm-field__hint">Max. 6 MB. Ersetzt den Bildpfad beim Speichern.</span>
              </div>
              <div className="adm-field">
                <label htmlFor="news-hero">Hero-Bildpfad</label>
                <input
                  id="news-hero"
                  name="hero_image_path"
                  value={heroImagePath}
                  onChange={(event) => setHeroImagePath(event.target.value)}
                  placeholder="optional"
                />
              </div>
              <div className="adm-field">
                <label htmlFor="news-hero-file">Hero-Bild hochladen</label>
                <input id="news-hero-file" name="news_hero_image_file" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" />
              </div>
            </div>
          </section>

          <section className="adm-panel">
            <div className="adm-panel__head">
              <Eye aria-hidden="true" size={16} />
              <div className="adm-panel__head-text">
                <h2>Öffentliche Vorschau</h2>
                <p>So wird die Neuigkeit für die Öffentlichkeit aussehen.</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <div className="adm-preview">
                <div className="adm-preview__img">
                  {imagePath || heroImagePath ? (
                    <Image src={heroImagePath || imagePath} alt="" fill sizes="380px" style={{ objectFit: "cover" }} unoptimized />
                  ) : (
                    <span className="adm-thumb--empty" style={{ display: "flex", height: "100%", flexDirection: "column", gap: 8 }}>
                      <ImageIcon aria-hidden="true" size={26} />
                      Titelbild fehlt
                    </span>
                  )}
                </div>
                <div className="adm-preview__body">
                  <Badge tone={statusMeta[status].tone} uppercase>
                    {statusMeta[status].label}
                  </Badge>
                  <span className="adm-preview__kicker">{category}</span>
                  <h3>{title || "Titel der Neuigkeit"}</h3>
                  <p>{excerpt || "Kurzbeschreibung wird hier angezeigt."}</p>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
