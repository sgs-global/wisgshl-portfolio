import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
