"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchPendingBarbers,
  approveBarber,
  rejectBarber,
  type ProfileRow,
} from "./admin-actions";
import {
  Check,
  X,
  Loader2,
  AlertTriangle,
  UserCheck,
  Trash2,
  Ban,
  RefreshCw,
  Inbox,
  MapPin,
  ExternalLink,
} from "lucide-react";

type RejectMode = "reject" | "delete";

interface ConfirmDialog {
  barberId: string;
  barberName: string;
  mode: RejectMode | null;
}

export default function PendingApprovalsPanel() {
  const [barbers, setBarbers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(
    null
  );

  const loadBarbers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPendingBarbers();
      setBarbers(data);
    } catch (err) {
      console.error("Failed to load pending barbers:", err);
      showToast("Failed to load pending barbers", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBarbers();
  }, [loadBarbers]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = async (barber: ProfileRow) => {
    setActionLoading(barber.id);
    const result = await approveBarber(barber.id);
    setActionLoading(null);

    if (result.success) {
      setBarbers((prev) => prev.filter((b) => b.id !== barber.id));
      showToast(`${barber.full_name} has been approved ✅`, "success");
    } else {
      showToast(result.error || "Failed to approve barber", "error");
    }
  };

  const handleReject = async () => {
    if (!confirmDialog || !confirmDialog.mode) return;

    setActionLoading(confirmDialog.barberId);
    const result = await rejectBarber(confirmDialog.barberId, confirmDialog.mode);
    setActionLoading(null);
    setConfirmDialog(null);

    if (result.success) {
      setBarbers((prev) =>
        prev.filter((b) => b.id !== confirmDialog.barberId)
      );
      const action =
        confirmDialog.mode === "delete" ? "deleted" : "rejected";
      showToast(
        `${confirmDialog.barberName} has been ${action} ❌`,
        "success"
      );
    } else {
      showToast(result.error || "Failed to reject barber", "error");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="admin-loading-state">
        <Loader2 size={32} className="admin-spinner" />
        <p>Loading pending barbers…</p>
      </div>
    );
  }

  return (
    <div className="admin-pending">
      {/* Header */}
      <div className="admin-section-header">
        <div>
          <h2>Pending Barber Applications</h2>
          <p>
            {barbers.length} barber{barbers.length !== 1 ? "s" : ""} awaiting
            review
          </p>
        </div>
        <button className="admin-refresh-btn" onClick={loadBarbers}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Empty State */}
      {barbers.length === 0 ? (
        <div className="admin-empty-state">
          <Inbox size={48} />
          <h3>All Caught Up!</h3>
          <p>No pending barber applications at this time.</p>
        </div>
      ) : (
        /* Table */
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Barber</th>
                <th>Contact</th>
                <th>SHOP</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map((barber) => {
                const mapUrl =
                  barber.location_lat && barber.location_lng
                    ? `https://www.google.com/maps?q=${barber.location_lat},${barber.location_lng}`
                    : barber.address
                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        barber.address
                      )}`
                    : null;

                return (
                  <tr key={barber.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-avatar">
                          {barber.full_name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="admin-user-name">
                          {barber.full_name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-contact-cell">
                        <span>{barber.email}</span>
                        <span className="admin-phone">{barber.phone}</span>
                      </div>
                    </td>
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
                            {barber.address
                              ? barber.address.length > 22
                                ? barber.address.slice(0, 22) + "…"
                                : barber.address
                              : "View Location"}
                          </span>
                          <ExternalLink size={11} className="admin-location-ext" />
                        </a>
                      ) : (
                        <span className="admin-no-location">—</span>
                      )}
                    </td>
                  <td>
                    <span className="admin-date">
                      {formatDate(barber.created_at)}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-group">
                      <button
                        className="admin-action-approve"
                        onClick={() => handleApprove(barber)}
                        disabled={actionLoading === barber.id}
                        title="Approve"
                      >
                        {actionLoading === barber.id ? (
                          <Loader2 size={14} className="admin-spinner" />
                        ) : (
                          <Check size={14} />
                        )}
                        <span>Approve</span>
                      </button>
                      <button
                        className="admin-action-reject"
                        onClick={() =>
                          setConfirmDialog({
                            barberId: barber.id,
                            barberName: barber.full_name,
                            mode: null,
                          })
                        }
                        disabled={actionLoading === barber.id}
                        title="Reject"
                      >
                        <X size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {confirmDialog && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-icon">
              <AlertTriangle size={28} />
            </div>
            <h3>Reject {confirmDialog.barberName}?</h3>
            <p>Choose how to handle this application:</p>
            <div className="admin-modal-actions">
              <button
                className="admin-modal-btn reject"
                onClick={() => {
                  setConfirmDialog({ ...confirmDialog, mode: "reject" });
                  setTimeout(handleReject, 0);
                }}
                disabled={actionLoading === confirmDialog.barberId}
              >
                <Ban size={16} />
                Mark as Rejected
              </button>
              <button
                className="admin-modal-btn delete"
                onClick={() => {
                  setConfirmDialog({ ...confirmDialog, mode: "delete" });
                  setTimeout(handleReject, 0);
                }}
                disabled={actionLoading === confirmDialog.barberId}
              >
                <Trash2 size={16} />
                Delete Profile
              </button>
              <button
                className="admin-modal-btn cancel"
                onClick={() => setConfirmDialog(null)}
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
