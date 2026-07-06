"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { site } from "@/data/site";

type AdminLoginFormProps = {
  status?: string;
};

const statusMessages: Record<string, string> = {
  "missing-config": "Supabase ist noch nicht konfiguriert. Admin-Login ist gesperrt.",
  unauthenticated: "Bitte melde dich an, um den Adminbereich zu öffnen.",
  forbidden: "Dein Konto ist nicht freigeschaltet oder hat keine Berechtigung für diesen Adminbereich."
};

export function AdminLoginForm({ status }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(status ? statusMessages[status] : "");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage(statusMessages["missing-config"]);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage("Login fehlgeschlagen. Prüfe E-Mail, Passwort und deine Freigabe.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <section className="admin-login">
      <div className="admin-login__panel">
        <Image src={site.logo} alt="SmashTime" width={216} height={72} priority />
        <div>
          <h1>Admin-Anmeldung</h1>
          <p>Inhalte, Veranstaltungen, Medien und Anfragen verwalten.</p>
        </div>
        <form onSubmit={submit}>
          <label>
            E-Mail
            <input
              autoComplete="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label>
            Passwort
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {message ? <p className="admin-login__message">{message}</p> : null}
          <button disabled={loading} type="submit">
            <LogIn aria-hidden="true" size={18} />
            {loading ? "Anmeldung läuft" : "Einloggen"}
          </button>
        </form>
      </div>
    </section>
  );
}
