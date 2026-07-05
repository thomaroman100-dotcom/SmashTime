"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Countdown } from "@/components/sections/Countdown";

type CountdownBarProps = {
  label: string;
  targetDate?: string;
  ctaLabel: string;
  ctaHref: string;
  fallback: string;
};

export function CountdownBar({ label, targetDate, ctaLabel, ctaHref, fallback }: CountdownBarProps) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) {
      return;
    }
    const check = () => setExpired(new Date(targetDate).getTime() <= Date.now());
    const initialTimer = window.setTimeout(check, 0);
    const intervalTimer = window.setInterval(check, 1000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(intervalTimer);
    };
  }, [targetDate]);

  const hasTarget = Boolean(targetDate) && !expired;

  return (
    <section className="home-countdown" aria-label={label}>
      <div className="container home-countdown__inner">
        {hasTarget ? (
          <>
            <span className="home-countdown__label">{label}</span>
            <Countdown targetDate={targetDate as string} />
            <Link href={ctaHref} className="btn btn--outline home-countdown__cta">
              <span>{ctaLabel}</span>
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
            </Link>
          </>
        ) : (
          <span className="home-countdown__label">{fallback}</span>
        )}
      </div>
    </section>
  );
}
