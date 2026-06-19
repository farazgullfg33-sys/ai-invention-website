"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

const businessTypes = [
  "Agency",
  "Consultancy",
  "Real Estate",
  "Restaurant/Retail",
  "E-commerce",
  "Healthcare",
  "Other",
];

const services = ["AI Agent", "Website + Agent Bundle", "Website Only"];

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setMessage("");

    const response = await fetch("/api/capture-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        businessType: formData.get("businessType"),
        service: formData.get("service"),
        telegram: formData.get("telegram"),
        message: formData.get("message"),
      }),
    }).catch(() => null);

    if (response?.ok) {
      setStatus("success");
      setMessage("Thanks. Your request was saved and AI Invention will review it.");
      form.reset();
      return;
    }

    setStatus("error");
    setMessage("Please check the required fields and try again.");
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input name="name" placeholder="Your name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" placeholder="you@example.com" required type="email" />
        </label>
      </div>
      <div className="form-grid">
        <label>
          <span>Business Type</span>
          <select defaultValue="" name="businessType" required>
            <option disabled value="">
              Select one
            </option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Service Interested In</span>
          <select defaultValue="" name="service" required>
            <option disabled value="">
              Select service
            </option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>Telegram Username</span>
        <input name="telegram" placeholder="@username (optional)" />
      </label>
      <label>
        <span>Tell us about your business and what you need</span>
        <textarea name="message" placeholder="What should your AI agent know or help with?" required rows={5} />
      </label>
      <button className="button-primary form-submit" disabled={status === "sending"} type="submit">
        {status === "sending" ? <Loader2 aria-hidden="true" className="spin" size={18} /> : <ArrowRight aria-hidden="true" size={18} />}
        Get Started
      </button>
      {message ? (
        <p className={`form-status ${status}`}>
          {status === "success" ? <CheckCircle2 aria-hidden="true" size={18} /> : null}
          {message}
        </p>
      ) : null}
    </form>
  );
}
