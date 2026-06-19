import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  return <AdminLogin nextPath={params.next ?? "/admin"} />;
}
