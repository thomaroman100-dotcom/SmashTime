"use client";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import { cn } from "@/lib/utils";

type AdminSubmitButtonProps = {
  children?: React.ReactNode;
  pendingLabel?: string;
};

export function AdminSubmitButton({ children, pendingLabel = "Speichert…" }: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className="admin-red-button" type="submit" disabled={pending}>
      {pending ? (
        <Loader2 aria-hidden="true" size={18} className="admin-spin" />
      ) : (
        <Save aria-hidden="true" size={18} />
      )}
      {pending ? pendingLabel : children ?? "Speichern"}
    </button>
  );
}

type AdminRowActionProps = {
  action: () => Promise<ActionResult>;
  label: string;
  confirmText?: string;
  variant?: "icon" | "outline";
  children: React.ReactNode;
};

export function AdminRowAction({ action, label, confirmText, variant = "icon", children }: AdminRowActionProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    if (confirmText && !window.confirm(confirmText)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
      }
    });
  };

  return (
    <span className="admin-row-action">
      <button
        type="button"
        className={cn(variant === "outline" && "admin-outline-button", pending && "admin-row-action--pending")}
        aria-label={label}
        title={error ?? label}
        disabled={pending}
        onClick={run}
      >
        {pending ? <Loader2 aria-hidden="true" size={16} className="admin-spin" /> : children}
      </button>
      {error ? <span className="admin-action-error" role="alert">{error}</span> : null}
    </span>
  );
}

type AdminFormMessageProps = {
  state: ActionResult | null;
};

export function AdminFormMessage({ state }: AdminFormMessageProps) {
  if (!state) {
    return null;
  }

  return (
    <p className={cn("admin-form__message", state.ok ? "admin-form__message--ok" : "admin-form__message--error")} role="status">
      {state.ok ? state.message : state.error}
    </p>
  );
}
