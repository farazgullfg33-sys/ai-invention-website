import type { Metadata } from "next";
import { ClientLogin } from "@/components/client/ClientLogin";

export const metadata: Metadata = {
  title: "Client Login",
  robots: { index: false, follow: false },
};

export default async function ClientLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; next?: string }>;
}) {
  const params = await searchParams;
  return <ClientLogin defaultEmail={params.email ?? ""} nextPath={params.next ?? "/client/dashboard"} />;
}
