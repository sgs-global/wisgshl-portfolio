import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wisgshl.com"),
  title: {
    default: "WISGSHL | Global Product Manufacturer & Supplier",
    template: "%s | WISGSHL",
  },
  description:
    "Worldwide Industrial SGS Holdings Limited manufactures and supplies solar products, LED lighting, watches, appliances, electronics and customized OEM/ODM products.",
  icons: {
    icon: [{ url: "/images/sgs_logo.png", type: "image/png" }],
    shortcut: "/images/sgs_logo.png",
    apple: "/images/sgs_logo.png",
  },
  keywords: [
    "international trading",
    "product sourcing",
    "OEM",
    "ODM",
    "solar products",
    "LED lighting",
    "wholesale supply",
  ],
  openGraph: {
    title: "WISGSHL — Connecting Global Markets",
    description:
      "International manufacturing, product supply and OEM/ODM customization.",
    type: "website",
    images: ["/images/wisgshl-hero.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WFZP5L5F"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WFZP5L5F');`}
        </Script>
        {children}
      </body>
    </html>
  );
}
