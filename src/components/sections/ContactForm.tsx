"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const requestTypes = ["Sponsoring", "Presse", "Kämpfer", "Allgemein"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const limits = {
  name: 80,
  email: 120,
  subject: 120,
  message: 1500
};

type ContactStatus = {
  kind: "success" | "error";
  text: string;
};

function field(formData: FormData, name: string, maxLength: number) {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, maxLength);
}

export function ContactForm() {
  const [requestType, setRequestType] = useState("Allgemein");
  const [status, setStatus] = useState<ContactStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setStatus(null);

    const formData = new FormData(form);
    const name = field(formData, "name", limits.name);
    const email = field(formData, "email", limits.email).toLowerCase();
    const subject = field(formData, "subject", limits.subject);
    const message = field(formData, "message", limits.message);
    const honeypot = field(formData, "website", 120);
    const category = requestTypes.includes(requestType) ? requestType : "Allgemein";

    if (honeypot) {
      form.reset();
      setRequestType("Allgemein");
      setStatus({ kind: "success", text: "Danke. Deine Anfrage wurde gespeichert." });
      setSubmitting(false);
      return;
    }

    if (name.length < 2) {
      setStatus({ kind: "error", text: "Bitte gib deinen Namen ein." });
      setSubmitting(false);
      return;
    }

    if (!emailPattern.test(email)) {
      setStatus({ kind: "error", text: "Bitte gib eine gültige E-Mail-Adresse ein." });
      setSubmitting(false);
      return;
    }

    if (subject.length < 3) {
      setStatus({ kind: "error", text: "Bitte ergänze einen kurzen Betreff." });
      setSubmitting(false);
      return;
    }

    if (message.length < 10) {
      setStatus({ kind: "error", text: "Bitte schreibe eine Nachricht mit mindestens 10 Zeichen." });
      setSubmitting(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setStatus({ kind: "error", text: "Das Formular ist vorbereitet. Supabase ist noch nicht konfiguriert." });
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("contact_requests").insert({
      category,
      name,
      email,
      subject,
      message,
      status: "neu"
    });

    if (error) {
      setStatus({ kind: "error", text: "Die Anfrage konnte noch nicht gespeichert werden. Bitte versuche es später erneut." });
      setSubmitting(false);
      return;
    }

    form.reset();
    setRequestType("Allgemein");
    setStatus({ kind: "success", text: "Danke. Deine Anfrage wurde gespeichert." });
    setSubmitting(false);
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-form__headline">
        <h2>Schreib uns</h2>
        <p>Wir freuen uns auf deine Nachricht.</p>
      </div>
      <label>
        Name
        <input name="name" type="text" autoComplete="name" minLength={2} maxLength={limits.name} required />
      </label>
      <label>
        E-Mail
        <input name="email" type="email" autoComplete="email" maxLength={limits.email} required />
      </label>
      <label>
        Betreff
        <input name="subject" type="text" minLength={3} maxLength={limits.subject} required />
      </label>
      <label>
        Nachricht
        <textarea name="message" rows={5} minLength={10} maxLength={limits.message} required />
      </label>
      <label className="contact-form__website" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <fieldset>
        <legend>Anfrageart</legend>
        <div className="contact-form__types">
          {requestTypes.map((type) => (
            <button
              className={requestType === type ? "contact-form__type contact-form__type--active" : "contact-form__type"}
              key={type}
              type="button"
              onClick={() => setRequestType(type)}
              aria-pressed={requestType === type}
            >
              {type}
            </button>
          ))}
        </div>
      </fieldset>
      {status ? (
        <p className={`contact-form__status contact-form__status--${status.kind}`} role={status.kind === "error" ? "alert" : "status"}>
          {status.text}
        </p>
      ) : null}
      <button className="contact-form__submit" disabled={submitting} type="submit">
        {submitting ? "Wird gesendet" : "Nachricht senden"} <Send aria-hidden="true" size={18} />
      </button>
    </form>
  );
}
