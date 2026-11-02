"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HomeMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      // One controller owns the active step, including on reverse scroll and refresh.
      // Cache layout measurements on refresh; no per-frame bounding-box reads.
      const flow = document.querySelector<HTMLElement>(".supply-flow");
      const steps = gsap.utils.toArray<HTMLElement>(".supply-flow .supply-step");
      if (flow && steps.length) {
        let centers: number[] = [];
        let activeIndex = -1;
        const measure = () => {
          centers = steps.map((step) => step.offsetTop + step.offsetHeight / 2);
        };
        measure();
        const synchronize = (progress: number) => {
          const position = centers[0] + progress * (centers[centers.length - 1] - centers[0]);
          let nextIndex = 0;
          centers.forEach((center, index) => {
            if (Math.abs(center - position) < Math.abs(centers[nextIndex] - position)) nextIndex = index;
          });
          if (nextIndex !== activeIndex) {
            activeIndex = nextIndex;
            steps.forEach((step, index) => step.classList.toggle("is-active", index === activeIndex));
          }
          flow.style.setProperty("--journey-position", `${position}px`);
        };
        const journeyTrigger = ScrollTrigger.create({
          trigger: flow,
          start: () => `${centers[0]}px center`,
          end: () => `${centers[centers.length - 1]}px center`,
          onRefreshInit: measure,
          onRefresh: (self) => synchronize(self.progress),
          onUpdate: (self) => synchronize(self.progress),
        });
        synchronize(journeyTrigger.progress);
      }

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        heroTimeline
          .from(".hero-title-line", { autoAlpha: 0, yPercent: 105, rotateX: -7, duration: 1.05 })
          .from(".hero-team-stage", { clipPath: "inset(0 0 100% 0 round 28px)", y: 35, duration: 1.15, ease: "power4.inOut" }, "-=0.48")
          .from(".hero-team-photo", { autoAlpha: 0, y: 52, duration: 1.25, ease: "power3.out" }, "-=0.82")
          .from(".hero-logistics-bar span", { autoAlpha: 0, y: 12, stagger: 0.1, duration: 0.4 }, "-=0.58")
          .from(".hero-below > *:not(.hero-logistics-bar)", { autoAlpha: 0, y: 22, duration: 0.62, stagger: 0.11 }, "-=0.32");

        gsap.to(".hero-team-photo", {
          yPercent: -3.5,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-team-stage",
            start: "top 85%",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        gsap.from(".stat-card", {
          autoAlpha: 0,
          y: 35,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".stats-grid", start: "top 88%", once: true },
        });

        gsap.utils.toArray<HTMLElement>(".section-heading").forEach((heading) => {
          gsap.from(heading.children, {
            autoAlpha: 0,
            y: 28,
            stagger: 0.09,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 86%", once: true },
          });
        });

        ScrollTrigger.batch(".team-member-card", {
          start: "top 90%",
          once: true,
          onEnter: (elements) => gsap.from(elements, {
            autoAlpha: 0,
            y: 38,
            scale: 0.985,
            stagger: 0.07,
            duration: 0.68,
            ease: "power3.out",
          }),
        });

        const stage = document.querySelector<HTMLElement>(".hero-team-stage");
        const photo = document.querySelector<HTMLElement>(".hero-team-photo");
        const backdrop = document.querySelector<HTMLElement>(".hero-port-bg");

        if (stage && photo && backdrop && window.matchMedia("(pointer: fine)").matches) {
          const move = (event: PointerEvent) => {
            const bounds = stage.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            gsap.to(backdrop, { x: x * -7, y: y * -4, scale: 1.025, duration: 1, ease: "power2.out" });
          };
          const reset = () => {
            gsap.to(backdrop, { x: 0, y: 0, scale: 1, duration: 1, ease: "power2.out" });
          };
          stage.addEventListener("pointermove", move);
          stage.addEventListener("pointerleave", reset);
          return () => {
            stage.removeEventListener("pointermove", move);
            stage.removeEventListener("pointerleave", reset);
          };
        }
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-title-line, .hero-team-stage, .hero-team-photo, .hero-below > *:not(.hero-logistics-bar), .stat-card, .section-heading > *, .team-member-card, .supply-step-card, .supply-light", {
          clearProps: "all",
        });
      });
    });

    return () => {
      context.revert();
      document.querySelector<HTMLElement>(".supply-flow")?.style.removeProperty("--journey-position");
      document.querySelectorAll(".supply-flow .supply-step").forEach((step, index) => {
        step.classList.toggle("is-active", index === 0);
      });
    };
  }, []);

  return null;
}
