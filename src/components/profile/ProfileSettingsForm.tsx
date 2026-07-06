"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import type { SessionProfile } from "@/lib/admin/auth";

type ProfileSettingsFormProps = {
  profile: SessionProfile;
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
};

export function ProfileSettingsForm({ profile, action }: ProfileSettingsFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const isFighter = profile.profileType === "fighter";

  return (
    <form className="account-settings-form" action={formAction}>
      <div className="account-settings-form__grid">
        <label>
          Anzeigename
          <input
            name="display_name"
            defaultValue={profile.displayName}
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
          />
        </label>
        <label>
          Profilbild-URL
          <input
            name="avatar_url"
            defaultValue={profile.avatarUrl ?? ""}
            type="url"
            placeholder="https://..."
            autoComplete="url"
          />
        </label>
        {isFighter ? (
          <>
            <label>
              Kampfname
              <input name="nickname" defaultValue={profile.fighter?.nickname ?? ""} maxLength={80} />
            </label>
            <label>
              Herkunft / Gym
              <input name="origin" defaultValue={profile.fighter?.origin ?? ""} maxLength={120} />
            </label>
            <label className="account-settings-form__wide">
              Öffentliche Profilnotiz
              <textarea name="public_bio" defaultValue={profile.fighter?.publicBio ?? ""} maxLength={500} rows={5} />
            </label>
          </>
        ) : null}
      </div>

      {state ? (
        <p className={state.ok ? "account-page__message account-page__message--success" : "account-page__message"}>
          {state.ok ? state.message : state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending}>
        <Save aria-hidden="true" size={18} />
        {pending ? "Speichert" : "Profil speichern"}
      </button>
    </form>
  );
}
