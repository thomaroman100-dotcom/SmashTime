"use client";

import { Send } from "lucide-react";
import { useState } from "react";

const requestTypes = ["Sponsoring", "Presse", "Kämpfer", "Allgemein"];

export function ContactForm() {
  const [requestType, setRequestType] = useState("Allgemein");

  return (
    <form className="contact-form">
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
      <button className="contact-form__submit" type="submit">
        Nachricht senden <Send aria-hidden="true" size={18} />
      </button>
    </form>
  );
}
