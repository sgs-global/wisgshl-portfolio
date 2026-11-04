import type { Metadata } from "next";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { officeAddress, officeMapUrl } from "@/components/inquiryConfig";
import { OfficeMap } from "@/components/OfficeMap";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Contact Our Manufacturing Team",
  description: "Send WISGSHL your product, quantity, customization and delivery requirements.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="contact-page">
        <section className="contact-hero">
          <div className="container contact-hero-inner">
            <div>
              <p className="eyebrow"><span />Contact WISGSHL</p>
              <h1>Let&apos;s Discuss Your Project.</h1>
            </div>
            <p>Share your lighting or portable energy requirements. Our team will help you plan your next order or project.</p>
          </div>
        </section>

        <section className="contact-main section">
          <div className="container contact-page-grid">
            <ContactForm />
            <aside className="contact-sidebar">
              <div className="contact-details-panel">
                <span>Direct contact</span>
                <a href="mailto:info@globalsgs.com"><Mail size={19} /><div><small>Email</small><strong>info@globalsgs.com</strong></div><ArrowUpRight size={15} /></a>
                <a href="tel:+8615820404334"><Phone size={19} aria-hidden="true" /><div><small>Phone</small><strong>+86 158 2040 4334</strong></div><ArrowUpRight size={15} aria-hidden="true" /></a>
                <a href="https://wa.me/8801622231148" target="_blank" rel="noopener noreferrer"><FaWhatsapp size={19} aria-hidden="true" /><div><small>WhatsApp</small><strong>+880 1622231148</strong></div><ArrowUpRight size={15} aria-hidden="true" /></a>
                <div className="contact-detail"><Clock3 size={19} /><div><small>Response time</small><strong>Business inquiries reviewed promptly</strong></div></div>
              </div>

              <div className="map-card">
                <OfficeMap />
                <div className="map-caption">
                  <MapPin size={19} />
                  <div><small>Main office ? Shenzhen</small><address>{officeAddress}</address><a className="location-link" href={officeMapUrl} target="_blank" rel="noreferrer">Open address in Google Maps <ArrowUpRight size={14} /></a></div>
                </div>
              </div>
              <div className="contact-locations">
                <span>Headquarters &amp; operations</span>
                <h2>Headquartered in Hong Kong, China</h2>
                <dl>
                  <div><dt>International Trade Division</dt><dd>Longgang, Shenzhen</dd></div>
                  <div><dt>R&amp;D &amp; Manufacturing Base</dt><dd>Guzhen, Zhongshan</dd></div>
                </dl>
                <a className="location-link" href="https://www.google.com/maps/search/?api=1&amp;query=Hong%20Kong%2C%20China" target="_blank" rel="noreferrer">View Hong Kong on Google Maps <ArrowUpRight size={14} /></a>
              </div>
            </aside>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
