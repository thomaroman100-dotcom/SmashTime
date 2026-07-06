"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, UserPlus } from "lucide-react";
import { site } from "@/data/site";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type PublicAuthFormProps = {
  mode: "login" | "register";
};

export function PublicAuthForm({ mode }: PublicAuthFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [profileType, setProfileType] = useState<"fighter" | "staff">("fighter");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase ist noch nicht konfiguriert.");
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage("Login fehlgeschlagen. Prüfe E-Mail und Passwort.");
        setLoading(false);
        return;
      }
      router.push("/account");
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          profile_type: profileType
        }
      }
    });

    if (error) {
      setMessage(`Registrierung fehlgeschlagen: ${error.message}`);
      setLoading(false);
      return;
    }

    setMessage("Registrierung eingegangen. Dein Profil wartet jetzt auf Freigabe.");
    setLoading(false);
  };

  const sendMagicLink = async () => {
    setMessage("");
    if (!email) {
      setMessage("Bitte zuerst deine E-Mail-Adresse eingeben.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase ist noch nicht konfiguriert.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/account`
      }
    });
    setLoading(false);

    if (error) {
      setMessage(`Login-Link konnte nicht gesendet werden: ${error.message}`);
      return;
    }

    setMessage("Login-Link gesendet. Bitte prüfe dein E-Mail-Postfach.");
  };

  const isRegister = mode === "register";

  return (
    <section className="public-auth">
      <form className="public-auth__panel" onSubmit={submit}>
        <Image src={site.logo} alt="SmashTime" width={210} height={70} priority />
        <div>
          <span className="public-auth__kicker">{isRegister ? "Mitglied werden" : "Profilzugang"}</span>
          <h1>{isRegister ? "Registrieren" : "Einloggen"}</h1>
          <p>
            {isRegister
              ? "Erstelle dein Profil. Nach der Freigabe erscheint ein Kämpferprofil in den Admin-Auswahlfeldern."
              : "Melde dich mit deinem SmashTime-Profil an."}
          </p>
        </div>

        {isRegister ? (
          <>
            <label>
              Anzeigename
              <input
                autoComplete="name"
                name="display_name"
                required
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </label>
            <label>
              Profiltyp
              <select value={profileType} onChange={(event) => setProfileType(event.target.value as "fighter" | "staff")}>
                <option value="fighter">Mitglied (Kämpfer)</option>
                <option value="staff">Mitglied (Mitarbeiter)</option>
              </select>
            </label>
          </>
        ) : null}

        <label>
          E-Mail
          <input autoComplete="email" name="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Passwort
          <input
            autoComplete={isRegister ? "new-password" : "current-password"}
            name="password"
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {message ? <p className="public-auth__message" role="status">{message}</p> : null}

        <button type="submit" disabled={loading}>
          {isRegister ? <UserPlus aria-hidden="true" size={18} /> : <LogIn aria-hidden="true" size={18} />}
          {loading ? "Bitte warten" : isRegister ? "Registrierung senden" : "Einloggen"}
        </button>

        {!isRegister ? (
          <button className="public-auth__secondary" type="button" disabled={loading} onClick={sendMagicLink}>
            <Mail aria-hidden="true" size={18} />
            Login-Link per E-Mail senden
          </button>
        ) : null}

        <p className="public-auth__switch">
          {isRegister ? "Du hast bereits ein Profil?" : "Noch kein Profil?"}{" "}
          <Link href={isRegister ? "/login" : "/register"}>{isRegister ? "Einloggen" : "Registrieren"}</Link>
        </p>
      </form>
    </section>
  );
}
