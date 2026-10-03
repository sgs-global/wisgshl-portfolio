"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  ["Home", "/#home"],
  ["About Us", "/#about"],
  ["Products", "/#divisions"],
  ["Our Team", "/#team"],
  ["Contact Us", "/contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
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

        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Main navigation">
          <div className="mobile-nav-head">
            <span>Navigation</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button>
          </div>
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a className="button button-primary mobile-inquiry" href="/business-inquiry" onClick={() => setOpen(false)}>
            Business Inquiry <ArrowUpRight size={16} />
          </a>
        </nav>

        <a className="button button-primary header-cta" href="/business-inquiry">
          Business Inquiry <ArrowUpRight size={16} />
        </a>
        <button className="menu-button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
          <Menu size={22} />
        </button>
      </div>
      {open && <button className="nav-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}
    </header>
  );
}
