"use client";

import { useState } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { officeAddress, officeMapUrl } from "./inquiryConfig";

export function OfficeMap() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="office-map-frame">
      {!loaded && <div className="office-map-placeholder"><MapPin size={30} strokeWidth={1.3} /><strong>Shenzhen · Longgang</strong><a href={officeMapUrl} target="_blank" rel="noreferrer">Open office address in Google Maps <ArrowUpRight size={14} /></a></div>}
      <iframe title="WISGSHL Shenzhen office address map" src={`https://www.google.com/maps?q=${encodeURIComponent(officeAddress)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen onLoad={() => setLoaded(true)} style={{ opacity: loaded ? 1 : 0 }} />
    </div>
  );
}
