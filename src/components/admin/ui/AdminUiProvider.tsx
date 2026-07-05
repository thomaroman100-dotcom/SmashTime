"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from "react";
import { AlertCircle, CheckCircle2, FileText, Trash2, TriangleAlert, X } from "lucide-react";

export type ToastKind = "success" | "error" | "warning";

type Toast = {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
};

export type ConfirmOptions = {
  title: string;
  message?: string;
  itemLabel?: string;
  itemMeta?: string;
  confirmLabel?: string;
};

type AdminUiContextValue = {
  toast: (kind: ToastKind, title: string, message?: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const AdminUiContext = createContext<AdminUiContextValue | null>(null);

export function useAdminUi() {
  const context = useContext(AdminUiContext);
  if (!context) {
    throw new Error("useAdminUi muss innerhalb von <AdminUiProvider> verwendet werden.");
  }
  return context;
}

const TOAST_ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert
};

const TOAST_TITLES: Record<ToastKind, string> = {
  success: "Erfolg",
  error: "Fehler",
  warning: "Warnung"
};

export function AdminUiProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);
  const confirmResolve = useRef<((value: boolean) => void) | null>(null);
  const toastId = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (kind: ToastKind, title: string, message?: string) => {
      const id = ++toastId.current;
      setToasts((current) => [...current.slice(-3), { id, kind, title, message }]);
      window.setTimeout(() => dismissToast(id), 5200);
    },
    [dismissToast]
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmState(options);
    return new Promise<boolean>((resolve) => {
      confirmResolve.current = resolve;
    });
  }, []);

  const settleConfirm = useCallback((value: boolean) => {
    confirmResolve.current?.(value);
    confirmResolve.current = null;
    setConfirmState(null);
  }, []);

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <AdminUiContext.Provider value={value}>
      {children}

      <div className="adm-toasts" role="status" aria-live="polite">
        {toasts.map((item) => {
          const Icon = TOAST_ICONS[item.kind];
          return (
            <div className={`adm-toast adm-toast--${item.kind}`} key={item.id}>
              <Icon aria-hidden="true" size={19} />
              <div>
                <strong>{item.title || TOAST_TITLES[item.kind]}</strong>
                {item.message ? <p>{item.message}</p> : null}
              </div>
              <button
                className="adm-toast__close"
                type="button"
                aria-label="Benachrichtigung schließen"
                onClick={() => dismissToast(item.id)}
              >
                <X aria-hidden="true" size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {confirmState ? (
        <div
          className="adm-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={confirmState.title}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              settleConfirm(false);
            }
          }}
        >
          <div className="adm-modal adm-modal--sm" style={{ marginTop: "8vh" }}>
            <div className="adm-confirm">
              <button
                className="adm-modal__close"
                type="button"
                aria-label="Schließen"
                style={{ position: "absolute" }}
                onClick={() => settleConfirm(false)}
              />
              <span className="adm-confirm__icon">
                <AlertCircle aria-hidden="true" size={30} />
              </span>
              <h2>{confirmState.title}</h2>
              <p>
                Diese Aktion kann nicht rückgängig gemacht werden.
                {confirmState.message ? (
                  <>
                    <br />
                    {confirmState.message}
                  </>
                ) : null}
              </p>
              {confirmState.itemLabel ? (
                <div className="adm-confirm__item">
                  <span className="adm-stat__icon adm-stat__icon--red" style={{ width: 40, height: 40 }}>
                    <FileText aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <strong>{confirmState.itemLabel}</strong>
                    {confirmState.itemMeta ? <span>{confirmState.itemMeta}</span> : null}
                  </div>
                </div>
              ) : null}
              <div className="adm-confirm__actions">
                <button className="adm-btn" type="button" onClick={() => settleConfirm(false)}>
                  <X aria-hidden="true" size={16} /> Abbrechen
                </button>
                <button className="adm-btn adm-btn--primary" type="button" onClick={() => settleConfirm(true)}>
                  <Trash2 aria-hidden="true" size={16} /> {confirmState.confirmLabel ?? "Löschen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminUiContext.Provider>
  );
}
