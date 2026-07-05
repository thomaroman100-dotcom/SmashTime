"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, MoreVertical } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import { type ConfirmOptions, useAdminUi } from "@/components/admin/ui/AdminUiProvider";

export type RowMenuItem =
  | {
      type: "action";
      label: string;
      danger?: boolean;
      action: () => Promise<ActionResult>;
      confirm?: ConfirmOptions;
    }
  | {
      type: "link";
      label: string;
      href: string;
      external?: boolean;
    };

type RowMenuProps = {
  label: string;
  items: RowMenuItem[];
};

/** Drei-Punkte-Menü in Tabellenzeilen (Aktionen-Spalte der Referenzlisten). */
export function RowMenu({ label, items }: RowMenuProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const ui = useAdminUi();

  useEffect(() => {
    if (!open) {
      return;
    }
    const close = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  const runAction = async (item: Extract<RowMenuItem, { type: "action" }>) => {
    setOpen(false);
    if (item.confirm && !(await ui.confirm(item.confirm))) {
      return;
    }
    startTransition(async () => {
      const result = await item.action();
      if (result.ok) {
        ui.toast("success", "Erfolg", result.message);
        router.refresh();
      } else {
        ui.toast("error", "Fehler", result.error);
      }
    });
  };

  return (
    <div ref={rootRef} style={{ position: "relative", display: "inline-flex" }}>
      <button
        className="adm-icon-btn"
        type="button"
        aria-label={label}
        aria-expanded={open}
        disabled={pending}
        onClick={() => setOpen((value) => !value)}
      >
        {pending ? (
          <Loader2 aria-hidden="true" size={16} className="adm-spin" />
        ) : (
          <MoreVertical aria-hidden="true" size={16} />
        )}
      </button>
      {open ? (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 30,
            minWidth: 190,
            padding: 6,
            border: "1px solid var(--adm-border)",
            borderRadius: 10,
            background: "#17171b",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)"
          }}
        >
          {items.map((item) =>
            item.type === "link" ? (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "9px 12px",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--adm-muted)"
                }}
                className="adm-menu-item"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => runAction(item)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "9px 12px",
                  border: 0,
                  borderRadius: 7,
                  background: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "left",
                  color: item.danger ? "#ff6b61" : "var(--adm-muted)"
                }}
                className="adm-menu-item"
              >
                {item.label}
              </button>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
