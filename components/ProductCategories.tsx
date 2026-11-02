import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import styles from "./ProductCategories.module.css";

type Category = {
  slug: string;
  title: string;
  description: string;
  image: { src: string; alt: string } | null;
  highlights: string[];
};

// Category images are stored in public/images/assets.
// Add technical highlights only after verification against the catalog.
const categories: Category[] = [
 
  { slug: "led-floodlights", title: "LED Floodlights", description: "Industrial LED floodlights for outdoor areas and commercial project requirements.", image: { src: "/images/assets/led-floodlights.png", alt: "LED floodlights in three sizes outside an industrial building" }, highlights: [] },
  { slug: "portable-power-stations", title: "Portable Power Stations", description: "Portable energy storage solutions for business and outdoor power requirements.", image: { src: "/images/assets/portable-power-stations.png", alt: "Portable power station shown outdoors beside a solar panel" }, highlights: [] },
  { slug: "solar-street-lights", title: "Solar Street Lights", description: "Solar street lighting for outdoor spaces and commercial lighting projects.", image: { src: "/images/assets/solar-street-lights.png", alt: "Solar street lights with mounted solar panels along a road" }, highlights: [] },
  { slug: "led-street-lights", title: "LED Street Lights", description: "Professional LED street lighting for commercial and infrastructure applications.", image: { src: "/images/assets/led-street-lights.png", alt: "LED street lighting fixtures installed along an outdoor road" }, highlights: [] },
  { slug: "led-strip-lights", title: "LED Strip Lights", description: "LED strip lighting for decorative installations and commercial spaces.", image: { src: "/images/assets/led-strip-lights.png", alt: "LED strip light reels and linear lighting in an architectural setting" }, highlights: [] },
];

export function ProductCategories() {
  return (
    <section className={`section ${styles.section}`} id="divisions" aria-labelledby="product-categories-title">
      <div className="container">
        <header className={styles.heading}>
          <p className={styles.eyebrow}><span aria-hidden="true" />What we manufacture</p>
          <h2 id="product-categories-title">Manufactured Lighting &amp; Portable Energy Solutions</h2>
          <p className={styles.intro}>Explore our range of professional LED lighting and portable energy products, developed to support commercial, industrial and outdoor applications across international markets.</p>
        </header>
        <div className={styles.grid}>
          {categories.map((category, index) => (
            <article className={styles.card} key={category.slug}>
              <div className={styles.visual}>
                {category.image ? (
                  <Image src={category.image.src} alt={category.image.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" className={styles.photo} />
                ) : (
                  <div className={styles.placeholder} role="img" aria-label={`${category.title}: product photograph pending`}>
                    <span className={styles.placeholderIndex} aria-hidden="true">0{index + 1}</span>
                    <span className={styles.placeholderLabel}>{category.title}</span>
                    <span className={styles.placeholderCaption}>Product photograph pending</span>
                  </div>
                )}
              </div>
              <div className={styles.content}>
                <span className={styles.number}>Category / 0{index + 1}</span>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                {category.highlights.length > 0 && <ul className={styles.tags}>{category.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
                <Link className={styles.explore} href="/contact" aria-label={`Explore ${category.title} with our manufacturing team`}>Explore Products <ArrowUpRight size={18} aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.footer}>
          <div><span className={styles.eyebrow}>Your next project</span><p>Let’s discuss the right solution for your market.</p></div>
          <Link className={styles.quotation} href="/contact">Request a Quotation <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
