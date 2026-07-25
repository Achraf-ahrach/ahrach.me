import { BarChart3, Scissors, Activity, ShieldCheck, Crown } from "lucide-react";

/* ── 1. Pending Approvals Skeleton ─────────────────────── */
export function PendingApprovalsSkeleton() {
  return (
    <div className="admin-pending admin-fade-in">
      {/* Header Skeleton */}
      <div className="admin-section-header">
        <div>
          <div className="admin-skeleton h-7 w-64 mb-2 rounded-lg" />
          <div className="admin-skeleton h-4 w-44 rounded-md" />
        </div>
        <div className="admin-skeleton h-9 w-28 rounded-xl" />
      </div>

      {/* Grid of Pending Cards */}
      <div className="admin-pending-grid mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="admin-pending-card">
            {/* Header */}
            <div className="admin-pending-card-header">
              <div className="admin-pending-barber-info">
                <div className="admin-skeleton w-12 h-12 rounded-2xl flex-shrink-0" />
                <div className="flex flex-col gap-2">
                  <div className="admin-skeleton h-5 w-36 rounded-md" />
                  <div className="admin-skeleton h-3.5 w-28 rounded-md" />
                </div>
              </div>
              <div className="admin-skeleton h-6 w-20 rounded-full" />
            </div>

            {/* Content Details */}
            <div className="admin-pending-details space-y-2 mt-4">
              <div className="admin-skeleton h-4 w-full rounded-md" />
              <div className="admin-skeleton h-4 w-3/4 rounded-md" />
              <div className="admin-skeleton h-3.5 w-1/2 rounded-md" />
            </div>

            {/* Actions */}
            <div className="admin-pending-actions mt-6 pt-4 border-t border-white/5 flex gap-2">
              <div className="admin-skeleton h-10 flex-1 rounded-xl" />
              <div className="admin-skeleton h-10 flex-1 rounded-xl" />
              <div className="admin-skeleton h-10 w-10 rounded-xl flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 2. User Management Skeleton (Barbers / Clients) ───── */
export function UserManagementSkeleton({ role = "barber" }: { role?: "barber" | "client" }) {
  const roleLabel = role === "barber" ? "Barbers" : "Clients";
  return (
    <div className="admin-users admin-fade-in">
      {/* Header Skeleton */}
      <div className="admin-section-header">
        <div>
          <div className="admin-skeleton h-7 w-56 mb-2 rounded-lg" />
          <div className="admin-skeleton h-4 w-36 rounded-md" />
        </div>
      </div>

      {/* Controls Row: Search & Filters */}
      <div className="admin-controls-row">
        <div className="admin-skeleton h-11 w-full max-w-md rounded-xl" />
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="admin-skeleton h-9 w-20 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="admin-table-wrapper mt-4">
        <div className="p-4 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-white/5">
              {/* User Info */}
              <div className="flex items-center gap-3 w-1/4">
                <div className="admin-skeleton w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="admin-skeleton h-4 w-32 rounded-md" />
                  <div className="admin-skeleton h-3 w-20 rounded-md" />
                </div>
              </div>
              {/* Contact */}
              <div className="flex flex-col gap-1.5 w-1/5">
                <div className="admin-skeleton h-3.5 w-28 rounded-md" />
                <div className="admin-skeleton h-3 w-24 rounded-md" />
              </div>
              {/* Shop/Address or Extra */}
              <div className="admin-skeleton h-3.5 w-32 rounded-md w-1/5" />
              {/* Status */}
              <div className="admin-skeleton h-6 w-20 rounded-full" />
              {/* Joined Date */}
              <div className="admin-skeleton h-3.5 w-20 rounded-md" />
              {/* Actions */}
              <div className="flex gap-2">
                <div className="admin-skeleton h-8 w-20 rounded-lg" />
                <div className="admin-skeleton h-8 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 3. Overview Dashboard Skeleton ───────────────────── */
export function OverviewDashboardSkeleton() {
  return (
    <div className="admin-overview admin-fade-in">
      {/* KPI Grid */}
      <div className="admin-kpi-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="admin-kpi-card admin-kpi-blue">
            <div className="admin-skeleton w-10 h-10 rounded-xl mb-3" />
            <div className="admin-skeleton h-7 w-20 mb-1.5 rounded-md" />
            <div className="admin-skeleton h-3.5 w-28 rounded-md" />
          </div>
        ))}
      </div>

      {/* 2-Column Grid */}
      <div className="admin-overview-grid">
        {/* Left Column */}
        <div className="admin-overview-col">
          {/* Chart Widget */}
          <div className="admin-widget">
            <div className="admin-widget-header">
              <BarChart3 size={18} className="admin-widget-icon" />
              <div className="admin-skeleton h-5 w-32 rounded-md" />
              <div className="ml-auto flex gap-2">
                <div className="admin-skeleton h-7 w-14 rounded-lg" />
                <div className="admin-skeleton h-7 w-14 rounded-lg" />
                <div className="admin-skeleton h-7 w-14 rounded-lg" />
              </div>
            </div>
            <div className="admin-skeleton h-[240px] w-full rounded-xl mt-4" />
          </div>

          {/* Top Barbers Widget */}
          <div className="admin-widget">
            <div className="admin-widget-header">
              <Crown size={18} className="admin-widget-icon" />
              <div className="admin-skeleton h-5 w-44 rounded-md" />
            </div>
            <div className="admin-top-barbers-list space-y-3 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="admin-top-barber-item">
                  <div className="admin-skeleton w-6.5 h-6.5 rounded-lg flex-shrink-0" />
                  <div className="admin-skeleton w-9 h-9 rounded-xl flex-shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="admin-skeleton h-3.5 w-28 rounded-md" />
                    <div className="admin-skeleton h-3 w-16 rounded-md" />
                  </div>
                  <div className="admin-skeleton h-4 w-8 rounded-md flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="admin-overview-col">
          {/* Live Activity Feed */}
          <div className="admin-widget">
            <div className="admin-widget-header">
              <Activity size={18} className="admin-widget-icon" />
              <div className="admin-skeleton h-5 w-36 rounded-md" />
            </div>
            <div className="admin-activity-list space-y-3 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="admin-activity-item">
                  <div className="admin-skeleton w-7.5 h-7.5 rounded-lg flex-shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="admin-skeleton h-3.5 w-32 rounded-md" />
                    <div className="admin-skeleton h-3 w-44 rounded-md" />
                  </div>
                  <div className="admin-skeleton h-3 w-12 rounded-md flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Pending Approvals */}
          <div className="admin-widget">
            <div className="admin-widget-header">
              <ShieldCheck size={18} className="admin-widget-icon" />
              <div className="admin-skeleton h-5 w-36 rounded-md" />
            </div>
            <div className="admin-pending-list space-y-3 mt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="admin-pending-mini">
                  <div className="admin-skeleton w-8.5 h-8.5 rounded-xl flex-shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="admin-skeleton h-3.5 w-24 rounded-md" />
                    <div className="admin-skeleton h-3 w-20 rounded-md" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="admin-skeleton w-7.5 h-7.5 rounded-lg" />
                    <div className="admin-skeleton w-7.5 h-7.5 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
