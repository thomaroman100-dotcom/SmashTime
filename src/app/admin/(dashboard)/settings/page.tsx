import { Save } from "lucide-react";
import { adminSettings } from "@/data/admin";

export const metadata = {
  title: "Einstellungen | SmashTime Admin"
};

export default function AdminSettingsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Einstellungen</h1>
          <p>Globale Links, Kontaktangaben, CTA-Ziele und Social-Werte pflegen.</p>
        </div>
      </div>

      <form className="admin-panel admin-form">
        <h2>Website-Einstellungen</h2>
        {adminSettings.map((setting) => (
          <label key={setting.label}>
            {setting.label}
            <input defaultValue={setting.value} />
          </label>
        ))}
        <button className="admin-red-button" type="button">
          <Save aria-hidden="true" size={18} /> Einstellungen speichern
        </button>
      </form>
    </div>
  );
}
