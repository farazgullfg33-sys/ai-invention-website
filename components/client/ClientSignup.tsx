"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";

export function ClientSignup() {
  const [message, setMessage] = useState("Request customer portal access for invoices, projects, and support.");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const response = await fetch("/api/client/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          company: String(formData.get("company") ?? ""),
          service: String(formData.get("service") ?? ""),
          message: String(formData.get("message") ?? ""),
        }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!response.ok || !result?.ok) {
        setStatus("error");
        setMessage(result?.message ?? "Signup request failed. Please check the details and try again.");
        return;
      }

      form.reset();
      setStatus("success");
      setMessage(result.message ?? "Signup request sent. Admin will review it and enable portal access.");
    });
  }

  return (
    <main className="client-signup-page">
      <form className="client-signup-card" onSubmit={submit}>
        <Image alt="AI Invention" height={62} priority src="/images/ai-invention-logo.png" unoptimized width={260} />
        <div>
          <span className="client-eyebrow">Customer signup</span>
          <h1>Request Portal Access</h1>
          <p>{message}</p>
        </div>
        <div className={`client-signup-status ${status}`} aria-live="polite">
          {status === "success"
            ? "Request saved in admin leads."
            : status === "error"
              ? "Please fix the form and try again."
              : "Admin approval is required before login credentials are created."}
        </div>
        <div className="client-signup-grid">
          <label>
            Full name
            <input autoComplete="name" name="name" required type="text" />
          </label>
          <label>
            Email
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Phone or WhatsApp
            <input autoComplete="tel" name="phone" type="tel" />
          </label>
          <label>
            Company name
            <input autoComplete="organization" name="company" required type="text" />
          </label>
        </div>
        <label>
          Service or package
          <select defaultValue="Website + AI Agent Bundle" name="service">
            <option>Website + AI Agent Bundle</option>
            <option>AI Agent Deployment</option>
            <option>Website Only</option>
            <option>Custom AI Business System</option>
          </select>
        </label>
        <label>
          What do you need in the portal?
          <textarea
            name="message"
            placeholder="Example: I need access to invoices, project status, maintenance reminders, and support history."
            rows={5}
          />
        </label>
        <button className="client-primary-action" disabled={isPending} type="submit">
          {isPending ? "Submitting..." : "Submit signup request"}
        </button>
        <Link className="client-signup-link" href="/client/login">
          Already approved? Back to customer login
        </Link>
      </form>
    </main>
  );
}
