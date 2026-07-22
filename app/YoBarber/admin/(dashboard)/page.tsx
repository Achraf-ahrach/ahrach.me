"use client";

import { useState, useEffect, useRef } from "react";
import AdminShell, { type AdminTab } from "@/components/yobarber/admin/AdminShell";
import OverviewPanel from "@/components/yobarber/admin/OverviewPanel";
import PendingApprovalsPanel from "@/components/yobarber/admin/PendingApprovalsPanel";
import UserManagementPanel from "@/components/yobarber/admin/UserManagementPanel";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminAvatar, setAdminAvatar] = useState("");

  /* Read admin info from layout's data attributes */
  useEffect(() => {
    const el = wrapperRef.current?.closest("[data-admin-name]");
    if (el) {
      setAdminName(el.getAttribute("data-admin-name") || "Admin");
      setAdminEmail(el.getAttribute("data-admin-email") || "");
      setAdminAvatar(el.getAttribute("data-admin-avatar") || "");
    }
  }, []);

  const renderPanel = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewPanel />;
      case "pending":
        return <PendingApprovalsPanel />;
      case "barbers":
        return <UserManagementPanel role="barber" />;
      case "clients":
        return <UserManagementPanel role="client" />;
      default:
        return <OverviewPanel />;
    }
  };

  return (
    <div ref={wrapperRef}>
      <AdminShell
        adminName={adminName}
        adminEmail={adminEmail}
        adminAvatar={adminAvatar}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderPanel()}
      </AdminShell>
    </div>
  );
}
