"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Expand, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminImagePreviewProps = {
  src?: string | null;
  alt: string;
  fallback?: string;
  fit?: "contain" | "cover";
  aspectRatio?: string;
  sizes?: string;
  className?: string;
  modalTitle?: string;
  priority?: boolean;
};

export function AdminImagePreview({
  src,
  alt,
  fallback = "Bild wird hier angezeigt",
  fit = "contain",
  aspectRatio = "16 / 9",
  sizes = "320px",
  className,
  modalTitle,
  priority = false
}: AdminImagePreviewProps) {
  const [open, setOpen] = useState(false);
  const imageSrc = src?.trim() ?? "";
  const hasImage = imageSrc.length > 0;
  const isBlob = imageSrc.startsWith("blob:");
  const label = modalTitle || alt || "Bildvorschau";

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const image = hasImage ? (
    isBlob ? (
      // Browser-Blob-URLs aus Datei-Inputs koennen nicht durch next/image verarbeitet werden.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageSrc} alt={alt} className="adm-image-preview__image" style={{ objectFit: fit }} />
    ) : (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        className="adm-image-preview__image"
        style={{ objectFit: fit }}
      />
    )
  ) : null;

  return (
    <>
      <button
        className={cn("adm-image-preview", className)}
        type="button"
        aria-label={hasImage ? `${label} in Vollansicht öffnen` : fallback}
        disabled={!hasImage}
        onClick={() => setOpen(true)}
        style={{ "--adm-image-preview-ratio": aspectRatio } as CSSProperties}
      >
        {image ?? (
          <span className="adm-image-preview__empty">
            <ImageIcon aria-hidden="true" size={22} />
            <span>{fallback}</span>
          </span>
        )}
        {hasImage ? (
          <span className="adm-image-preview__open">
            <Expand aria-hidden="true" size={13} />
            Vollansicht
          </span>
        ) : null}
      </button>

      {open && hasImage ? (
        <div
          className="adm-overlay adm-image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="adm-modal adm-image-lightbox__modal">
            <div className="adm-modal__head">
              <div className="adm-panel__head-text">
                <h2>{label}</h2>
                <p>Komplette Bildansicht ohne Zuschnitt.</p>
              </div>
              <button className="adm-modal__close" type="button" aria-label="Schließen" onClick={() => setOpen(false)}>
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <div className="adm-image-lightbox__body">
              <div className="adm-image-lightbox__stage">
                {isBlob ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageSrc} alt={alt} />
                ) : (
                  <Image src={imageSrc} alt={alt} fill sizes="92vw" unoptimized style={{ objectFit: "contain" }} />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
