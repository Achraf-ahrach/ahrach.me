"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/supabase-client";
import {
  LayoutDashboard,
  Clock,
  Scissors,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
  Sun,
  Moon,
} from "lucide-react";

export type AdminTab = "overview" | "pending" | "barbers" | "clients";

interface AdminShellProps {
  children: React.ReactNode;
  adminName: string;
  adminEmail: string;
  adminAvatar?: string;
}

const NAV_ITEMS: { href: string; label: string; icon: React.ReactNode }[] = [
  {
    href: "/YoBarber/admin",
    label: "Overview",
    icon: <LayoutDashboard size={18} />,
  },
  {
    href: "/YoBarber/admin/pending",
    label: "Pending Approvals",
    icon: <Clock size={18} />,
  },
  {
    href: "/YoBarber/admin/barbers",
    label: "All Barbers",
    icon: <Scissors size={18} />,
  },
  {
    href: "/YoBarber/admin/clients",
    label: "Clients",
    icon: <Users size={18} />,
  },
];

export default function AdminShell({
  children,
  adminName,
  adminEmail,
  adminAvatar,
}: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("yobarber_admin_theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("yobarber_admin_theme", nextTheme);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/YoBarber/admin/login");
  };

  const isItemActive = (href: string) => {
    if (href === "/YoBarber/admin") {
      return pathname === "/YoBarber/admin" || pathname === "/YoBarber/admin/";
    }
    return pathname.startsWith(href);
  };

  const activeItem = NAV_ITEMS.find((item) => isItemActive(item.href)) || NAV_ITEMS[0];

  return (
    <div className={`admin-dashboard ${theme === "light" ? "light-mode" : ""}`}>
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="admin-sidebar-header">
          <Link href="/YoBarber/admin" className="admin-logo-group" onClick={() => setSidebarOpen(false)}>
            <Image
              src="/yobarber/logo.png"
              alt="YoBarber"
              width={36}
              height={36}
              className="admin-logo-icon"
              priority
            />
            <div>
              <span className="admin-logo-text">YoBarber</span>
              <span className="admin-logo-badge">Admin</span>
            </div>
          </Link>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${active ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile (bottom) */}
        <div className="admin-sidebar-footer">
          <div className="admin-profile-card">
            <div className="admin-avatar">
              {adminAvatar ? (
                <img
                  src={adminAvatar}
                  alt={adminName}
                  referrerPolicy="no-referrer"
                  className="admin-avatar-img"
                />
              ) : (
                <Shield size={16} />
              )}
            </div>
            <div className="admin-profile-info">
              <span className="admin-profile-name">{adminName}</span>
              <span className="admin-profile-email">{adminEmail}</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <button
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <h1 className="admin-page-title">
            {activeItem.label}
          </h1>
          <div className="admin-header-right">
            <button
              className="admin-theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <span className="admin-header-badge">
              <Shield size={14} />
              Admin Panel
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
