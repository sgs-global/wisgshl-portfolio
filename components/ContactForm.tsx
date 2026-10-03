"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const categories = [
  "Solar energy products",
  "LED lighting",
  "Watches & smart watches",
  "Small home appliances",
  "Consumer electronics",
  "Consumer goods",
  "OEM / ODM customization",
  "Other product",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) || "Not provided");
    const subject = encodeURIComponent(`Product inquiry from ${value("company")}`);
    const body = encodeURIComponent([
      "WISGSHL PRODUCT INQUIRY",
      "",
      `Name: ${value("name")}`,
      `Company: ${value("company")}`,
      `Email: ${value("email")}`,
      `Phone / WhatsApp: ${value("phone")}`,
      `Country: ${value("country")}`,
      `Company website: ${value("website")}`,
      `Product category: ${value("category")}`,
      `Estimated quantity: ${value("quantity")}`,
      `Customization needed: ${value("customization")}`,
      `Delivery destination: ${value("destination")}`,
      `Preferred contact: ${value("preferredContact")}`,
      "",
      "Requirements:",
      value("message"),
    ].join("\n"));

    setSubmitted(true);
    window.location.href = `mailto:manager@globalsgs.com?subject=${subject}&body=${body}`;
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span>Product inquiry</span>
        <h2>Share your requirements</h2>
        <p>Fields marked with an asterisk are required.</p>
      </div>

      <div className="form-grid">
        <label>
          Full name <b>*</b>
          <input name="name" type="text" autoComplete="name" placeholder="Your full name" required />
        </label>
        <label>
          Company name <b>*</b>
          <input name="company" type="text" autoComplete="organization" placeholder="Your company" required />
        </label>
        <label>
          Business email <b>*</b>
          <input name="email" type="email" autoComplete="email" placeholder="name@company.com" required />
        </label>
        <label>
          Phone / WhatsApp <b>*</b>
          <input name="phone" type="tel" autoComplete="tel" placeholder="Include country code" required />
        </label>
        <label>
          Country / region <b>*</b>
          <input name="country" type="text" autoComplete="country-name" placeholder="Your country" required />
        </label>
        <label>
          Company website
          <input name="website" type="url" autoComplete="url" placeholder="https://" />
        </label>
        <label>
          Product category <b>*</b>
          <select name="category" defaultValue="" required>
            <option value="" disabled>Select a category</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          Estimated order quantity <b>*</b>
          <input name="quantity" type="text" placeholder="Example: 1,000 units" required />
        </label>
        <label>
          Customization required? <b>*</b>
          <select name="customization" defaultValue="" required>
            <option value="" disabled>Select an option</option>
            <option>Yes — OEM customization</option>
            <option>Yes — ODM development</option>
            <option>No — standard product</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <label>
          Delivery destination <b>*</b>
          <input name="destination" type="text" placeholder="City, port or country" required />
        </label>
        <label className="form-full">
          Preferred contact method
          <select name="preferredContact" defaultValue="Email">
            <option>Email</option>
            <option>Phone</option>
            <option>WhatsApp</option>
          </select>
        </label>
        <label className="form-full">
          Product details and requirements <b>*</b>
          <textarea name="message" rows={7} placeholder="Tell us about specifications, target price, packaging, certification requirements, timeline, and any other details." required />
        </label>
      </div>

      <label className="consent-row">
        <input type="checkbox" required />
        <span>I agree that WISGSHL may use this information to respond to my inquiry.</span>
      </label>

      <div className="form-action">
        <button className="button button-primary button-large" type="submit">
          Prepare Inquiry Email <ArrowRight size={18} />
        </button>
        <p>Your email application will open with these details. You can attach drawings or specification files before sending.</p>
      </div>

      {submitted && <div className="form-success" role="status"><CheckCircle2 size={18} /> Your inquiry has been prepared in your email application.</div>}
    </form>
  );
}
