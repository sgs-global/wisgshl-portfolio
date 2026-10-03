import Link from "next/link";
import { ArrowUpRight, Linkedin, Youtube } from "lucide-react";

const divisionLinks = ["Solar Energy", "LED Lighting", "Watches", "Home Appliances", "OEM & ODM"];
const quickLinks = [
  ["About Us", "/#about"],
  ["Products", "/#divisions"],
  ["Our Team", "/#team"],
  ["Business Inquiry", "/business-inquiry"],
  ["Contact Us", "/contact"],
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-intro">
          <Link className="brand brand-light" href="/#home">
            <span className="brand-mark">W</span>
            <span className="brand-copy"><strong>WISGSHL</strong><small>Worldwide Industrial</small></span>
          </Link>
          <p>Manufacturing and supplying diverse products for wholesalers, distributors, importers and businesses worldwide.</p>
          <div className="socials" aria-label="Social media placeholders">
            <a href="/contact" aria-label="LinkedIn — link to be confirmed"><Linkedin size={18} /></a>
            <a href="https://www.youtube.com/@wisgs" target="_blank" rel="noreferrer" aria-label="WISGSHL on YouTube"><Youtube size={19} /></a>
          </div>
        </div>
        <div>
          <h3>Company</h3>
          {quickLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>
        <div>
          <h3>Product Categories</h3>
          {divisionLinks.map((item) => <Link key={item} href="/#divisions">{item}</Link>)}
        </div>
        <div>
          <h3>Brands & Contact</h3>
          <a href="https://www.solarsgs.com" target="_blank" rel="noreferrer">SolarSGS <ArrowUpRight size={13} /></a>
          <Link href="/#brands">LightSGS <span className="link-note">Link pending</span></Link>
          <a href="mailto:manager@globalsgs.com">manager@globalsgs.com</a>
          <a href="tel:+8615820404334">+86 158 2040 4334</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Worldwide Industrial SGS Holdings Limited.</p>
        <div><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Use</Link></div>
      </div>
    </footer>
  );
}
