import type { Metadata } from "next";
import { ClientSignup } from "@/components/client/ClientSignup";

export const metadata: Metadata = {
  title: "Customer Signup",
  description: "Request AI Invention customer portal access for invoices, project status, maintenance, and support.",
  robots: { index: false, follow: false },
};

export default function ClientSignupPage() {
  return <ClientSignup />;
}
