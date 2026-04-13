import type { Metadata } from "next";
import { config } from "@/lib/config";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: config.appName,
  description: "Admin panel for trainings, trainers, customers, settings, and authentication.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-shell">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}
