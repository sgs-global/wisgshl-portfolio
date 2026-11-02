"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { insideSgsCategories, type GalleryImages, type GalleryImage } from "./insideSgsConfig";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./InsideSgs.module.css";
import { InsideSgsSlider } from "./InsideSgsSlider";

export function InsideSgs({ images }: { images: GalleryImages }) {
  const section = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef("");
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryImage | undefined>(images.team[0]);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("article[data-gallery-reveal]"));
    const reveals = root.querySelectorAll<HTMLElement>("[data-gallery-reveal]");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          observer?.unobserve(entry.target);
        }
      });
    }, { threshold: .12 }) : null;
    const configure = () => {
      observer?.disconnect();
      reveals.forEach((row) => {
        if (motion.matches || !observer) row.classList.add(styles.visible);
        else if (!row.classList.contains(styles.visible)) observer.observe(row);
      });
      root.classList.toggle(styles.motionReady, !motion.matches && !!observer);
    };
    configure();
    motion.addEventListener("change", configure);

    // One scroll controller selects the category nearest the viewport center.
    // Layout is measured only on refresh; updates only toggle a changed index.
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      let centers: number[] = [];
      let active = -1;
      const measure = () => {
        const origin = root.getBoundingClientRect().top;
        centers = rows.map((row) => {
          const bounds = row.getBoundingClientRect();
          return bounds.top - origin + bounds.height / 2;
        });
      };
      const select = (progress: number) => {
        const position = centers[0] + progress * (centers[centers.length - 1] - centers[0]);
        let nearest = 0;
        centers.forEach((center, index) => {
          if (Math.abs(center - position) < Math.abs(centers[nearest] - position)) nearest = index;
        });
        if (nearest === active) return;
        active = nearest;
        rows.forEach((row, index) => row.classList.toggle(styles.activeCategory, index === nearest));
      };
      measure();
      const controller = ScrollTrigger.create({
        trigger: root,
        start: () => `${centers[0]}px center`,
        end: () => `${centers[centers.length - 1]}px center`,
        onRefreshInit: measure,
        onRefresh: (self) => select(self.progress),
        onUpdate: (self) => select(self.progress),
      });
      select(controller.progress);
    }, root);
    return () => {
      observer?.disconnect();
      motion.removeEventListener("change", configure);
      context.revert();
      root.classList.remove(styles.motionReady);
      rows.forEach((row) => row.classList.remove(styles.activeCategory));
    };
  }, []);

  useEffect(() => {
    const modal = dialog.current;
    return () => {
      if (modal?.open) document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function openPhoto(photo: GalleryImage) {
    if (!dialog.current || dialog.current.open) return;
    opener.current = document.activeElement as HTMLElement | null;
    setLightboxPhoto(photo);
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
  }
  function restorePage() {
    document.body.style.overflow = previousOverflow.current;
    opener.current?.focus({ preventScroll: true });
  }

  return (
    <section ref={section} className={`section ${styles.section}`} id="inside-sgs" aria-labelledby="inside-sgs-title">
      <div className="container">
        <header className={styles.heading}>
          <p className="eyebrow"><span />A closer look</p>
          <h2 id="inside-sgs-title">Inside SGS</h2>
          <p className={styles.subtitle}>From Product Development to Global Supply</p>
          <p className={styles.intro}>Explore the people, products and processes behind Worldwide Industrial SGS Holdings Limited. Discover our team, product development activities, manufacturing operations and international supply capabilities.</p>
        </header>

        <article className={styles.team} data-gallery-reveal>
          <div className={styles.visuals}>
            <InsideSgsSlider images={images.team} number="01" label="Our Team & Operations" team onExpand={openPhoto} />
          </div>
          <div className={styles.copy}>
            <span className={styles.kicker}>01 / OUR TEAM</span>
            <h3>Our Team &amp; Operations</h3>
            <p>Meet the people behind WISGSHL and discover the team supporting our international manufacturing and supply activities.</p>
            <a className={styles.link} href="#contact">Meet your manufacturing partner <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </article>

        <div className={styles.categories}>
          {insideSgsCategories.map((category, index) => {
            const categoryImages = images[category.id];
            const number = `0${index + 2}`;
            return (
              <article className={styles.category} key={category.id} data-gallery-reveal aria-labelledby={`inside-${category.id}`}>
                <div className={`${styles.presentation} ${category.imageSide === "right" ? styles.imageRight : ""}`}>
                  <div className={styles.visuals}>
                    <InsideSgsSlider images={categoryImages} number={number} label={category.title} />
                  </div>
                  <div className={styles.copy}>
                    <span className={styles.kicker}>{number} / {category.label}</span>
                    <h3 id={`inside-${category.id}`}>{category.title}</h3>
                    <p>{category.description}</p>
                    <a className={styles.link} href="#contact">Discuss Your Project <ArrowUpRight size={17} aria-hidden="true" /></a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.cta} data-gallery-reveal>
          <div><h3>Looking for a Reliable Manufacturing Partner?</h3><p>Let&apos;s discuss your product requirements, customization needs and international supply opportunities.</p></div>
          <a className="button button-primary" href="#contact">Discuss Your Project <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
      <dialog ref={dialog} className={styles.lightbox} aria-labelledby="team-lightbox-title" onClose={restorePage} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className={styles.lightboxContent}>
          <header><h3 id="team-lightbox-title">Our Team &amp; Operations</h3><button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close team photograph"><X size={23} /></button></header>
          {lightboxPhoto && <Image src={lightboxPhoto.src} alt={lightboxPhoto.alt} width={2128} height={1080} sizes="96vw" />}
        </div>
      </dialog>
    </section>
  );
}
