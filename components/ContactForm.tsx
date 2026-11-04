"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { inquiryCategories, inquiryEmail, productRequirements } from "./inquiryConfig";

export function ContactForm({ initialCategory = "", compact = false }: { initialCategory?: string; compact?: boolean }) {
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(`mailto:${inquiryEmail}`);
  const sending = useRef(false);
  const fields = productRequirements[category] ?? [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    const specifications = Object.fromEntries(fields.map((field) => [field.name, value(`spec_${field.name}`)]));
    const payload = {
      name: value("name"), company: value("company"), email: value("email"), phone: value("phone"),
      country: value("country"), website: value("website"), category, quantity: value("quantity"),
      customization: value("customization"), destination: value("destination"), message: value("message"),
      website_check: value("website_check"), specifications,
    };
    const lines = Object.entries(payload).filter(([key]) => key !== "website_check" && key !== "specifications")
      .map(([key, val]) => `${key}: ${val || "Not provided"}`);
    fields.forEach((field) => lines.push(`${field.label}: ${specifications[field.name] || "Not provided"}`));
    setFallback(`mailto:${inquiryEmail}?subject=${encodeURIComponent(`[WISGSHL] ${category} inquiry - ${payload.company}`)}&body=${encodeURIComponent(lines.join("\n"))}`);
    sending.current = true;
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/inquiry.php", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error(result?.error ?? "The inquiry could not be submitted. Please try again or email us directly.");
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "The request timed out. Please email us directly if you do not receive a reply.");
      setStatus("error");
    } finally { sending.current = false; }
  }

  if (status === "success") return (
    <div className={`inquiry-form ${compact ? "inquiry-compact" : ""}`} role="status">
      <div className="form-heading"><span>Thank you</span><h2>Inquiry submitted</h2></div>
      <div className="form-success"><CheckCircle2 size={20} />Your {category} inquiry has been submitted to our team.</div>
      <p className="inquiry-note">We will reply to the email address you provided.</p>
      <button type="button" className="text-link" onClick={() => setStatus("idle")}>Send another inquiry <ArrowRight size={16} /></button>
    </div>
  );

  return (
    <form className={`inquiry-form ${compact ? "inquiry-compact" : ""}`} onSubmit={handleSubmit}>
      <div className="form-heading"><span>Product inquiry</span><h2>{initialCategory ? `${category} inquiry` : "Share your requirements"}</h2><p>Tell us what you need. Fields marked * are required.</p></div>
      <fieldset className="inquiry-fields" disabled={status === "sending"}>
        <div className="form-grid">
          <label><span>Full name <b>*</b></span><input name="name" autoComplete="name" maxLength={120} placeholder="Your full name" required /></label>
          <label><span>Company name <b>*</b></span><input name="company" autoComplete="organization" maxLength={160} placeholder="Your company" required /></label>
          <label><span>Business email <b>*</b></span><input name="email" type="email" autoComplete="email" maxLength={200} placeholder="name@company.com" required /></label>
          <label><span>Phone / WhatsApp <small>(optional)</small></span><input name="phone" type="tel" autoComplete="tel" maxLength={60} placeholder="Include country code" /></label>
          <label><span>Country / region <small>(optional)</small></span><input name="country" autoComplete="country-name" maxLength={100} placeholder="Your country" /></label>
          <label><span>Company website <small>(optional)</small></span><input name="website" type="url" autoComplete="url" maxLength={300} placeholder="https://" /></label>
          <label><span>Product category <b>*</b></span><select name="category" value={category} onChange={(event) => setCategory(event.target.value)} required><option value="" disabled>Select a category</option>{inquiryCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Estimated quantity <small>(optional)</small></span><input name="quantity" maxLength={100} placeholder="Units or project quantity" /></label>
          <label><span>Customization <small>(optional)</small></span><select name="customization" defaultValue=""><option value="">Select if needed</option><option>OEM customization</option><option>ODM development</option><option>Standard product</option><option>Please advise</option></select></label>
          <label><span>Delivery destination <small>(optional)</small></span><input name="destination" maxLength={160} placeholder="City, port or country" /></label>
          {fields.length > 0 && <div className="form-full product-specs"><p>{category} requirements <small>Optional - share what you know</small></p><div className="form-grid">{fields.map((field) => <label key={`${category}-${field.name}`}><span>{field.label}</span><input name={`spec_${field.name}`} maxLength={300} placeholder={field.placeholder} /></label>)}</div></div>}
          <label className="form-full"><span>Product details and requirements <b>*</b></span><textarea name="message" rows={4} maxLength={5000} placeholder="Describe the product, application, specifications, packaging or project timeline." required /></label>
        </div>
        <div className="inquiry-trap" aria-hidden="true"><label>Leave this field empty<input name="website_check" tabIndex={-1} autoComplete="off" /></label></div>
        <div className="form-action"><button className="button button-primary" type="submit">{status === "sending" ? "Sending..." : "Send Inquiry"}<ArrowRight size={17} /></button><p>Your requirements will be sent to {inquiryEmail}.</p></div>
      </fieldset>
      {status === "error" && <div className="form-error" role="alert"><p>{error}</p><a href={fallback}>Email these requirements instead <ArrowRight size={14} /></a></div>}
    </form>
  );
}
