"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { getMemberImageSrc } from "@/lib/media-placeholders";
import { cn } from "@/lib/utils";

export type FighterProfileOption = {
  userId: string;
  name: string;
  meta: string;
  imagePath?: string | null;
};

type FighterProfilePickerProps = {
  name: string;
  label: string;
  options: FighterProfileOption[];
  initialUserId?: string | null;
  legacyName?: string | null;
  required?: boolean;
  corner?: "red" | "blue";
  emptyLabel?: string;
  legacyFieldName?: string;
  onSelectionChange?: (option: FighterProfileOption | null) => void;
};

export function FighterProfilePicker({
  name,
  label,
  options,
  initialUserId,
  legacyName,
  required = false,
  corner = "red",
  emptyLabel = "Wird bekanntgegeben",
  legacyFieldName,
  onSelectionChange
}: FighterProfilePickerProps) {
  const [selectedId, setSelectedId] = useState(initialUserId ?? "");
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.userId === selectedId) ?? null;
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalizedQuery) {
      return options;
    }
    return options.filter((option) => `${option.name} ${option.meta}`.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery, options]);

  const selectFighter = (value: string) => {
    const next = options.find((option) => option.userId === value) ?? null;
    setSelectedId(value);
    onSelectionChange?.(next);
  };

  const clear = () => {
    setSelectedId("");
    onSelectionChange?.(null);
  };

  return (
    <div className={cn("adm-fighter-profile-picker", `adm-fighter-profile-picker--${corner}`)}>
      <input type="hidden" name={name} value={selectedId} />
      {!selectedId && legacyName && legacyFieldName ? <input type="hidden" name={legacyFieldName} value={legacyName} /> : null}
      <label htmlFor={`${name}-search`}>{label}</label>
      <div className="adm-fighter-profile-picker__search">
        <Search aria-hidden="true" size={15} />
        <input
          id={`${name}-search`}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Verifizierten Kämpfer suchen..."
        />
      </div>
      <select
        aria-label={`${label} auswählen`}
        value={selectedId}
        onChange={(event) => selectFighter(event.target.value)}
        required={required}
      >
        <option value="">{emptyLabel}</option>
        {filtered.map((option) => (
          <option key={option.userId} value={option.userId}>
            {option.name} {option.meta ? `- ${option.meta}` : ""}
          </option>
        ))}
      </select>
      <div className="adm-fighter-profile-picker__selected">
        <span className="adm-fighter-profile-picker__avatar">
          <Image src={getMemberImageSrc(selected?.imagePath)} alt="" fill sizes="34px" />
        </span>
        <span>
          <strong>{selected?.name ?? legacyName ?? emptyLabel}</strong>
          <small>{selected?.meta ?? (legacyName ? "Legacy-Eintrag ohne Profilverknüpfung" : "Kein Fighterprofil ausgewählt")}</small>
        </span>
        {selectedId ? (
          <button type="button" aria-label={`${label} entfernen`} onClick={clear}>
            <X aria-hidden="true" size={14} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
