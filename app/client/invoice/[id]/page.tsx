import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ClientInvoicePrint } from "@/components/client/ClientInvoicePrint";
import { getCustomerPortalState } from "@/lib/admin-store";
import { clientSessionCookie, readClientSessionToken } from "@/lib/client-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Invoice",
  robots: { index: false, follow: false },
};

export default async function ClientInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const customerId = readClientSessionToken(cookieStore.get(clientSessionCookie)?.value);

  if (!customerId) {
    redirect("/client/login");
  }

  const portal = await getCustomerPortalState(customerId);

  if (!portal) {
    redirect("/client/login");
  }

  const { id } = await params;
  const invoice = portal.invoices.find((item) => item.id === id);

  if (!invoice) {
    notFound();
  }

  return <ClientInvoicePrint invoice={invoice} portal={portal} />;
}
