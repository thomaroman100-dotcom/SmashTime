import { Image as ImageIcon, Search, ShieldCheck, Upload, Wand2 } from "lucide-react";
import { MediaAssetCard, MediaUploadForm } from "@/components/admin/MediaManager";
import {
  type MediaAssetRow,
  deleteMediaAssetAction,
  updateMediaAssetAction,
  uploadMediaAction
} from "@/lib/admin/actions/media";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MEDIA_TYPES } from "@/lib/admin/resource-shared";
import { EmptyState, StatCard } from "@/components/admin/ui/primitives";

export const metadata = {
  title: "Medien | SmashTime Admin"
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; typ?: string; status?: string }>;
};

export default async function AdminMediaPage({ searchParams }: PageProps) {
  const { q, typ, status } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let assets: MediaAssetRow[] = [];
  let loadError: string | null = null;

  if (!supabase) {
    loadError = "Supabase ist nicht konfiguriert.";
  } else {
    const { data, error } = await supabase
      .from("media_assets")
      .select("id, bucket, path, asset_type, alt_text, usage_note, is_public, is_checked, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      loadError = `Medien konnten nicht geladen werden: ${error.message}`;
    } else {
      assets = (data ?? []) as MediaAssetRow[];
    }
  }

  const total = assets.length;
  const checked = assets.filter((asset) => asset.is_checked).length;
  const publicAssets = assets.filter((asset) => asset.is_public).length;
  const unused = assets.filter((asset) => !asset.usage_note).length;

  const query = (q ?? "").trim().toLowerCase();
  const filtered = assets.filter((asset) => {
    if (query && !`${asset.path} ${asset.alt_text ?? ""} ${asset.usage_note ?? ""}`.toLowerCase().includes(query)) {
      return false;
    }
    if (typ && asset.asset_type !== typ) {
      return false;
    }
    if (status === "public" && !asset.is_public) {
      return false;
    }
    if (status === "checked" && !asset.is_checked) {
      return false;
    }
    if (status === "unchecked" && asset.is_checked) {
      return false;
    }
    return true;
  });

  const publicUrlFor = (asset: MediaAssetRow) => {
    if (!supabase) {
      return "";
    }
    return supabase.storage.from(asset.bucket).getPublicUrl(asset.path).data.publicUrl;
  };

  return (
    <div>
      <div className="adm-head">
        <div>
          <h1>Medien</h1>
          <p>Verwalte Bilder, Eventposter, Sponsorlogos und Newsbilder zentral an einem Ort.</p>
        </div>
      </div>

      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>{loadError}</strong>
        </div>
      ) : null}

      <section className="adm-stats" aria-label="Medien-Kennzahlen">
        <StatCard icon={ImageIcon} tone="red" label="Alle Medien" value={total} detail="Assets insgesamt" />
        <StatCard icon={ShieldCheck} tone="green" label="Geprüft" value={checked} detail="Freigegebene Assets" />
        <StatCard icon={Upload} tone="blue" label="Öffentlich" value={publicAssets} detail="Public Storage URLs" />
        <StatCard icon={Wand2} tone="orange" label="Ohne Verwendung" value={unused} detail="Usage Note leer" />
      </section>

      <div className="adm-cols adm-cols--main-rail">
        <section>
          <form className="adm-panel adm-toolbar" method="get" action="/admin/media" style={{ marginBottom: 16 }}>
            <div className="adm-search">
              <Search aria-hidden="true" size={16} />
              <input type="search" name="q" defaultValue={q ?? ""} placeholder="Medien suchen…" aria-label="Medien suchen" />
            </div>
            <div className="adm-filter">
              <span>Typ</span>
              <select name="typ" defaultValue={typ ?? ""}>
                <option value="">Alle Typen</option>
                {MEDIA_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="adm-filter">
              <span>Status</span>
              <select name="status" defaultValue={status ?? ""}>
                <option value="">Alle Status</option>
                <option value="public">Öffentlich</option>
                <option value="checked">Geprüft</option>
                <option value="unchecked">Ungeprüft</option>
              </select>
            </div>
            <button className="adm-btn" type="submit">
              Filtern
            </button>
          </form>

          {filtered.length === 0 ? (
            <section className="adm-panel">
              <EmptyState
                icon={ImageIcon}
                title={assets.length === 0 ? "Noch keine Medien hochgeladen" : "Keine Treffer"}
                description={
                  assets.length === 0
                    ? "Lade das erste Bild über das Upload-Panel hoch."
                    : "Für die aktuelle Suche/Filter gibt es keine Medien."
                }
              />
            </section>
          ) : (
            <section className="adm-media-grid">
              {filtered.map((asset) => (
                <MediaAssetCard
                  key={asset.id}
                  asset={asset}
                  publicUrl={publicUrlFor(asset)}
                  updateAction={updateMediaAssetAction.bind(null, asset.id)}
                  deleteAction={deleteMediaAssetAction.bind(null, asset.id)}
                />
              ))}
            </section>
          )}
        </section>

        <aside className="adm-rail">
          <MediaUploadForm action={uploadMediaAction} />
        </aside>
      </div>
    </div>
  );
}
