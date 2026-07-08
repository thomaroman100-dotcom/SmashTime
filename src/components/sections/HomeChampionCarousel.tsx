"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Champion } from "@/data/champions";

type HomeChampionCarouselProps = {
  champions: Champion[];
};

export function HomeChampionCarousel({ champions }: HomeChampionCarouselProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const maxIndex = Math.max(champions.length - 1, 0);
  const visibleActiveIndex = Math.min(activeIndex, maxIndex);

  const updateActiveIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-champion-index]"));
    if (cards.length === 0) return;

    const railLeft = rail.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, fallbackIndex) => {
      const distance = Math.abs(card.getBoundingClientRect().left - railLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = Number(card.dataset.championIndex ?? fallbackIndex);
      }
    });

    setActiveIndex((current) => (current === closestIndex ? current : closestIndex));
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const rail = railRef.current;
      const target = rail?.querySelector<HTMLElement>(`[data-champion-index="${index}"]`);
      if (!target) return;

      target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      setActiveIndex(index);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = Math.min(Math.max(visibleActiveIndex + direction, 0), maxIndex);
      scrollToIndex(nextIndex);
    },
    [maxIndex, scrollToIndex, visibleActiveIndex]
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveIndex);
    };

    updateActiveIndex();
    rail.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", onScroll);
    };
  }, [updateActiveIndex]);

  if (champions.length === 0) return null;

  return (
    <div className="home-champions__carousel" aria-roledescription="Karussell">
      <div
        className="home-champions__viewport"
        ref={railRef}
        tabIndex={0}
        aria-label="Champions horizontal durchsuchen"
        onKeyDown={handleKeyDown}
      >
        <div className="home-champions__track">
          {champions.map((champion, index) => (
            <Link
              href={`/champions/${champion.slug}`}
              className="champion-tile"
              key={champion.slug}
              data-champion-index={index}
            >
              <div className="champion-tile__image">
                <Image
                  src={champion.image}
                  alt={champion.name}
                  fill
                  sizes="(max-width: 560px) 78vw, (max-width: 767px) 45vw, (max-width: 1023px) 22vw, 22vw"
                />
                <span className="champion-tile__crown" aria-hidden="true">
                  <Crown size={16} strokeWidth={2.2} />
                </span>
              </div>
              <strong>{champion.name}</strong>
              <span>{champion.weightClass}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="home-champions__dots" aria-label="Champion-Auswahl">
        {champions.map((champion, index) => (
          <button
            type="button"
            className={`home-champions__dot${visibleActiveIndex === index ? " home-champions__dot--active" : ""}`}
            aria-label={`${champion.name} anzeigen`}
            aria-current={visibleActiveIndex === index ? "true" : undefined}
            key={champion.slug}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
