"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string;
  vertical?: boolean;
};

const initialParts = [
  { label: "Tage", value: 0 },
  { label: "Std", value: 0 },
  { label: "Min", value: 0 },
  { label: "Sek", value: 0 }
];

function getParts(targetDate: string) {
  const diff = Math.max(new Date(targetDate).getTime() - Date.now(), 0);
  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    { label: "Tage", value: days },
    { label: "Std", value: hours },
    { label: "Min", value: minutes },
    { label: "Sek", value: secs }
  ];
}

export function Countdown({ targetDate, vertical }: CountdownProps) {
  const [parts, setParts] = useState(initialParts);

  useEffect(() => {
    const update = () => setParts(getParts(targetDate));
    const initialTimer = window.setTimeout(update, 0);
    const intervalTimer = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(intervalTimer);
    };
  }, [targetDate]);

  return (
    <div className={vertical ? "countdown countdown--vertical" : "countdown"}>
      {parts.map((part) => (
        <div className="countdown__box" key={part.label}>
          <strong>{String(part.value).padStart(part.label === "Tage" ? 1 : 2, "0")}</strong>
          <span>{part.label}</span>
        </div>
      ))}
    </div>
  );
}
