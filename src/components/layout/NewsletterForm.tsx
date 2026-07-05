"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { site } from "@/data/site";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
      <label className="newsletter-form__label" htmlFor="newsletter-email">
        {site.newsletter.text}
      </label>
      <div className="newsletter-form__row">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder={site.newsletter.placeholder}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setStatus("idle");
          }}
        />
        <button type="submit" aria-label="Newsletter-Anmeldung senden">
          <ArrowRight aria-hidden="true" size={18} strokeWidth={2.6} />
        </button>
      </div>
      <p
        className={
          status === "success"
            ? "newsletter-form__note newsletter-form__note--success"
            : status === "error"
              ? "newsletter-form__note newsletter-form__note--error"
              : "newsletter-form__note"
        }
        role="status"
        aria-live="polite"
      >
        {status === "success" ? site.newsletter.success : status === "error" ? site.newsletter.error : " "}
      </p>
    </form>
  );
}
