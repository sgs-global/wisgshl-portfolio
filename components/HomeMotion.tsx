"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HomeMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

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

        const supplySteps = gsap.utils.toArray<HTMLElement>(".supply-step");
        const activateSupplyStep = (activeIndex: number) => {
          supplySteps.forEach((step, index) => step.classList.toggle("is-active", index === activeIndex));
        };

        supplySteps.forEach((step, index) => {
          const card = step.querySelector(".supply-step-card");
          const light = step.querySelector(".supply-light");

          gsap.from(card, {
            autoAlpha: 0,
            x: index % 2 === 0 ? 70 : -70,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 78%", once: true },
          });

          gsap.from(light, {
            autoAlpha: 0,
            scale: 0.82,
            duration: 0.8,
            ease: "back.out(1.35)",
            scrollTrigger: { trigger: step, start: "top 82%", once: true },
          });

          ScrollTrigger.create({
            trigger: step,
            start: "top center",
            end: "bottom center",
            onEnter: () => activateSupplyStep(index),
            onEnterBack: () => activateSupplyStep(index),
          });
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

    return () => context.revert();
  }, []);

  return null;
}
