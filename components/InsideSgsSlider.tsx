"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { GalleryImage } from "./insideSgsConfig";
import styles from "./InsideSgs.module.css";

export function InsideSgsSlider({ images, number, label, team = false, onExpand }: { images: GalleryImage[]; number: string; label: string; team?: boolean; onExpand?: (photo: GalleryImage) => void }) {
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [failed, setFailed] = useState<string[]>([]);
  const [ready, setReady] = useState<string[]>([]);
  const [navigation, setNavigation] = useState<{ selected: string | null; visited: string[] }>({ selected: null, visited: [] });
  const photos = images.filter((image) => !failed.includes(image.src));
  const active = Math.max(0, photos.findIndex((image) => image.src === navigation.selected));
  const selected = photos[active];
  const previousReady = [...ready].reverse().find((src) => photos.some((photo) => photo.src === src));
  const visibleSrc = selected && ready.includes(selected.src) ? selected.src : (previousReady ?? selected?.src);
  const show = (src: string) => setNavigation((current) => ({ selected: src, visited: [...new Set([...current.visited, src])] }));
  const multiple = photos.length > 1;
  function move(delta: number) {
    if (multiple) show(photos[(active + delta + photos.length) % photos.length].src);
  }

  return (
    <div className={`${styles.slot} ${styles.slider} ${team ? styles.teamSlider : ""}`} role="region" aria-label={`${label} photographs`} aria-roledescription={multiple ? "carousel" : undefined}
      tabIndex={multiple ? 0 : undefined}
      onKeyDown={(event) => {
        if (!multiple) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault(); show(photos[event.key === "Home" ? 0 : photos.length - 1].src);
        }
      }}
      onTouchStart={(event) => {
        const first = event.touches[0];
        touch.current = event.touches.length === 1 ? { x: first.clientX, y: first.clientY } : null;
      }}
      onTouchCancel={() => { touch.current = null; }}
      onTouchEnd={(event) => {
        const start = touch.current;
        touch.current = null;
        const end = event.changedTouches[0];
        if (!start || !end) return;
        const dx = end.clientX - start.x;
        const dy = end.clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx > 0 ? -1 : 1);
      }}>
      {photos.length === 0 ? (
        <div className={styles.placeholder} role="img" aria-label={`${label}: photograph pending`}>
          <span aria-hidden="true">{number}</span><strong>{label}</strong><small>Company photograph pending</small>
        </div>
      ) : photos.map((image, index) => {
        if (index !== 0 && image.src !== selected?.src && !navigation.visited.includes(image.src)) return null;
        return (
          <div key={image.src} className={`${styles.slide} ${image.src === visibleSrc ? styles.activeSlide : ""}`} aria-hidden={image.src !== visibleSrc}>
            <Image src={image.src} alt={image.src === visibleSrc ? image.alt : ""} fill preload={team && index === 0} loading={team && index === 0 ? undefined : "lazy"} sizes="(max-width: 800px) 100vw, 60vw"
              onLoad={() => setReady((current) => current.includes(image.src) ? current : [...current, image.src])}
              onError={() => setFailed((current) => current.includes(image.src) ? current : [...current, image.src])} />
          </div>
        );
      })}
      {team && selected && onExpand && <button type="button" className={styles.photoExpand} onClick={() => onExpand(photos.find((photo) => photo.src === visibleSrc) ?? selected)} aria-label="Expand team photograph" aria-haspopup="dialog"><span className={styles.expand}><Expand size={16} aria-hidden="true" />View team photograph</span></button>}
      {multiple && <>
        <div className={styles.sliderShade} aria-hidden="true" />
        <button type="button" className={`${styles.sliderArrow} ${styles.previous}`} onClick={() => move(-1)} aria-label={`Previous ${label} photograph`}><ChevronLeft size={21} aria-hidden="true" /></button>
        <button type="button" className={`${styles.sliderArrow} ${styles.next}`} onClick={() => move(1)} aria-label={`Next ${label} photograph`}><ChevronRight size={21} aria-hidden="true" /></button>
        <div className={styles.pagination} aria-label={`${label} image navigation`}>
          {photos.map((image, index) => <button type="button" key={image.src} aria-label={`Show ${label} photograph ${index + 1} of ${photos.length}`} aria-current={index === active ? "true" : undefined} onClick={() => show(image.src)}><span /></button>)}
        </div>
        <span className={styles.imageCount} aria-hidden="true">{String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
        <span className={styles.srOnly} aria-live="polite" aria-atomic="true">{label}: photograph {active + 1} of {photos.length}</span>
      </>}
    </div>
  );
}
