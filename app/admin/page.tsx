import type { Metadata } from "next";
import { AdminConsole } from "@/components/admin/AdminConsole";
import { getAdminDashboardState, getAdminStats } from "@/lib/admin-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "AI Invention admin command center for leads, customers, packages, invoices, and maintenance.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const state = await getAdminDashboardState();

  return <AdminConsole initialState={state} initialStats={getAdminStats(state)} />;
}
