"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  Crown,
  Database,
  Diamond,
  Globe2,
  GripVertical,
  ImageIcon,
  KeyRound,
  List,
  Mail,
  Newspaper,
  Palette,
  Plug,
  Plus,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  UserRound,
  X
} from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import { SETTING_FIELDS } from "@/lib/admin/resource-shared";
import { AdminImagePreview } from "@/components/admin/ui/AdminImagePreview";
import { cn } from "@/lib/utils";

type SettingsFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  values: Record<string, string>;
  eventOptions: SettingsEventOption[];
};

type NavigationItem = {
  label: string;
  path: string;
  isVisible: boolean;
  order: number;
};

type FieldValue = string | number | boolean;

export type SettingsEventOption = {
  id: string;
  label: string;
  endAt: string;
};

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
};

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "time";
};

type SelectInputProps = {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
};

type SettingsCardProps = {
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
  children: React.ReactNode;
  span: "span-2" | "span-3";
  category: string;
};

const defaultNavigationItems: NavigationItem[] = [
  { label: "Startseite", path: "/", isVisible: true, order: 1 },
  { label: "Champions", path: "/champions", isVisible: true, order: 2 },
  { label: "Veranstaltungen", path: "/veranstaltungen", isVisible: true, order: 3 },
  { label: "Neuigkeiten", path: "/neuigkeiten", isVisible: true, order: 4 },
  { label: "Sponsoren", path: "/sponsoren", isVisible: true, order: 5 },
  { label: "Über uns", path: "/ueber-uns", isVisible: true, order: 6 },
  { label: "Kontakt", path: "/kontakt", isVisible: true, order: 7 }
];

const defaultValues: Record<string, string> = {
  "general.siteTitle": "SmashTime",
  "general.siteTagline": "The Next Level of Fighting.",
  "general.siteDescription":
    "SmashTime ist die neue Generation von Fighting Events. Emotionen. Respekt. Adrenalin.",
  "general.locale": "Deutsch (DE)",
  "general.timezone": "(UTC+01:00) Wien, Berlin, Bern",
  "branding.headerLogoUrl": "/images/logo/smashtime-logo.png",
  "branding.faviconUrl": "/images/logo/smashtime-logo.png",
  "branding.theme.primaryColor": "#E30613",
  "branding.theme.accentColor": "#D4AF37",
  "branding.theme.textColor": "#E5E5E5",
  "navigation.items": JSON.stringify(defaultNavigationItems),
  "countdown.enabled": "true",
  "countdown.featuredEventId": "smashtime-3-respekt-steigt-in-den-ring",
  "countdown.countdownEndAt": "2026-10-17T18:00:00+02:00",
  "countdown.label": "Der Kampf beginnt in",
  "homepage.hero.title": "SmashTime 3",
  "homepage.hero.subtitle": "Respekt steigt in den Ring. Gemeinsam gegen Mobbing.",
  "homepage.hero.backgroundImageUrl": "/images/backgrounds/hero-smash-cage-arena-wide.png",
  "homepage.cta.primaryLabel": "Nächste Veranstaltung",
  "homepage.cta.primaryUrl": "/veranstaltungen/smashtime-3-respekt-steigt-in-den-ring",
  "homepage.cta.secondaryLabel": "Über SmashTime",
  "homepage.cta.secondaryUrl": "/ueber-uns",
  "homepage.modules.champions.enabled": "true",
  "homepage.modules.champions.title": "Unsere Champions",
  "homepage.modules.champions.description": "Lerne die Athleten kennen, die bereit sind, alles zu geben.",
  "homepage.modules.champions.displayLimit": "6",
  "homepage.modules.champions.buttonLabel": "Alle Champions ansehen",
  "homepage.modules.champions.buttonUrl": "/champions",
  "homepage.modules.news.enabled": "true",
  "homepage.modules.news.title": "Aktuelle News",
  "homepage.modules.news.description": "Bleib auf dem Laufenden mit den neuesten Updates.",
  "homepage.modules.news.displayLimit": "3",
  "homepage.modules.news.buttonLabel": "Alle News ansehen",
  "homepage.modules.news.buttonUrl": "/neuigkeiten",
  "homepage.modules.sponsors.enabled": "true",
  "homepage.modules.sponsors.title": "Unsere Partner",
  "homepage.modules.sponsors.description": "Gemeinsam stark - mit unseren Partnern an der Spitze.",
  "homepage.modules.sponsors.displayLimit": "8",
  "homepage.modules.sponsors.buttonLabel": "Alle Partner ansehen",
  "homepage.modules.sponsors.buttonUrl": "/sponsoren"
};

const tabs = [
  { label: "Allgemein", value: "general" },
  { label: "Design & Branding", value: "branding" },
  { label: "Konto & Sicherheit", value: "security" },
  { label: "Benachrichtigungen & E-Mail", value: "notifications" },
  { label: "Integrationen & API", value: "integrations" },
  { label: "System & Backups", value: "system" }
];

function parseNavigationItems(value: string | undefined): NavigationItem[] {
  if (!value) {
    return defaultNavigationItems;
  }

  try {
    const parsed = JSON.parse(value) as NavigationItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultNavigationItems;
    }

    return parsed
      .map((item, index) => ({
        label: String(item.label ?? "Menüpunkt"),
        path: String(item.path ?? "/"),
        isVisible: Boolean(item.isVisible),
        order: Number.isFinite(item.order) ? item.order : index + 1
      }))
      .sort((a, b) => a.order - b.order);
  } catch {
    return defaultNavigationItems;
  }
}

function countdownDateParts(value: string) {
  const [datePart = "2026-10-17", timePart = "18:00"] = value.split("T");
  return {
    date: datePart,
    time: timePart.slice(0, 5)
  };
}

function displayDate(value: string) {
  const { date } = countdownDateParts(value);
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

function FormField({ label, children, hint, className }: FormFieldProps) {
  return (
    <label className={cn("settings-field", className)}>
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function TextInput({ value, onChange, type = "text" }: TextInputProps) {
  return (
    <input
      className="settings-input"
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function TextareaInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <textarea
      className="settings-textarea"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function SelectInput({ value, onChange, options }: SelectInputProps) {
  return (
    <select className="settings-select" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      className={cn("settings-toggle", checked && "settings-toggle--on")}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function ColorTokenInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FormField label={label} className="settings-color-field">
      <span className="settings-color-token">
        <span className="settings-color-token__swatch" style={{ backgroundColor: value }} />
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      </span>
    </FormField>
  );
}

function ImageUploadField({
  label,
  src,
  hint,
  inputName,
  compact = false,
  onRemove,
  onPreviewChange
}: {
  label: string;
  src: string;
  hint: string;
  inputName: string;
  compact?: boolean;
  onRemove: () => void;
  onPreviewChange: (src: string) => void;
}) {
  return (
    <div className="settings-field">
      <span>{label}</span>
      <div className="settings-image-preview-wrap">
        <AdminImagePreview
          src={src}
          alt={label}
          fallback="Bild wird bald ergänzt"
          aspectRatio={compact ? "1 / 1" : "16 / 9"}
          sizes={compact ? "80px" : "360px"}
          className={cn("settings-image-preview", compact && "settings-image-preview--compact")}
        />
        <button type="button" aria-label={`${label} entfernen`} onClick={onRemove}>
          <X aria-hidden="true" size={14} />
        </button>
      </div>
      <small>{hint}</small>
      <input
        className="settings-file-input"
        name={inputName}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onPreviewChange(URL.createObjectURL(file));
          }
        }}
      />
    </div>
  );
}

function SettingsCard({ title, icon: Icon, children, span, category }: SettingsCardProps) {
  return (
    <section className={cn("settings-card", `settings-card--${span}`)} data-category={category}>
      <header className="settings-card__head">
        <Icon aria-hidden={true} size={18} strokeWidth={2.2} />
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}

function HiddenSettingsFields({
  settings,
  navigationItems
}: {
  settings: Record<string, string>;
  navigationItems: NavigationItem[];
}) {
  const navigationValue = JSON.stringify(
    navigationItems.map((item, index) => ({
      ...item,
      order: index + 1
    }))
  );

  return (
    <>
      {SETTING_FIELDS.map((field) => (
        <input
          key={field.key}
          type="hidden"
          name={field.key}
          value={field.key === "navigation.items" ? navigationValue : settings[field.key] ?? ""}
        />
      ))}
    </>
  );
}

function NavigationBuilder({
  items,
  setItems
}: {
  items: NavigationItem[];
  setItems: (items: NavigationItem[]) => void;
}) {
  const updateItem = (index: number, patch: Partial<NavigationItem>) => {
    setItems(
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
    );
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setItems(next.map((item, itemIndex) => ({ ...item, order: itemIndex + 1 })));
  };

  const toggleItem = (index: number, checked: boolean) => {
    setItems(items.map((item, itemIndex) => (itemIndex === index ? { ...item, isVisible: checked } : item)));
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, order: itemIndex + 1 })));
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        label: "Neuer Menüpunkt",
        path: "/",
        isVisible: true,
        order: items.length + 1
      }
    ]);
  };

  return (
    <div className="settings-navigation-builder">
      {items.map((item, index) => (
        <div className="settings-navigation-item" key={`${item.label}-${item.order}`}>
          <GripVertical aria-hidden="true" size={16} />
          <button type="button" aria-label={`${item.label} nach oben`} onClick={() => moveItem(index, -1)}>
            ↑
          </button>
          <button type="button" aria-label={`${item.label} nach unten`} onClick={() => moveItem(index, 1)}>
            ↓
          </button>
          <input
            aria-label="Menüpunkt Label"
            value={item.label}
            onChange={(event) => updateItem(index, { label: event.target.value })}
          />
          <input
            aria-label="Menüpunkt Pfad"
            value={item.path}
            onChange={(event) => updateItem(index, { path: event.target.value })}
          />
          <ToggleSwitch checked={item.isVisible} label={`${item.label} anzeigen`} onChange={(checked) => toggleItem(index, checked)} />
          <button type="button" aria-label={`${item.label} entfernen`} onClick={() => removeItem(index)}>
            <X aria-hidden="true" size={13} />
          </button>
        </div>
      ))}
      <button className="settings-add-nav" type="button" onClick={addItem}>
        <Plus aria-hidden="true" size={16} />
        Menüpunkt hinzufügen
      </button>
    </div>
  );
}

function CountdownPreview() {
  return (
    <div className="settings-countdown-preview" aria-label="Countdown Vorschau">
      {[
        ["23", "Tage"],
        ["14", "Std."],
        ["35", "Min."],
        ["42", "Sek."]
      ].map(([value, label]) => (
        <span key={label}>
          <strong>{value}</strong>
          <small>{label}</small>
        </span>
      ))}
    </div>
  );
}

function HomepageModuleCard({
  moduleKey,
  title,
  icon,
  label,
  settings,
  setValue,
  countLabel,
  countOptions
}: {
  moduleKey: "champions" | "news" | "sponsors";
  title: string;
  icon: SettingsCardProps["icon"];
  label: string;
  settings: Record<string, string>;
  setValue: (key: string, value: FieldValue) => void;
  countLabel: string;
  countOptions: string[];
}) {
  const base = `homepage.modules.${moduleKey}`;

  return (
    <SettingsCard title={title} icon={icon} span={moduleKey === "sponsors" ? "span-3" : "span-2"} category="homepage">
      <div className="settings-card__toggle-row">
        <span>{label}</span>
        <ToggleSwitch
          checked={settings[`${base}.enabled`] === "true"}
          label={label}
          onChange={(checked) => setValue(`${base}.enabled`, checked)}
        />
      </div>
      <FormField label="Titel">
        <TextInput value={settings[`${base}.title`]} onChange={(value) => setValue(`${base}.title`, value)} />
      </FormField>
      <FormField label="Beschreibung">
        <TextareaInput value={settings[`${base}.description`]} onChange={(value) => setValue(`${base}.description`, value)} />
      </FormField>
      <FormField label={countLabel}>
        <SelectInput
          value={settings[`${base}.displayLimit`]}
          onChange={(value) => setValue(`${base}.displayLimit`, value)}
          options={countOptions.map((value) => ({ label: value, value }))}
        />
      </FormField>
      <FormField label="Button Text">
        <TextInput value={settings[`${base}.buttonLabel`]} onChange={(value) => setValue(`${base}.buttonLabel`, value)} />
      </FormField>
      <FormField label="Button Link">
        <TextInput value={settings[`${base}.buttonUrl`]} onChange={(value) => setValue(`${base}.buttonUrl`, value)} />
      </FormField>
    </SettingsCard>
  );
}

export function SettingsForm({ action, values, eventOptions }: SettingsFormProps) {
  const initialSettings = useMemo(
    () =>
      SETTING_FIELDS.reduce<Record<string, string>>((accumulator, field) => {
        accumulator[field.key] = values[field.key] || defaultValues[field.key] || "";
        return accumulator;
      }, {}),
    [values]
  );
  const initialNavigationItems = useMemo(
    () => parseNavigationItems(initialSettings["navigation.items"]),
    [initialSettings]
  );

  const [state, formAction] = useActionState(action, null);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(initialSettings);
  const [navigationItems, setNavigationItems] = useState(initialNavigationItems);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("vor 2 Minuten");
  const eventSelectOptions =
    eventOptions.length > 0
      ? eventOptions
      : [{ id: "smashtime-3-respekt-steigt-in-den-ring", label: "SmashTime 3 - 17. Oktober 2026", endAt: "2026-10-17T18:00:00+02:00" }];

  const setValue = (key: string, value: FieldValue) => {
    setSettings((current) => ({ ...current, [key]: String(value) }));
    setIsDirty(true);
  };

  const updateNavigationItems = (items: NavigationItem[]) => {
    setNavigationItems(items);
    setIsDirty(true);
  };

  const resetSettings = () => {
    setSettings(initialSettings);
    setNavigationItems(initialNavigationItems);
    setIsDirty(false);
  };

  const shouldShow = (category: string) => activeTab === "all" || activeTab === category;
  const countdownParts = countdownDateParts(settings["countdown.countdownEndAt"]);
  const pageTitle = tabs.find((tab) => tab.value === activeTab)?.label ?? "Einstellungen";
  const savedFields = SETTING_FIELDS.filter((field) => Boolean(settings[field.key])).length;
  const completionPercent = Math.round((savedFields / SETTING_FIELDS.length) * 100);

  return (
    <form
      className="settings-dashboard"
      action={formAction}
      onSubmit={() => {
        setIsDirty(false);
        setLastSavedAt("gerade eben");
      }}
    >
      <HiddenSettingsFields settings={settings} navigationItems={navigationItems} />

      <header className="settings-page-header settings-page-header--admin">
        <div>
          <span className="settings-breadcrumb">Einstellungen / {pageTitle}</span>
          <h1>{pageTitle === "Allgemein" ? "Allgemeine Einstellungen" : pageTitle}</h1>
          <p>Verwalte System, Website, Sicherheit und Benachrichtigungen zentral an einem Ort.</p>
        </div>
        <div className="settings-page-actions">
          <Link className="adm-btn" href="/admin">
            <ArrowLeft aria-hidden="true" size={16} /> Zurück zur Übersicht
          </Link>
          <button type="button" className="adm-btn" onClick={resetSettings}>
            <RotateCcw aria-hidden="true" size={16} /> Änderungen verwerfen
          </button>
          <button type="submit" className="adm-btn adm-btn--primary">
            <Save aria-hidden="true" size={16} /> Speichern
          </button>
        </div>
      </header>

      <nav className="settings-tabs" aria-label="Einstellungen Bereiche">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={cn(activeTab === tab.value && "settings-tabs__item--active")}
            type="button"
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {state && !state.ok ? (
        <p className="admin-form__message admin-form__message--error" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="settings-admin-layout">
      <div className="settings-grid">
        {shouldShow("general") ? (
          <SettingsCard title="Allgemein" icon={Settings} span="span-3" category="general">
            <FormField label="Website-Titel">
              <TextInput value={settings["general.siteTitle"]} onChange={(value) => setValue("general.siteTitle", value)} />
            </FormField>
            <FormField label="Tagline / Slogan">
              <TextInput value={settings["general.siteTagline"]} onChange={(value) => setValue("general.siteTagline", value)} />
            </FormField>
            <FormField label="Website-Beschreibung">
              <TextareaInput
                value={settings["general.siteDescription"]}
                onChange={(value) => setValue("general.siteDescription", value)}
              />
            </FormField>
            <FormField label="Sprache">
              <SelectInput
                value={settings["general.locale"]}
                onChange={(value) => setValue("general.locale", value)}
                options={[{ label: "Deutsch (DE)", value: "Deutsch (DE)" }]}
              />
            </FormField>
            <FormField label="Zeitzone">
              <SelectInput
                value={settings["general.timezone"]}
                onChange={(value) => setValue("general.timezone", value)}
                options={[{ label: "(UTC+01:00) Wien, Berlin, Bern", value: "(UTC+01:00) Wien, Berlin, Bern" }]}
              />
            </FormField>
          </SettingsCard>
        ) : null}

        {shouldShow("branding") ? (
          <SettingsCard title="Logos & Medien" icon={Palette} span="span-3" category="branding">
            <ImageUploadField
              label="Logo (Header)"
              src={settings["branding.headerLogoUrl"]}
              hint="Empfohlen: 200x60px, PNG oder SVG"
              inputName="headerLogoFile"
              onRemove={() => setValue("branding.headerLogoUrl", "")}
              onPreviewChange={(src) => setValue("branding.headerLogoUrl", src)}
            />
            <ImageUploadField
              label="Favicon"
              src={settings["branding.faviconUrl"]}
              hint="Empfohlen: 32x32px, PNG oder ICO"
              inputName="faviconFile"
              compact
              onRemove={() => setValue("branding.faviconUrl", "")}
              onPreviewChange={(src) => setValue("branding.faviconUrl", src)}
            />
            <div className="settings-color-group">
              <strong>Farben</strong>
              <ColorTokenInput
                label="Primär (Rot)"
                value={settings["branding.theme.primaryColor"]}
                onChange={(value) => setValue("branding.theme.primaryColor", value)}
              />
              <ColorTokenInput
                label="Akzent (Gold)"
                value={settings["branding.theme.accentColor"]}
                onChange={(value) => setValue("branding.theme.accentColor", value)}
              />
              <ColorTokenInput
                label="Text (Hell)"
                value={settings["branding.theme.textColor"]}
                onChange={(value) => setValue("branding.theme.textColor", value)}
              />
            </div>
          </SettingsCard>
        ) : null}

        {shouldShow("general") ? (
          <SettingsCard title="Navigation" icon={List} span="span-3" category="general">
            <NavigationBuilder items={navigationItems} setItems={updateNavigationItems} />
          </SettingsCard>
        ) : null}

        {shouldShow("general") ? (
          <SettingsCard title="Event-Standardwerte & Countdown" icon={CalendarDays} span="span-3" category="general">
            <FormField label="Veranstaltung">
              <SelectInput
                value={settings["countdown.featuredEventId"]}
                onChange={(value) => {
                  const selectedEvent = eventSelectOptions.find((option) => option.id === value);
                  setValue("countdown.featuredEventId", value);
                  if (selectedEvent?.endAt) {
                    setValue("countdown.countdownEndAt", selectedEvent.endAt);
                  }
                }}
                options={eventSelectOptions.map((event) => ({ label: event.label, value: event.id }))}
              />
            </FormField>
            <div className="settings-card__toggle-row">
              <span>Countdown aktivieren</span>
              <ToggleSwitch
                checked={settings["countdown.enabled"] === "true"}
                label="Countdown aktivieren"
                onChange={(checked) => setValue("countdown.enabled", checked)}
              />
            </div>
            <div className="settings-date-row">
              <FormField label="Countdown-Ende (Datum)">
                <TextInput
                  type="date"
                  value={countdownParts.date}
                  onChange={(value) => setValue("countdown.countdownEndAt", `${value}T${countdownParts.time}:00+02:00`)}
                />
              </FormField>
              <FormField label="Uhrzeit">
                <TextInput
                  type="time"
                  value={countdownParts.time}
                  onChange={(value) => setValue("countdown.countdownEndAt", `${countdownParts.date}T${value}:00+02:00`)}
                />
              </FormField>
            </div>
            <FormField label="Countdown-Text (optional)">
              <TextInput value={settings["countdown.label"]} onChange={(value) => setValue("countdown.label", value)} />
            </FormField>
            <div className="settings-preview-block">
              <span>Vorschau</span>
              <CountdownPreview />
              <small>{displayDate(settings["countdown.countdownEndAt"])} um {countdownParts.time}</small>
            </div>
          </SettingsCard>
        ) : null}

        {shouldShow("branding") ? (
          <SettingsCard title="Startseite / Hero" icon={ImageIcon} span="span-3" category="branding">
            <FormField label="Titel (H1)">
              <TextInput value={settings["homepage.hero.title"]} onChange={(value) => setValue("homepage.hero.title", value)} />
            </FormField>
            <FormField label="Untertitel">
              <TextInput value={settings["homepage.hero.subtitle"]} onChange={(value) => setValue("homepage.hero.subtitle", value)} />
            </FormField>
            <ImageUploadField
              label="Hintergrundbild"
              src={settings["homepage.hero.backgroundImageUrl"]}
              hint="Empfohlen: 1920x1080px, JPG/PNG, max. 2MB"
              inputName="heroBackgroundFile"
              onRemove={() => setValue("homepage.hero.backgroundImageUrl", "")}
              onPreviewChange={(src) => setValue("homepage.hero.backgroundImageUrl", src)}
            />
          </SettingsCard>
        ) : null}

        {shouldShow("general") ? (
          <SettingsCard title="CTA-Bereich (Hero)" icon={Diamond} span="span-2" category="general">
            <FormField label="Haupt-CTA Text">
              <TextInput value={settings["homepage.cta.primaryLabel"]} onChange={(value) => setValue("homepage.cta.primaryLabel", value)} />
            </FormField>
            <FormField label="Haupt-CTA Link">
              <TextInput value={settings["homepage.cta.primaryUrl"]} onChange={(value) => setValue("homepage.cta.primaryUrl", value)} />
            </FormField>
            <FormField label="Sekundärer CTA Text">
              <TextInput
                value={settings["homepage.cta.secondaryLabel"]}
                onChange={(value) => setValue("homepage.cta.secondaryLabel", value)}
              />
            </FormField>
            <FormField label="Sekundärer CTA Link">
              <TextInput
                value={settings["homepage.cta.secondaryUrl"]}
                onChange={(value) => setValue("homepage.cta.secondaryUrl", value)}
              />
            </FormField>
          </SettingsCard>
        ) : null}

        {shouldShow("general") ? (
          <HomepageModuleCard
            moduleKey="champions"
            title="Champions-Homepage-Modul"
            icon={Crown}
            label="Modul aktivieren"
            settings={settings}
            setValue={setValue}
            countLabel="Anzahl Champions anzeigen"
            countOptions={["3", "4", "6", "8"]}
          />
        ) : null}

        {shouldShow("general") ? (
          <HomepageModuleCard
            moduleKey="news"
            title="News-Homepage-Modul"
            icon={Newspaper}
            label="Modul aktivieren"
            settings={settings}
            setValue={setValue}
            countLabel="Anzahl News anzeigen"
            countOptions={["3", "6", "9"]}
          />
        ) : null}

        {shouldShow("general") ? (
          <HomepageModuleCard
            moduleKey="sponsors"
            title="Sponsorenbereich"
            icon={ShieldCheck}
            label="Bereich aktivieren"
            settings={settings}
            setValue={setValue}
            countLabel="Anzahl Logos anzeigen"
            countOptions={["4", "6", "8", "10", "12"]}
          />
        ) : null}

        {shouldShow("security") ? (
          <SettingsCard title="Konto & Sicherheit" icon={KeyRound} span="span-3" category="security">
            <div className="settings-security-grid">
              <div className="settings-status-tile">
                <ShieldCheck aria-hidden="true" size={20} />
                <strong>Rollenmodell aktiv</strong>
                <small>Admin, Mitarbeiter und Kämpfer werden über DB-Profile und RLS getrennt.</small>
              </div>
              <div className="settings-status-tile">
                <CheckCircle2 aria-hidden="true" size={20} />
                <strong>Keine Metadata-Rechte</strong>
                <small>Berechtigungen liegen in `staff_permissions`, nicht in User-Metadaten.</small>
              </div>
              <div className="settings-status-tile">
                <UserRound aria-hidden="true" size={20} />
                <strong>Profil-Freigabe</strong>
                <small>Neue Registrierungen starten als Pending-Profil.</small>
              </div>
            </div>
            <Link className="adm-btn" href="/admin/members/roles">
              Rechteverwaltung öffnen
            </Link>
          </SettingsCard>
        ) : null}

        {shouldShow("notifications") ? (
          <SettingsCard title="Absender & Kontakt" icon={Mail} span="span-3" category="notifications">
            <FormField label="Kontakt-E-Mail">
              <TextInput value={settings["contact_email"]} onChange={(value) => setValue("contact_email", value)} />
            </FormField>
            <FormField label="Ticketlink">
              <TextInput value={settings["ticket_url"]} onChange={(value) => setValue("ticket_url", value)} />
            </FormField>
            <div className="settings-security-grid">
              <div className="settings-status-tile">
                <Bell aria-hidden="true" size={20} />
                <strong>Kontaktanfragen</strong>
                <small>Neue Anfragen werden im Adminbereich über Kontaktanfragen verwaltet.</small>
              </div>
              <div className="settings-status-tile">
                <Mail aria-hidden="true" size={20} />
                <strong>E-Mail-Versand</strong>
                <small>Einladungen nutzen den Supabase Auth Magic-Link-Flow.</small>
              </div>
            </div>
          </SettingsCard>
        ) : null}

        {shouldShow("integrations") ? (
          <SettingsCard title="Social Links & Integrationen" icon={Plug} span="span-3" category="integrations">
            <FormField label="Instagram">
              <TextInput value={settings["instagram_url"]} onChange={(value) => setValue("instagram_url", value)} />
            </FormField>
            <FormField label="Facebook">
              <TextInput value={settings["facebook_url"]} onChange={(value) => setValue("facebook_url", value)} />
            </FormField>
            <FormField label="YouTube">
              <TextInput value={settings["youtube_url"]} onChange={(value) => setValue("youtube_url", value)} />
            </FormField>
            <FormField label="TikTok">
              <TextInput value={settings["tiktok_url"]} onChange={(value) => setValue("tiktok_url", value)} />
            </FormField>
          </SettingsCard>
        ) : null}

        {shouldShow("system") ? (
          <SettingsCard title="System & Backups" icon={Database} span="span-3" category="system">
            <FormField label="Startseiten-CTA Titel">
              <TextInput value={settings["home_cta_title"]} onChange={(value) => setValue("home_cta_title", value)} />
            </FormField>
            <FormField label="Footer-Claim">
              <TextInput value={settings["footer_claim"]} onChange={(value) => setValue("footer_claim", value)} />
            </FormField>
            <div className="settings-security-grid">
              <div className="settings-status-tile">
                <Database aria-hidden="true" size={20} />
                <strong>Supabase RLS</strong>
                <small>Schreibzugriffe laufen sessiongebunden über Server-Actions.</small>
              </div>
              <div className="settings-status-tile">
                <Globe2 aria-hidden="true" size={20} />
                <strong>Öffentliche Routen</strong>
                <small>Navigation und CTA-Links werden über gespeicherte Settings gepflegt.</small>
              </div>
            </div>
          </SettingsCard>
        ) : null}
      </div>

      <aside className="settings-side-stack" aria-label="Einstellungen Status">
        <section className="settings-side-card">
          <h2>Zusammenfassung</h2>
          <div className="settings-summary-row">
            <CheckCircle2 aria-hidden="true" size={26} />
            <span>
              <strong>{savedFields} / {SETTING_FIELDS.length}</strong>
              <small>Gespeicherte Felder</small>
            </span>
            <em>{completionPercent}%</em>
          </div>
          <div className="settings-summary-row">
            <Bell aria-hidden="true" size={26} />
            <span>
              <strong>{isDirty ? "Geändert" : "Aktuell"}</strong>
              <small>{isDirty ? "Speichern erforderlich" : `Letzte Speicherung: ${lastSavedAt}`}</small>
            </span>
          </div>
        </section>

        <section className="settings-side-card">
          <h2>Hinweise</h2>
          <ul className="settings-hints">
            <li>Änderungen werden erst nach dem Speichern öffentlich wirksam.</li>
            <li>Bilder werden in die geschützte Admin-Medienlogik hochgeladen.</li>
            <li>Rechte werden im Benutzerbereich verwaltet.</li>
          </ul>
        </section>
      </aside>
      </div>

    </form>
  );
}
