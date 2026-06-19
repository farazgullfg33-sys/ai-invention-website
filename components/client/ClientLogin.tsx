"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";

export function ClientLogin({
  defaultEmail,
  nextPath,
}: {
  defaultEmail: string;
  nextPath: string;
}) {
  const [message, setMessage] = useState("Login to view invoices, project status, and maintenance updates.");
  const [isPending, startTransition] = useTransition();
  const safeNextPath = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/client/dashboard";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const response = await fetch("/api/client/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!response.ok || !result?.ok) {
        setMessage(result?.message ?? "Login failed.");
        return;
      }

      window.location.href = safeNextPath;
    });
  }

  return (
    <main className="client-login-page">
      <form className="client-login-card" onSubmit={submit}>
        <Image alt="AI Invention" height={62} priority src="/images/ai-invention-logo.png" unoptimized width={260} />
        <div>
          <span className="client-eyebrow">Client portal</span>
          <h1>Customer Login</h1>
          <p>{message}</p>
        </div>
        <input autoComplete="email" defaultValue={defaultEmail} name="email" placeholder="Customer email" required type="email" />
        <input autoComplete="current-password" name="password" placeholder="Portal password" required type="password" />
        <button className="client-primary-action" disabled={isPending} type="submit">
          {isPending ? "Checking..." : "Open dashboard"}
        </button>
        <Link className="client-signup-link" href="/client/signup">
          Need portal access? Request customer signup
        </Link>
        <small>Use the temporary password from your AI Invention invite. Admin can reset access any time.</small>
      </form>
    </main>
  );
}
