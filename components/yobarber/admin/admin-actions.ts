"use server";

import { createClient } from "@/lib/supabase/supabase-server";
import { createAdminClient } from "@/lib/supabase/supabase-admin";

/* ── Types ─────────────────────────────────────── */
export interface DashboardMetrics {
  activeBarbers: number;
  pendingBarbers: number;
  totalClients: number;
  totalAppointments: number;
}

export interface ProfileRow {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  avatar_url?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  address?: string | null;
  role: string;
  status: string;
  suspended_until?: string | null;
  created_at: string;
}

/* ── Clean Expired Suspensions Safely ───────────── */
async function cleanExpiredSuspensions(supabase: any) {
  try {
    const { data: suspendedUsers, error } = await supabase
      .from("profiles")
      .select("id, suspended_until")
      .eq("status", "suspended");

    if (error || !suspendedUsers || suspendedUsers.length === 0) return;

    const nowMs = Date.now();
    const expiredIds: string[] = [];

    for (const u of suspendedUsers) {
      if (u.suspended_until) {
        const untilMs = new Date(u.suspended_until).getTime();
        if (!isNaN(untilMs) && untilMs <= nowMs) {
          expiredIds.push(u.id);
        }
      }
    }

    if (expiredIds.length > 0) {
      await supabase
        .from("profiles")
        .update({ status: "active", suspended_until: null })
        .in("id", expiredIds);
    }
  } catch (err) {
    console.error("[cleanExpiredSuspensions] error:", err);
  }
}

/* ── Dashboard Metrics ─────────────────────────── */
export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  // Auto-unsuspend any expired suspensions safely
  await cleanExpiredSuspensions(supabase);

  const [activeBarbers, pendingBarbers, totalClients, totalAppointments] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "barber")
        .eq("status", "active"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "barber")
        .eq("status", "pending"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "client"),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true }),
    ]);

  return {
    activeBarbers: activeBarbers.count ?? 0,
    pendingBarbers: pendingBarbers.count ?? 0,
    totalClients: totalClients.count ?? 0,
    totalAppointments: totalAppointments.count ?? 0,
  };
}

/* ── Fetch Pending Barbers ─────────────────────── */
export async function fetchPendingBarbers(): Promise<ProfileRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, avatar_url, location_lat, location_lng, address, role, status, suspended_until, created_at")
    .eq("role", "barber")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as ProfileRow[]) ?? [];
}

/* ── Fetch Users (paginated, searchable, status filtered) ─ */
export async function fetchUsers(
  role: "barber" | "client",
  search?: string,
  page: number = 1,
  pageSize: number = 20,
  statusFilter: string = "all"
): Promise<{ data: ProfileRow[]; total: number }> {
  const supabase = await createClient();

  // 1. Clean expired suspensions safely
  await cleanExpiredSuspensions(supabase);

  // 2. Query users
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("profiles")
    .select(
      "id, full_name, phone, avatar_url, location_lat, location_lng, address, role, status, suspended_until, created_at",
      {
        count: "exact",
      }
    )
    .eq("role", role);

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`full_name.ilike.${term},phone.ilike.${term}`);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error) throw new Error(error.message);
  return { data: (data as ProfileRow[]) ?? [], total: count ?? 0 };
}

/* ── Approve Barber ────────────────────────────── */
export async function approveBarber(
  barberId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("id", barberId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/* ── Reject Barber ─────────────────────────────── */
export async function rejectBarber(
  barberId: string,
  action: "reject" | "delete"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  if (action === "delete") {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", barberId);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "rejected" })
      .eq("id", barberId);

    if (error) return { success: false, error: error.message };
  }

  return { success: true };
}

/* ── Update User Status (suspend/ban/reactivate) ─ */
export async function updateUserStatus(
  userId: string,
  newStatus: "active" | "suspended" | "banned" | "pending",
  suspendedUntil?: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createAdminClient();

  const updateData: Record<string, any> = { status: newStatus };
  if (newStatus === "suspended") {
    updateData.suspended_until = suspendedUntil || null;
  } else {
    updateData.suspended_until = null;
  }

  console.log("[updateUserStatus] Target userId:", userId, "Payload:", updateData);

  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", userId)
    .select("id, status, suspended_until");

  if (error) {
    console.error("[updateUserStatus] Supabase error:", error);
    return { success: false, error: `Supabase Error: ${error.message} (${error.code || "RLS"})` };
  }

  if (!data || data.length === 0) {
    console.error("[updateUserStatus] 0 rows updated for userId:", userId);
    return {
      success: false,
      error:
        "UPDATE failed: 0 rows affected. Supabase RLS policy may be blocking non-owner profile updates.",
    };
  }

  console.log("[updateUserStatus] Successfully updated in Supabase:", data[0]);
  return { success: true };
}
