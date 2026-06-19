"use client";

import Image from "next/image";
import { FormEvent, useState, useTransition } from "react";

export function AdminLogin({ nextPath }: { nextPath: string }) {
  const [message, setMessage] = useState("Enter admin username and password to continue.");
  const [isPending, startTransition] = useTransition();
  const safeNextPath = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/admin";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: String(formData.get("username") ?? ""),
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
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <Image alt="AI Invention" height={62} priority src="/images/ai-invention-logo.png" unoptimized width={260} />
        <div>
          <span className="admin-eyebrow">Secure admin</span>
          <h1>Admin Login</h1>
          <p>{message}</p>
        </div>
        <input autoComplete="username" defaultValue="admin" name="username" placeholder="Admin username" required type="text" />
        <input autoComplete="current-password" name="password" placeholder="Admin password" required type="password" />
        <button className="admin-primary-action" disabled={isPending} type="submit">
          {isPending ? "Checking..." : "Login"}
        </button>
        <small>Local default: admin / admin123. Change ADMIN_USERNAME and ADMIN_PASSWORD before production.</small>
      </form>
    </main>
  );
}
