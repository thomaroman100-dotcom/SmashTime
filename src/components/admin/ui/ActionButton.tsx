"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import { type ConfirmOptions, useAdminUi } from "@/components/admin/ui/AdminUiProvider";
import { cn } from "@/lib/utils";

type ActionButtonProps = {
  action: () => Promise<ActionResult>;
  label: string;
  confirm?: ConfirmOptions;
  className?: string;
  successTitle?: string;
  refreshAfter?: boolean;
  children: React.ReactNode;
};

/**
 * Führt eine Server-Action aus, optional mit Bestätigungsmodal,
 * und meldet das Ergebnis als Toast (siehe globale-zustaende.png).
 */
export function ActionButton({
  action,
  label,
  confirm,
  className,
  successTitle,
  refreshAfter = false,
  children
}: ActionButtonProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const ui = useAdminUi();

  const run = async () => {
    if (confirm && !(await ui.confirm(confirm))) {
      return;
    }
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        ui.toast("success", successTitle ?? "Erfolg", result.message);
        if (refreshAfter) {
          router.refresh();
        }
      } else {
        ui.toast("error", "Fehler", result.error);
      }
    });
  };

  return (
    <button
      type="button"
      className={cn(className ?? "adm-icon-btn")}
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={run}
    >
      {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : children}
    </button>
  );
}
