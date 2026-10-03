import type { Metadata } from "next";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Contact Our Manufacturing Team",
  description: "Send WISGSHL your product, quantity, customization and delivery requirements.",
};

const mapQuery = encodeURIComponent("Worldwide Industrial SGS Holdings Limited");

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="contact-page">
        <section className="contact-hero">
          <div className="container contact-hero-inner">
            <div>
              <p className="eyebrow"><span />Contact WISGSHL</p>
              <h1>Let&apos;s Discuss Your Product Requirements.</h1>
            </div>
            <p>Provide your product, quantity, customization and delivery information. Our manufacturing team can then review your inquiry with the right context.</p>
          </div>
        </section>

        <section className="contact-main section">
          <div className="container contact-page-grid">
            <ContactForm />
            <aside className="contact-sidebar">
              <div className="contact-details-panel">
                <span>Direct contact</span>
                <a href="mailto:manager@globalsgs.com"><Mail size={19} /><div><small>Email</small><strong>manager@globalsgs.com</strong></div><ArrowUpRight size={15} /></a>
                <a href="tel:+8615820404334"><Phone size={19} /><div><small>Phone / WhatsApp</small><strong>+86 158 2040 4334</strong></div><ArrowUpRight size={15} /></a>
                <div className="contact-detail"><Clock3 size={19} /><div><small>Response time</small><strong>Business inquiries reviewed promptly</strong></div></div>
              </div>

              <div className="map-card">
                <iframe
                  title="WISGSHL location map"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="map-caption">
                  <MapPin size={19} />
                  <div><small>Office address</small><strong>Exact street address awaiting confirmation</strong><p>The map currently searches by the registered company name.</p></div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="contact-help">
          <div className="container contact-help-grid">
            <div><span>01</span><h3>Describe the product</h3><p>Include model, materials, specifications or reference images.</p></div>
            <div><span>02</span><h3>Share order details</h3><p>Tell us the expected quantity, packaging and customization needs.</p></div>
            <div><span>03</span><h3>Confirm destination</h3><p>Add the target market, delivery country, city or preferred port.</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
