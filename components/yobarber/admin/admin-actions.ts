"use server";

import { createClient } from "@/lib/supabase/supabase-server";

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
  shop_name: string | null;
  role: string;
  status: string;
  created_at: string;
}

/* ── Dashboard Metrics ─────────────────────────── */
export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

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
    .select("id, full_name, phone, role, status, created_at")
    .eq("role", "barber")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as ProfileRow[]) ?? [];
}

/* ── Fetch Users (paginated, searchable) ───────── */
export async function fetchUsers(
  role: "barber" | "client",
  search?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{ data: ProfileRow[]; total: number }> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("profiles")
    .select("id, full_name, phone, role, status, created_at", {
      count: "exact",
    })
    .eq("role", role)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`full_name.ilike.${term},phone.ilike.${term}`);
  }

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
  newStatus: "active" | "suspended" | "banned"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ status: newStatus })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
