"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { AdminImagePreview } from "@/components/admin/ui/AdminImagePreview";
import { cn } from "@/lib/utils";

const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/svg+xml";

type AdminImageUploadFieldProps = {
  id: string;
  label: string;
  fileName: string;
  value?: string | null;
  onValueChange?: (value: string) => void;
  pathName?: string;
  clearName?: string;
  pathLabel?: string;
  fileLabel?: string;
  hint?: string;
  uploadHint?: string;
  fallback?: string;
  previewAlt?: string;
  aspectRatio?: string;
  sizes?: string;
  fit?: "contain" | "cover";
  compact?: boolean;
  required?: boolean;
  className?: string;
  previewClassName?: string;
};

type MultiPreview = {
  name: string;
  url: string;
};

export function AdminImageUploadField({
  id,
  label,
  fileName,
  value,
  onValueChange,
  pathName,
  clearName,
  pathLabel = "Bildpfad / Medien-URL",
  fileLabel = "Bild hochladen",
  hint,
  uploadHint = "Max. 6 MB. Ein neuer Upload ersetzt das gespeicherte Bild beim Speichern.",
  fallback = "Bild wird hier angezeigt",
  previewAlt,
  aspectRatio = "16 / 9",
  sizes = "360px",
  fit = "contain",
  compact = false,
  required = false,
  className,
  previewClassName
}: AdminImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isCleared, setIsCleared] = useState(false);
  const currentValue = value?.trim() ?? "";
  const previewSrc = filePreview || (isCleared ? "" : currentValue);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const resetSelectedFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview("");
    }
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    resetSelectedFile();
    setIsCleared(true);
    onValueChange?.("");
  };

  return (
    <div className={cn("adm-image-upload", compact && "adm-image-upload--compact", className)}>
      <div className="adm-image-upload__head">
        <span>{label}</span>
        {previewSrc ? (
          <button className="adm-image-upload__remove" type="button" onClick={removeImage}>
            <Trash2 aria-hidden="true" size={14} />
            Bild entfernen
          </button>
        ) : null}
      </div>

      <AdminImagePreview
        src={previewSrc}
        alt={previewAlt ?? label}
        fallback={fallback}
        fit={fit}
        aspectRatio={aspectRatio}
        sizes={sizes}
        className={cn("adm-image-upload__preview", previewClassName)}
      />

      <div className="adm-image-upload__controls">
        {pathName ? (
          <div className="adm-field">
            <label htmlFor={`${id}-path`}>{pathLabel}</label>
            <input
              id={`${id}-path`}
              name={pathName}
              value={isCleared ? "" : currentValue}
              onChange={(event) => {
                resetSelectedFile();
                setIsCleared(false);
                onValueChange?.(event.target.value);
              }}
              placeholder="/images/... oder Medien-URL"
            />
            {hint ? <span className="adm-field__hint">{hint}</span> : null}
          </div>
        ) : null}

        <div className="adm-field">
          <label htmlFor={`${id}-file`}>
            <Upload aria-hidden="true" size={14} />
            {fileLabel}
          </label>
          <input
            ref={fileInputRef}
            id={`${id}-file`}
            name={fileName}
            type="file"
            accept={IMAGE_ACCEPT}
            required={required}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                resetSelectedFile();
                return;
              }

              if (filePreview) {
                URL.revokeObjectURL(filePreview);
              }
              setFilePreview(URL.createObjectURL(file));
              setSelectedFileName(file.name);
              setIsCleared(false);
            }}
          />
          <span className="adm-field__hint">{uploadHint}</span>
          {selectedFileName ? (
            <span className="adm-image-upload__selected">
              <ImageIcon aria-hidden="true" size={13} />
              Neue Datei ausgewählt: {selectedFileName}
            </span>
          ) : null}
        </div>
      </div>

      {clearName ? <input type="hidden" name={clearName} value={isCleared ? "on" : ""} /> : null}
    </div>
  );
}

export function AdminMultiImageUploadField({
  id,
  label,
  fileName,
  hint = "Mehrere Bilder möglich, max. 6 MB pro Datei.",
  fallback = "Bildvorschau",
  className
}: {
  id: string;
  label: string;
  fileName: string;
  hint?: string;
  fallback?: string;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<MultiPreview[]>([]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const clearPreviews = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("adm-image-upload", className)}>
      <div className="adm-image-upload__head">
        <span>{label}</span>
        {previews.length > 0 ? (
          <button className="adm-image-upload__remove" type="button" onClick={clearPreviews}>
            <Trash2 aria-hidden="true" size={14} />
            Auswahl entfernen
          </button>
        ) : null}
      </div>
      <div className="adm-field">
        <label htmlFor={id}>
          <Upload aria-hidden="true" size={14} />
          Bilder auswählen
        </label>
        <input
          ref={fileInputRef}
          id={id}
          name={fileName}
          type="file"
          multiple
          accept={IMAGE_ACCEPT}
          onChange={(event) => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url));
            const files = Array.from(event.target.files ?? []);
            setPreviews(files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })));
          }}
        />
        <span className="adm-field__hint">{hint}</span>
      </div>
      {previews.length > 0 ? (
        <div className="adm-image-upload__gallery" aria-label="Ausgewählte Bilder">
          {previews.map((preview) => (
            <figure key={`${preview.name}-${preview.url}`}>
              <AdminImagePreview
                src={preview.url}
                alt={preview.name}
                fallback={fallback}
                aspectRatio="16 / 10"
                sizes="180px"
                className="adm-image-preview--gallery"
              />
              <figcaption>{preview.name}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  );
}
