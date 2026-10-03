import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cpu,
  Factory,
  Globe2,
  HousePlug,
  InspectionPanel,
  Lightbulb,
  Palette,
  Ship,
  ShoppingBag,
  SunMedium,
  UserRound,
  Watch,
  Youtube,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HomeMotion } from "@/components/HomeMotion";

const images = {
  office: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85",
  solar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85",
  lighting: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1200&q=85",
  watch: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=85",
  appliance: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1200&q=85",
  electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=85",
  goods: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=85",
  manufacturing: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1600&q=85",
  logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
  meeting: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
  inspection: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=85",
  packaging: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=85",
  exhibition: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85",
  development: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85",
};

const divisions = [
  { title: "Solar Energy", text: "Solar panels and supporting energy products for residential, commercial and industrial applications.", image: images.solar, icon: SunMedium },
  { title: "LED Lighting", text: "Practical indoor, outdoor and project lighting solutions for diverse market requirements.", image: images.lighting, icon: Lightbulb },
  { title: "Watches & Smart Watches", text: "Classic timepieces and connected wearable products across a range of styles.", image: images.watch, icon: Watch },
  { title: "Small Home Appliances", text: "Everyday appliances selected for contemporary homes and international distribution.", image: images.appliance, icon: HousePlug },
  { title: "Consumer Electronics", text: "Accessible electronics and connected devices aligned with changing consumer needs.", image: images.electronics, icon: Cpu },
  { title: "Consumer Goods", text: "A flexible portfolio of useful products sourced for wholesale and retail channels.", image: images.goods, icon: ShoppingBag },
  { title: "OEM & ODM Customization", text: "Product, packaging and identity customization developed around customer requirements.", image: images.manufacturing, icon: Palette },
  { title: "International Trading", text: "Sourcing and supply coordination that helps products move between global markets.", image: images.logistics, icon: Ship },
];

const supplySteps = [
  {
    number: "01",
    label: "Connect",
    title: "Contact Our Team",
    text: "Reach us through our website, phone, email, or official social media channels. Our team will respond and guide your enquiry.",
    details: ["Website", "Phone & email", "Social media"],
  },
  {
    number: "02",
    label: "Define",
    title: "Tell Us About Your Product",
    text: "Share the product type, specifications, quantity, customization, packaging, target market, and delivery expectations.",
    details: ["Specifications", "Quantity", "OEM / ODM"],
  },
  {
    number: "03",
    label: "Deliver",
    title: "Receive It at Your Door",
    text: "After confirmation, production, and quality checks, we coordinate secure packing and delivery directly to your destination.",
    details: ["Quality checked", "Securely packed", "Direct delivery"],
  },
] as const;

const youtubeChannel = "https://www.youtube.com/@wisgs";

const youtubeVideos = [
  { title: "Company Introduction", text: "Meet WISGSHL and learn about our international manufacturing and supply business.", image: images.development, href: youtubeChannel },
  { title: "Products & Demonstrations", text: "Watch product presentations covering solar, LED lighting and consumer products.", image: images.solar, href: youtubeChannel },
  { title: "Manufacturing Stories", text: "Follow production, quality processes and business updates from our team.", image: images.manufacturing, href: youtubeChannel },
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span />{children}</p>;
}

function SectionHeading({ eyebrow, title, text, center = false }: { eyebrow: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={`section-heading ${center ? "center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function ImageNote() {
  return <span className="image-note">Representative image</span>;
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HomeMotion />
        <section className="hero" id="home">
          <div className="hero-main container">
            <div className="hero-copy">
              <h1 className="hero-title" aria-label="Worldwide Industrial SGS Holdings Limited">
                <span className="hero-title-mask"><span className="hero-title-line"><span className="hero-company-prefix">Worldwide Industrial</span>{" "}<em>SGS Holdings Limited</em></span></span>
              </h1>
            </div>
            <div className="hero-team-stage">
              <Image className="hero-port-bg" src="/images/wisgshl-products-led-3d.png" alt="" fill priority sizes="(max-width: 700px) 100vw, 1240px" aria-hidden="true" />
              <div className="hero-stage-wash" />
              <div className="hero-team-photo-wrap">
                <Image className="hero-team-photo" src="/images/Image_2026.png" alt="The WISGSHL team" width={2718} height={980} unoptimized priority sizes="(max-width: 700px) 100vw, 1240px" />
              </div>
              <div className="hero-below">
                <div className="hero-logistics-bar">
                  <span><Factory size={17} /> Manufacturing</span>
                  <span><InspectionPanel size={17} /> Quality focus</span>
                  <span><Ship size={17} /> Global supply</span>
                </div>
                <p className="hero-lead">SGS is a global manufacturer and supplier of solar energy products, LED lighting, lithium battery solutions, smart electronics, and consumer gadgets. Through advanced manufacturing, OEM/ODM customization, and international distribution, we deliver reliable and innovative products to customers worldwide.</p>
                <div className="button-row">
                  <a className="button button-primary button-large" href="/business-inquiry">Explore Our Businesses <ArrowRight size={18} /></a>
                  <a className="button button-quiet button-large" href="/contact">Contact Our Team <ArrowUpRight size={18} /></a>
                </div>
                <div className="trust-line"><span className="trust-avatars"><i>SG</i><i>25+</i><i>∞</i></span><p><strong>Since 1998</strong><br />Building business relationships</p></div>
              </div>
            </div>
            <div className="stats-grid hero-metrics" aria-label="Company statistics">
              {[["1998", "Since", "Business experience"], ["800+", "Trusted by", "Clients"], ["500+", "Delivered", "Services / orders"], ["500+", "Welcomed", "Company visitors"]].map(([number, kicker, label]) => (
                <div className="stat-card" key={label}><span>{kicker}</span><strong>{number}</strong><p>{label}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="container split-grid">
            <div className="about-visual about-video-frame">
              <video controls playsInline preload="metadata" poster={images.office} aria-label="WISGSHL company introduction video">
                <source src="/videos/company-introduction.mp4" type="video/mp4" />
                Your browser does not support HTML video.
              </video>
              <div className="about-video-label"><span>Company introduction</span><strong>Watch Our Business Story</strong></div>
              <div className="about-badge"><span>25+</span> years of<br />business experience</div>
            </div>
            <div className="about-copy">
              <SectionHeading eyebrow="About WISGSHL" title="Built on Experience. Focused on Manufacturing." />
              <p className="large-copy">Worldwide Industrial SGS Holdings Limited is an international manufacturer and supplier focused on dependable products, OEM/ODM customization, and wholesale business.</p>
              <p>Our business spans multiple product categories, including solar energy products, LED lighting, watches, small home appliances, and consumer goods.</p>
              <div className="mini-features">
                <div><Globe2 /><span><strong>International outlook</strong>Connecting opportunity across markets</span></div>
                <div><Factory /><span><strong>Manufacturing focused</strong>Products developed for business requirements</span></div>
              </div>
              <a className="text-link" href="#divisions">Discover Our Company <ArrowRight size={17} /></a>
            </div>
          </div>
        </section>

        <section className="section divisions" id="divisions">
          <div className="container">
            <div className="heading-row">
              <SectionHeading eyebrow="What we manufacture" title="Our Product Categories" text="A diversified portfolio supported by production experience, product development and international wholesale supply." />
              <a className="text-link desktop-link" href="/business-inquiry">Discuss your project <ArrowRight size={17} /></a>
            </div>
            <div className="division-grid">
              {divisions.map(({ title, text, image, icon: Icon }, index) => (
                <a className="division-card" href={title === "Solar Energy" ? "https://www.solarsgs.com" : "/contact"} target={title === "Solar Energy" ? "_blank" : undefined} rel="noreferrer" key={title}>
                  <div className="division-image"><Image src={image} alt={`Representative ${title} image`} fill quality={95} sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw" /><span className="card-number">0{index + 1}</span><ImageNote /></div>
                  <div className="division-content"><Icon size={22} /><h3>{title}</h3><p>{text}</p><span className="card-arrow"><ArrowUpRight size={17} /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section supply-journey" id="manufacturing">
          <div className="container">
            <SectionHeading
              eyebrow="From requirement to supply"
              title="Three Steps to Your Door"
              text="A clear, guided process from your first conversation with our team to the final delivery of your products."
              center
            />
            <div className="supply-flow">
              {supplySteps.map((step, index) => (
                <article className={`supply-step ${index === 0 ? "is-active" : ""}`} data-step={index} key={step.number}>
                  <div className="supply-light" aria-hidden="true">
                    <span className="supply-light-aura" />
                    <span className="supply-light-rays">
                      {Array.from({ length: 8 }, (_, ray) => <i key={ray} />)}
                    </span>
                    <span className="supply-bulb"><Lightbulb strokeWidth={1.35} /></span>
                    <span className="supply-light-floor" />
                  </div>
                  <div className="supply-step-card">
                    <div className="supply-step-topline">
                      <span>{step.number}</span>
                      <small>{step.label}</small>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    <div className="supply-detail-list">
                      {step.details.map((detail) => <span key={detail}><Check size={13} />{detail}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="supply-journey-cta">
              <a className="button button-primary button-large" href="/contact">Start Your Requirement <ArrowRight size={17} /></a>
            </div>
          </div>
        </section>

        <section className="section gallery-section" id="inside-sgs">
          <div className="container">
            <div className="heading-row"><SectionHeading eyebrow="A closer look" title="Inside SGS" text="A view into the activities that support collaboration, product development and international supply." /><span className="placeholder-key">All gallery images are representative</span></div>
            <div className="gallery-grid">
              {[
                [images.meeting, "Team meetings", "Collaboration"], [images.manufacturing, "Manufacturing facilities", "Production"], [images.inspection, "Product inspection", "Quality process"], [images.packaging, "Packaging activities", "Supply"], [images.exhibition, "Company events", "Business"],
              ].map(([src, title, label], i) => <div className={`gallery-item gallery-${i + 1}`} key={title}><Image src={src} alt={`Representative ${title}`} fill sizes="(max-width: 700px) 100vw, 50vw" /><div><span>{label}</span><h3>{title}</h3></div></div>)}
            </div>
          </div>
        </section>

        <section className="section team" id="team">
          <div className="container">
            <SectionHeading eyebrow="The people behind the work" title="Our Team" text="Eight profile spaces prepared for individual portraits, positions and professional information." center />
            <div className="team-card-grid">
              {Array.from({ length: 8 }, (_, index) => (
                <article className="team-member-card" key={index}>
                  <div className="team-member-photo"><UserRound size={34} /><span>0{index + 1}</span></div>
                  <div className="team-member-copy">
                    <span>Team profile</span>
                    <h3>Name to be added</h3>
                    <strong>Position / Department</strong>
                    <p>Professional information and responsibilities will be added here.</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section youtube-section" id="videos">
          <div className="container">
            <div className="youtube-heading">
              <SectionHeading eyebrow="Stories in motion" title="Watch WISGSHL on YouTube" text="Company introductions, product demonstrations and manufacturing stories published through our official YouTube channel." />
              <a className="button button-primary" href={youtubeChannel} target="_blank" rel="noreferrer">Visit YouTube Channel <Youtube size={18} /></a>
            </div>
            <div className="youtube-grid">
              {youtubeVideos.map((video) => (
                <a className="youtube-card" href={video.href} target="_blank" rel="noreferrer" key={video.title}>
                  <div className="youtube-thumbnail"><Image src={video.image} alt={`${video.title} YouTube preview`} fill quality={95} sizes="(max-width: 700px) 100vw, 33vw" /><span><Youtube size={24} /></span></div>
                  <div><small>Official YouTube</small><h3>{video.title}</h3><p>{video.text}</p><strong>Watch on YouTube <ArrowUpRight size={15} /></strong></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section brands" id="brands">
          <div className="container">
            <SectionHeading eyebrow="Focused business identities" title="Our Brands & Business Websites" text="Verified specialist brands within the wider WISGSHL business portfolio." center />
            <div className="brand-cards">
              <article><div className="sub-brand solar-brand"><SunMedium /><strong>Solar<span>SGS</span></strong></div><p>Solar energy products and supporting solutions for residential, commercial and industrial needs.</p><a className="button button-outline" href="https://www.solarsgs.com" target="_blank" rel="noreferrer">Visit Website <ArrowUpRight size={16} /></a></article>
              <article><div className="sub-brand light-brand"><Lightbulb /><strong>Light<span>SGS</span></strong></div><p>LED lighting products for practical indoor, outdoor and project applications.</p><span className="pending-link">Official website link pending</span></article>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <div><SectionHeading eyebrow="Contact our team" title="Tell Us What You Need" text="Share your product, quantity, customization and delivery requirements with our manufacturing team." /><a className="button button-primary button-large" href="/contact">Open Contact Form <ArrowRight size={18} /></a></div>
            <div className="contact-card"><span>Business contact</span><a href="mailto:manager@globalsgs.com">manager@globalsgs.com <ArrowUpRight size={16} /></a><a href="tel:+8615820404334">+86 158 2040 4334 <ArrowUpRight size={16} /></a><p>Use the contact page to provide complete product and company information.</p><div><Check size={15} /> Direct customer inquiries welcome</div></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
