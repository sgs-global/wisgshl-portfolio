import Link from "next/link";
import { FaTiktok, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa6';

// import { ArrowUpRight, Linkedin, Youtube, Instagram, Facebook} from "lucide-react";

import Image from "next/image";

const divisionLinks = ["Solar Energy", "LED Lighting", "Portable Power Stations", "OEM & ODM"];
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
          <Link className="brand" href="/#home" aria-label="WISGSHL home">
            <Image
              className="brand-logo"
              src="/images/sgs_logo.png"
              alt="SGS company logo"
              width={50}
              height={50}
              priority
            />
            <span className="brand-copy">
              <strong>WISGSHL</strong>
              {/* <small>Worldwide Industrial</small> */}
            </span>
        </Link>
          <p>Manufacturing and supplying diverse products for wholesalers, distributors, importers and businesses worldwide.</p>
          <div className="socials" aria-label="Social media placeholders">
           
            <a href="https://www.facebook.com/share/1FMgoKjxhm/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="WISGSHL on Facebook"> <FaFacebook size={19} /></a>
            <a href="https://www.youtube.com/@wisgs" target="_blank" rel="noreferrer" aria-label="WISGSHL on YouTube"><FaYoutube size={19} /></a>
            <a href="https://www.instagram.com/worldwide_industrial_sgs?vrfl=MTdrZGJraDViNHB0bg%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" aria-label="WISGSHL on Instagram"><FaInstagram size={19} /></a>
            <a href="https://www.tiktok.com/@wisgshl?_r=1&_t=ZS-9B0nzL6fo4S" target="_blank" rel="noreferrer" aria-label="WISGSHL on Tiktok"><FaTiktok size={19} /></a>
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
          <h3>Contact</h3>
          {/* <a href="https://www.lightsgs.com/" target="_blank" rel="noreferrer">LightSGS <ArrowUpRight size={13} /></a>
          <a href="https://www.solarsgs.com" target="_blank" rel="noreferrer">SolarSGS <ArrowUpRight size={13} /></a> */}
          {/* <Link href="/#brands">LightSGS <span className="link-note">Link pending</span></Link> */}
          <a href="mailto:info@globalsgs.com">info@globalsgs.com</a>
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
