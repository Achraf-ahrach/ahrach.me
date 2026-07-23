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
} from "lucide-react";

interface UserManagementPanelProps {
  role: "barber" | "client";
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
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
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
                      <span
                        className={`admin-status-badge ${getStatusBadge(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
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
                            title="Reactivate"
                          >
                            {actionLoading === user.id ? (
                              <Loader2 size={13} className="admin-spinner" />
                            ) : (
                              <ShieldCheck size={13} />
                            )}
                          </button>
                        )}
                        {user.status !== "suspended" && (
                          <button
                            className="admin-action-sm amber"
                            onClick={() =>
                              handleStatusChange(user, "suspended")
                            }
                            disabled={actionLoading === user.id}
                            title="Suspend"
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
