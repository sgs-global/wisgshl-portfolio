import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Factory,
  Globe2,
  Handshake,
  PackageCheck,
  Palette,
  Ship,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Business Inquiry",
  description: "Explore WISGSHL manufacturing, OEM/ODM, wholesale, sourcing and international supply opportunities.",
};

const businessServices = [
  { icon: Factory, title: "Product Manufacturing", text: "Discuss production requirements for solar products, LED lighting, electronics, appliances and consumer goods." },
  { icon: Palette, title: "OEM & ODM Projects", text: "Develop customized products, specifications, branding and packaging around your market requirements." },
  { icon: Boxes, title: "Wholesale Supply", text: "Request scalable supply options for distributors, importers, retailers and project-based customers." },
  { icon: PackageCheck, title: "Product Sourcing", text: "Share a product brief or reference so our team can review suitable sourcing and production options." },
  { icon: Ship, title: "International Distribution", text: "Coordinate order preparation and international supply requirements for your target country or market." },
  { icon: Handshake, title: "Long-Term Cooperation", text: "Build recurring supply programs and product partnerships supported by clear commercial requirements." },
];

const inquiryDetails = [
  "Product name, model or reference images",
  "Estimated order quantity and target price",
  "Required specifications or certifications",
  "Logo, packaging or customization requirements",
  "Destination country, city or preferred port",
  "Expected schedule or delivery requirement",
];

export default function BusinessInquiryPage() {
  return (
    <>
      <Header />
      <main className="business-page">
        <section className="business-hero">
          <div className="container business-hero-grid">
            <div>
              <p className="eyebrow"><span />Business inquiry</p>
              <h1>Manufacturing and Supply Opportunities Built Around Your Business.</h1>
              <p>Explore the ways WISGSHL can support product development, customization, wholesale purchasing and international distribution.</p>
              <div className="button-row">
                <Link className="button button-primary button-large" href="/contact">Send Your Requirements <ArrowRight size={18} /></Link>
                <Link className="button button-quiet button-large" href="/#divisions">View Product Categories</Link>
              </div>
            </div>
            <aside className="business-hero-panel">
              <Globe2 size={28} />
              <span>International business support</span>
              <h2>From an initial brief to finished product supply.</h2>
              <p>Every inquiry is reviewed according to product type, quantity, customization, destination and commercial requirements.</p>
              <div><strong>25+</strong><small>Years of business experience</small></div>
            </aside>
          </div>
        </section>

        <section className="section business-services">
          <div className="container">
            <div className="section-heading center">
              <p className="eyebrow"><span />Ways we can work together</p>
              <h2>Business Services</h2>
              <p>Select the type of cooperation that best matches your project or purchasing requirements.</p>
            </div>
            <div className="business-service-grid">
              {businessServices.map(({ icon: Icon, title, text }, index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <Icon size={24} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section inquiry-details-section">
          <div className="container inquiry-details-grid">
            <div>
              <p className="eyebrow"><span />Prepare your inquiry</p>
              <h2>Information That Helps Us Respond Accurately</h2>
              <p>Detailed requirements allow our team to review feasibility and communicate more efficiently.</p>
            </div>
            <div className="inquiry-checklist">
              {inquiryDetails.map((detail, index) => <div key={detail}><span>{index + 1}</span><p>{detail}</p></div>)}
            </div>
          </div>
        </section>

        <section className="business-final-cta">
          <div className="container">
            <div><span>Ready to begin?</span><h2>Tell us what your business needs.</h2></div>
            <a className="button button-light button-large" href="/contact">Open Inquiry Form <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
