import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClientDashboard } from "@/components/client/ClientDashboard";
import { clientSessionCookie, readClientSessionToken } from "@/lib/client-auth";
import { getCustomerPortalState } from "@/lib/admin-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Dashboard",
  robots: { index: false, follow: false },
};

export default async function ClientDashboardPage() {
  const cookieStore = await cookies();
  const customerId = readClientSessionToken(cookieStore.get(clientSessionCookie)?.value);

  if (!customerId) {
    redirect("/client/login");
  }

  const portal = await getCustomerPortalState(customerId);

  if (!portal) {
    redirect("/client/login");
  }

  return <ClientDashboard initialState={portal} />;
}
