import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <><Header /><main className="legal-page"><div className="container legal-inner"><span>Legal</span><h1>Privacy Policy</h1><p className="legal-lead">This page is a publishing placeholder and should be reviewed with the company&apos;s legal and privacy requirements before launch.</p><h2>Information we receive</h2><p>The contact page collects the information you choose to include in your inquiry and opens your email application to send it directly to WISGSHL. The website does not currently store form submissions in a database.</p><h2>Website services</h2><p>External services linked from this website may apply their own privacy practices. The production site owner should document any analytics, embedded maps, media, or consent tools added in the future.</p><h2>Contact</h2><p>Privacy questions may be directed to <a href="mailto:manager@globalsgs.com">manager@globalsgs.com</a>.</p></div></main><Footer /></>;
}
