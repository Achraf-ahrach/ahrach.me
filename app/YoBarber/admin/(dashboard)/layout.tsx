import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/supabase-server";
import { ShieldAlert } from "lucide-react";
import AdminShell from "@/components/yobarber/admin/AdminShell";
import AdminQueryProvider from "@/components/yobarber/admin/AdminQueryProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  /* ── 1. Check authentication ─── */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/YoBarber/admin/login");
  }

  /* ── 2. Check admin role ─── */
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[Admin Layout] Profile query error:", error);
  }

  const userAvatar =
    profile?.avatar_url ||
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    "";

  if (!profile || profile.role !== "admin") {
    return (
      <div className="admin-access-denied">
        <div className="admin-access-denied-card">
          <div className="admin-access-denied-icon">
            <ShieldAlert size={48} />
          </div>
          <h1>Access Denied</h1>
          <p>
            You do not have permission to access the admin dashboard.
            <br />
            This area is restricted to authorized administrators only.
          </p>
          <Link href="/YoBarber" className="admin-access-denied-link">
            ← Back to YoBarber
          </Link>
        </div>
      </div>
    );
  }

  const adminName = profile.full_name || user.user_metadata?.full_name || "Admin";
  const adminEmail = user.email || "";

  /* ── 3. Render persistent admin dashboard layout ─── */
  return (
    <AdminQueryProvider>
      <AdminShell
        adminName={adminName}
        adminEmail={adminEmail}
        adminAvatar={userAvatar}
      >
        {children}
      </AdminShell>
    </AdminQueryProvider>
  );
}
