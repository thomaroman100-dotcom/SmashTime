"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const requestTypes = ["Sponsoring", "Presse", "Kämpfer", "Allgemein"];

export function ContactForm() {
  const [requestType, setRequestType] = useState("Allgemein");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setStatus("");

    const formData = new FormData(form);
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setStatus("Das Formular ist vorbereitet. Supabase ist noch nicht konfiguriert.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("contact_requests").insert({
      category: requestType,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      status: "neu"
    });

    if (error) {
      setStatus("Die Anfrage konnte noch nicht gespeichert werden. Bitte versuche es später erneut.");
      setSubmitting(false);
      return;
    }

    form.reset();
    setRequestType("Allgemein");
    setStatus("Danke. Deine Anfrage wurde gespeichert.");
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
        <input name="name" type="text" autoComplete="name" />
      </label>
      <label>
        E-Mail
        <input name="email" type="email" autoComplete="email" />
      </label>
      <label>
        Betreff
        <input name="subject" type="text" />
      </label>
      <label>
        Nachricht
        <textarea name="message" rows={5} />
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
      {status ? <p className="contact-form__status">{status}</p> : null}
      <button className="contact-form__submit" disabled={submitting} type="submit">
        {submitting ? "Wird gesendet" : "Nachricht senden"} <Send aria-hidden="true" size={18} />
      </button>
    </form>
  );
}
