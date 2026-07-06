"use client";

import { useActionState, useEffect, useTransition } from "react";
import { Loader2, Save, Trash2, Upload } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import type { MediaAssetRow } from "@/lib/admin/actions/media";
import { MEDIA_TYPES } from "@/lib/admin/resource-shared";
import { useAdminUi } from "@/components/admin/ui/AdminUiProvider";
import { AdminImagePreview } from "@/components/admin/ui/AdminImagePreview";
import { Badge } from "@/components/admin/ui/primitives";

type UploadAction = (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
type UpdateAction = (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;

type MediaUploadFormProps = {
  action: UploadAction;
};

export function MediaUploadForm({ action }: MediaUploadFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const ui = useAdminUi();

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.ok) {
      ui.toast("success", "Erfolg", state.message);
    } else {
      ui.toast("error", "Fehler beim Upload", state.error);
    }
  }, [state, ui]);

  return (
    <form className="adm-panel" action={formAction}>
      <div className="adm-panel__head">
        <Upload aria-hidden="true" size={17} />
        <div className="adm-panel__head-text">
          <h2>Datei hochladen</h2>
          <p>Bilder in den SmashTime-Speicher laden und direkt katalogisieren.</p>
        </div>
      </div>
      <div className="adm-panel__body">
        <div className="adm-field">
          <label htmlFor="media-file">
            Bilddatei <em>*</em>
          </label>
          <input id="media-file" name="file" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" required />
          <span className="adm-field__hint">PNG, JPG, WebP, AVIF oder SVG. Max. 6 MB.</span>
        </div>
        <div className="adm-grid-2">
          <div className="adm-field">
            <label htmlFor="media-type">Asset-Typ</label>
            <select id="media-type" name="asset_type" defaultValue="Sonstiges">
              {MEDIA_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="adm-field">
            <label htmlFor="media-alt">Alt-Text</label>
            <input id="media-alt" name="alt_text" placeholder="Beschreibung für Screenreader" />
          </div>
        </div>
        <div className="adm-field">
          <label htmlFor="media-usage">Verwendung</label>
          <input id="media-usage" name="usage_note" placeholder="z. B. Event-Poster, Sponsor-Logo, Newsbild" />
        </div>
        <div className="adm-grid-2">
          <label className="adm-switch-row" htmlFor="media-public">
            <span>
              <strong>Öffentlich</strong>
              <p>Asset darf öffentlich ausgeliefert werden.</p>
            </span>
            <span className="adm-switch">
              <input id="media-public" name="is_public" type="checkbox" defaultChecked />
              <i />
            </span>
          </label>
          <label className="adm-switch-row" htmlFor="media-checked">
            <span>
              <strong>Geprüft</strong>
              <p>Keine falschen Fighter oder Fremddaten.</p>
            </span>
            <span className="adm-switch">
              <input id="media-checked" name="is_checked" type="checkbox" />
              <i />
            </span>
          </label>
        </div>
      </div>
      <div className="adm-panel__footer">
        <button className="adm-btn adm-btn--primary" type="submit" disabled={pending}>
          {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : <Upload aria-hidden="true" size={16} />}
          Hochladen
        </button>
      </div>
    </form>
  );
}

type MediaAssetCardProps = {
  asset: MediaAssetRow;
  publicUrl: string;
  updateAction: UpdateAction;
  deleteAction: () => Promise<ActionResult>;
};

export function MediaAssetCard({ asset, publicUrl, updateAction, deleteAction }: MediaAssetCardProps) {
  const [state, formAction, pending] = useActionState(updateAction, null);
  const [deletePending, startDeleteTransition] = useTransition();
  const ui = useAdminUi();

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

  const remove = async () => {
    const confirmed = await ui.confirm({
      title: "Asset löschen?",
      message: "Die Datei wird aus der Medienbibliothek und aus dem Storage-Bucket entfernt.",
      itemLabel: asset.path,
      itemMeta: asset.asset_type
    });
    if (!confirmed) {
      return;
    }
    startDeleteTransition(async () => {
      const result = await deleteAction();
      if (result.ok) {
        ui.toast("success", "Erfolg", result.message);
      } else {
        ui.toast("error", "Fehler beim Löschen", result.error);
      }
    });
  };

  return (
    <article className="adm-media-card">
      <AdminImagePreview
        src={publicUrl}
        alt={asset.alt_text ?? asset.path}
        fallback="Medienbild"
        aspectRatio="16 / 10"
        sizes="(max-width: 720px) 100vw, 260px"
        className="adm-media-card__img"
      />
      <form className="adm-media-card__body" action={formAction}>
        <strong>{asset.path}</strong>
        <small>{asset.created_at ? new Intl.DateTimeFormat("de-AT").format(new Date(asset.created_at)) : "Datum offen"}</small>
        <div className="adm-media-card__badges">
          <Badge tone={asset.is_public ? "green" : "gray"}>{asset.is_public ? "Öffentlich" : "Privat"}</Badge>
          <Badge tone={asset.is_checked ? "green" : "orange"}>{asset.is_checked ? "Geprüft" : "Ungeprüft"}</Badge>
          <Badge tone="blue">{asset.asset_type}</Badge>
        </div>
        <div className="adm-field">
          <label htmlFor={`media-type-${asset.id}`}>Asset-Typ</label>
          <select id={`media-type-${asset.id}`} name="asset_type" defaultValue={asset.asset_type}>
            {MEDIA_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor={`media-alt-${asset.id}`}>Alt-Text</label>
          <input id={`media-alt-${asset.id}`} name="alt_text" defaultValue={asset.alt_text ?? ""} placeholder="Beschreibung" />
        </div>
        <div className="adm-field">
          <label htmlFor={`media-usage-${asset.id}`}>Verwendung</label>
          <input id={`media-usage-${asset.id}`} name="usage_note" defaultValue={asset.usage_note ?? ""} placeholder="Einsatzort" />
        </div>
        <div className="adm-grid-2">
          <label className="adm-checkbox-line">
            <input name="is_public" type="checkbox" defaultChecked={asset.is_public} /> Öffentlich
          </label>
          <label className="adm-checkbox-line">
            <input name="is_checked" type="checkbox" defaultChecked={asset.is_checked} /> Geprüft
          </label>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button className="adm-btn adm-btn--primary adm-btn--sm" type="submit" disabled={pending}>
            {pending ? <Loader2 aria-hidden="true" size={14} className="adm-spin" /> : <Save aria-hidden="true" size={14} />}
            Speichern
          </button>
          <button className="adm-btn adm-btn--danger adm-btn--sm" type="button" disabled={deletePending} onClick={remove}>
            {deletePending ? <Loader2 aria-hidden="true" size={14} className="adm-spin" /> : <Trash2 aria-hidden="true" size={14} />}
            Löschen
          </button>
        </div>
      </form>
    </article>
  );
}
