"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchUsers,
  updateUserStatus,
  type ProfileRow,
} from "./admin-actions";
import {
  Search,
  Loader2,
  ShieldOff,
  ShieldCheck,
  Ban,
  AlertTriangle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Users,
  Inbox,
  MapPin,
  ExternalLink,
  Clock,
} from "lucide-react";

interface UserManagementPanelProps {
  role: "barber" | "client";
}

interface SuspendModalState {
  user: ProfileRow;
  preset: "3" | "7" | "30" | "custom";
  customDays: string;
}

export default function UserManagementPanel({ role }: UserManagementPanelProps) {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [suspendModal, setSuspendModal] = useState<SuspendModalState | null>(null);

  const getEffectiveDays = (modal: SuspendModalState): number => {
    if (modal.preset === "custom") {
      const parsed = parseInt(modal.customDays, 10);
      return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
    }
    return parseInt(modal.preset, 10);
  };

  const getCalculatedDate = (modal: SuspendModalState): Date => {
    const days = getEffectiveDays(modal);
    const now = new Date();
    now.setDate(now.getDate() + days);
    return now;
  };

  const handleConfirmSuspend = async () => {
    if (!suspendModal) return;

    const { user } = suspendModal;
    const days = getEffectiveDays(suspendModal);
    const untilDate = getCalculatedDate(suspendModal);
    const suspendedUntil = untilDate.toISOString();

    setActionLoading(user.id);
    const result = await updateUserStatus(user.id, "suspended", suspendedUntil);
    setActionLoading(null);
    setSuspendModal(null);

    if (result.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: "suspended", suspended_until: suspendedUntil }
            : u
        )
      );
      const formattedDate = untilDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      showToast(
        `${user.full_name} suspended for ${days} day${days > 1 ? "s" : ""} (until ${formattedDate})`,
        "success"
      );
    } else {
      showToast(result.error || "Failed to suspend user", "error");
    }
  };

  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchUsers(role, search, page, pageSize, statusFilter);
      setUsers(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, [role, search, page, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset page when search or status filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatusChange = async (
    user: ProfileRow,
    newStatus: "active" | "suspended" | "banned"
  ) => {
    setActionLoading(user.id);
    const result = await updateUserStatus(user.id, newStatus);
    setActionLoading(null);

    if (result.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus, suspended_until: null } : u))
      );
      const actionLabel =
        newStatus === "active"
          ? "reactivated"
          : newStatus === "suspended"
          ? "suspended"
          : "banned";
      showToast(`${user.full_name} has been ${actionLabel}`, "success");
    } else {
      showToast(result.error || "Action failed", "error");
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "admin-badge-active",
      pending: "admin-badge-pending",
      suspended: "admin-badge-suspended",
      banned: "admin-badge-banned",
      rejected: "admin-badge-rejected",
    };
    return map[status] || "admin-badge-default";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const roleLabel = role === "barber" ? "Barbers" : "Clients";

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="admin-section-header">
        <div>
          <h2>
            <Users size={20} className="inline mr-2" />
            {roleLabel} Management
          </h2>
          <p>
            {total} {roleLabel.toLowerCase()} total
          </p>
        </div>
      </div>

      {/* Controls Row: Search Bar & Status Filter Pills */}
      <div className="admin-controls-row">
        <div className="admin-search-bar">
          <Search size={18} className="admin-search-icon" />
          <input
            type="text"
            placeholder={`Search ${roleLabel.toLowerCase()} by name, email, or phone…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div className="admin-filter-group">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "suspended", label: "Suspended" },
            { key: "banned", label: "Banned" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`admin-filter-pill ${
                statusFilter === tab.key ? "active" : ""
              }`}
              onClick={() => setStatusFilter(tab.key)}
            >
              <span className={`admin-pill-dot ${tab.key}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="admin-loading-state">
          <Loader2 size={32} className="admin-spinner" />
          <p>Loading {roleLabel.toLowerCase()}…</p>
        </div>
      ) : users.length === 0 ? (
        <div className="admin-empty-state">
          <Inbox size={48} />
          <h3>No {roleLabel} Found</h3>
          <p>
            {search
              ? `No results matching "${search}".`
              : `No ${roleLabel.toLowerCase()} registered yet.`}
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  {role === "barber" && <th>SHOP</th>}
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const mapUrl =
                    user.location_lat && user.location_lng
                      ? `https://www.google.com/maps?q=${user.location_lat},${user.location_lng}`
                      : user.address
                      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          user.address
                        )}`
                      : null;

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar">
                            {user.full_name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <span className="admin-user-name">
                            {user.full_name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-contact-cell">
                          <span>{user.email}</span>
                          <span className="admin-phone">{user.phone}</span>
                        </div>
                      </td>
                      {role === "barber" && (
                        <td>
                          {mapUrl ? (
                            <a
                              href={mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-location-btn"
                              title="Open Google Maps Location"
                            >
                              <MapPin size={13} />
                              <span>
                                {user.address
                                  ? user.address.length > 22
                                    ? user.address.slice(0, 22) + "…"
                                    : user.address
                                  : "View Location"}
                              </span>
                              <ExternalLink size={11} className="admin-location-ext" />
                            </a>
                          ) : (
                            <span className="admin-no-location">—</span>
                          )}
                        </td>
                      )}
                    <td>
                      <div className="admin-status-cell-wrapper">
                        <span
                          className={`admin-status-badge ${getStatusBadge(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                        {user.status === "suspended" && user.suspended_until && (
                          <span
                            className="admin-suspended-until-tag"
                            title={`Until ${new Date(user.suspended_until).toLocaleString()}`}
                          >
                            Until {new Date(user.suspended_until).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="admin-date">
                        {formatDate(user.created_at)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-group">
                        {user.status !== "active" && (
                          <button
                            className="admin-action-sm green"
                            onClick={() =>
                              handleStatusChange(user, "active")
                            }
                            disabled={actionLoading === user.id}
                            title="Reactivate User"
                          >
                            {actionLoading === user.id ? (
                              <Loader2 size={13} className="admin-spinner" />
                            ) : (
                              <ShieldCheck size={13} />
                            )}
                          </button>
                        )}
                        {role !== "barber" && user.status !== "suspended" && (
                          <button
                            className="admin-action-sm amber"
                            onClick={() =>
                              setSuspendModal({
                                user,
                                preset: "3",
                                customDays: "3",
                              })
                            }
                            disabled={actionLoading === user.id}
                            title="Suspend User"
                          >
                            <ShieldOff size={13} />
                          </button>
                        )}
                        {user.status !== "banned" && (
                          <button
                            className="admin-action-sm red"
                            onClick={() =>
                              handleStatusChange(user, "banned")
                            }
                            disabled={actionLoading === user.id}
                            title="Ban"
                          >
                            <Ban size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <button
                className="admin-page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
                Prev
              </button>
              <span className="admin-page-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="admin-page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Suspend Duration Modal */}
      {suspendModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-suspend-modal">
            <div className="admin-modal-icon amber">
              <Clock size={28} />
            </div>
            <h3>Suspend {suspendModal.user.full_name}?</h3>
            <p>
              Select suspension duration. The user will be unable to access services during this period.
            </p>

            {/* Presets */}
            <div className="admin-suspend-options">
              {[
                { key: "3", label: "3 Days" },
                { key: "7", label: "7 Days" },
                { key: "30", label: "30 Days" },
                { key: "custom", label: "Custom" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`admin-suspend-chip ${
                    suspendModal.preset === opt.key ? "active" : ""
                  }`}
                  onClick={() =>
                    setSuspendModal({
                      ...suspendModal,
                      preset: opt.key as any,
                    })
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            {suspendModal.preset === "custom" && (
              <div className="admin-custom-days-group">
                <label className="admin-custom-label">Custom Duration (Days):</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={suspendModal.customDays}
                  onChange={(e) =>
                    setSuspendModal({
                      ...suspendModal,
                      customDays: e.target.value,
                    })
                  }
                  className="admin-custom-days-input"
                  placeholder="e.g. 14"
                />
              </div>
            )}

            {/* Date Preview */}
            <div className="admin-suspend-preview">
              <span className="admin-preview-label">Suspended Until:</span>
              <span className="admin-preview-date">
                {getCalculatedDate(suspendModal).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-btn suspend-confirm"
                onClick={handleConfirmSuspend}
                disabled={actionLoading === suspendModal.user.id}
              >
                {actionLoading === suspendModal.user.id ? (
                  <Loader2 size={16} className="admin-spinner" />
                ) : (
                  <ShieldOff size={16} />
                )}
                Confirm Suspension
              </button>
              <button
                type="button"
                className="admin-modal-btn cancel"
                onClick={() => setSuspendModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === "success" ? (
            <UserCheck size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
