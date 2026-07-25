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
  const supabase = await createAdminClient();

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
        .select("id", { count: "exact", head: true })
        .neq("status", "cancelled")
        .neq("status", "no_show"),
    ]);

  return {
    activeBarbers: activeBarbers.count ?? 0,
    pendingBarbers: pendingBarbers.count ?? 0,
    totalClients: totalClients.count ?? 0,
    totalAppointments: totalAppointments.count ?? 0,
  };
}

/* ── Avatar URL Formatter ───────────────────────── */
function formatAvatarUrl(url: string | null | undefined): string | null {
  if (!url || !url.trim()) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    const cleanPath = url.replace(/^avatars\//, "");
    return `${supabaseUrl}/storage/v1/object/public/avatars/${cleanPath}`;
  }
  return url;
}

/* ── Fetch Pending Barbers ─────────────────────── */
export async function fetchPendingBarbers(): Promise<ProfileRow[]> {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, avatar_url, location_lat, location_lng, address, role, status, suspended_until, created_at")
    .eq("role", "barber")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  const rows = (data as ProfileRow[]) ?? [];
  return rows.map((r) => ({
    ...r,
    avatar_url: formatAvatarUrl(r.avatar_url),
  }));
}

/* ── Fetch Users (paginated, searchable, status filtered) ─ */
export async function fetchUsers(
  role: "barber" | "client",
  search?: string,
  page: number = 1,
  pageSize: number = 20,
  statusFilter: string = "all"
): Promise<{ data: ProfileRow[]; total: number }> {
  const supabase = await createAdminClient();

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
  const rows = (data as ProfileRow[]) ?? [];
  const formatted = rows.map((r) => ({
    ...r,
    avatar_url: formatAvatarUrl(r.avatar_url),
  }));
  return { data: formatted, total: count ?? 0 };
}

/* ── Approve Barber ────────────────────────────── */
export async function approveBarber(
  barberId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createAdminClient();

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
  const supabase = await createAdminClient();

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

/* ═══════════════════════════════════════════════
   OVERVIEW DASHBOARD — New Data Actions
   ═══════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────── */
export interface TrendDataPoint {
  date: string;  // e.g. "Mon", "Tue"
  fullDate: string;
  count: number; // total tickets (machi cancelled, no_show)
  completedCount: number; // tickets completed
}

export interface AppointmentsTrendResult {
  points: TrendDataPoint[];
  totalCount: number;
  completedCount: number;
}

export interface TopBarber {
  id: string;
  full_name: string;
  avatar_url: string | null;
  completedCount: number;
  avgRating: number | null;
}

export interface ActivityEvent {
  id: string;
  type: "booking" | "registration" | "completion" | "cancellation";
  title: string;
  description: string;
  timestamp: string;
}

/* ── Appointments Trend (7D / 30D / 12M) ─────────── */
export type TimeRange = "7d" | "30d" | "12m";

export async function fetchAppointmentsTrend(
  range: TimeRange = "7d"
): Promise<AppointmentsTrendResult> {
  const supabase = await createAdminClient();
  const points: TrendDataPoint[] = [];
  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const fullMonthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let rangeStart = new Date(now);
  if (range === "7d") {
    rangeStart.setDate(now.getDate() - 6);
    rangeStart.setHours(0, 0, 0, 0);
  } else if (range === "30d") {
    rangeStart.setDate(now.getDate() - 29);
    rangeStart.setHours(0, 0, 0, 0);
  } else if (range === "12m") {
    rangeStart = new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0, 0);
  }

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("id, status, created_at")
    .gte("created_at", rangeStart.toISOString());

  if (error) {
    console.error("[fetchAppointmentsTrend] error fetching appointments:", error);
  }

  const allApps = appointments ?? [];

  // total = ga3 tickets li machi 'cancelled', 'no_show'
  const validApps = allApps.filter(
    (app) => app.status !== "cancelled" && app.status !== "no_show"
  );
  const totalCount = validApps.length;

  // completed = tickets li completed
  const completedApps = allApps.filter((app) => app.status === "completed");
  const completedCount = completedApps.length;

  if (range === "7d") {
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);

      const dayTotal = validApps.filter((app) => {
        const t = new Date(app.created_at).getTime();
        return t >= startOfDay.getTime() && t <= endOfDay.getTime();
      }).length;

      const dayCompleted = completedApps.filter((app) => {
        const t = new Date(app.created_at).getTime();
        return t >= startOfDay.getTime() && t <= endOfDay.getTime();
      }).length;

      points.push({
        date: dayNames[startOfDay.getDay()],
        fullDate: `${dayNames[startOfDay.getDay()]}, ${monthNames[startOfDay.getMonth()]} ${startOfDay.getDate()}, ${startOfDay.getFullYear()}`,
        count: dayTotal,
        completedCount: dayCompleted,
      });
    }
  } else if (range === "30d") {
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);

      const dayTotal = validApps.filter((app) => {
        const t = new Date(app.created_at).getTime();
        return t >= startOfDay.getTime() && t <= endOfDay.getTime();
      }).length;

      const dayCompleted = completedApps.filter((app) => {
        const t = new Date(app.created_at).getTime();
        return t >= startOfDay.getTime() && t <= endOfDay.getTime();
      }).length;

      points.push({
        date: `${monthNames[startOfDay.getMonth()]} ${startOfDay.getDate()}`,
        fullDate: `${monthNames[startOfDay.getMonth()]} ${startOfDay.getDate()}, ${startOfDay.getFullYear()}`,
        count: dayTotal,
        completedCount: dayCompleted,
      });
    }
  } else if (range === "12m") {
    for (let i = 11; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);

      const monthTotal = validApps.filter((app) => {
        const t = new Date(app.created_at).getTime();
        return t >= startOfMonth.getTime() && t <= endOfMonth.getTime();
      }).length;

      const monthCompleted = completedApps.filter((app) => {
        const t = new Date(app.created_at).getTime();
        return t >= startOfMonth.getTime() && t <= endOfMonth.getTime();
      }).length;

      points.push({
        date: monthNames[startOfMonth.getMonth()],
        fullDate: `${fullMonthNames[startOfMonth.getMonth()]} ${startOfMonth.getFullYear()}`,
        count: monthTotal,
        completedCount: monthCompleted,
      });
    }
  }

  return {
    points,
    totalCount,
    completedCount,
  };
}

/* ── Top 5 Performing Barbers ─────────────────── */
export async function fetchTopBarbers(): Promise<TopBarber[]> {
  const supabase = await createAdminClient();

  // 1. Get all active barbers
  const { data: barbers, error: barbersErr } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("role", "barber")
    .eq("status", "active");

  if (barbersErr || !barbers || barbers.length === 0) return [];

  // 2. For each barber, count completed appointments and avg reviews
  const results: TopBarber[] = [];

  for (const barber of barbers) {
    const { count: completedCount } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("barber_id", barber.id)
      .eq("status", "completed");

    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating_dealing, rating_prix, rating_time")
      .eq("barber_id", barber.id);

    let avgRating: number | null = null;
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, r) => sum + (r.rating_dealing + r.rating_prix + r.rating_time) / 3,
        0
      );
      avgRating = Math.round((totalRating / reviews.length) * 10) / 10;
    }

    results.push({
      id: barber.id,
      full_name: barber.full_name || "Unknown",
      avatar_url: formatAvatarUrl(barber.avatar_url),
      completedCount: completedCount ?? 0,
      avgRating,
    });
  }

  // 3. Sort by completedCount DESC, return top 5
  results.sort((a, b) => b.completedCount - a.completedCount);
  return results.slice(0, 5);
}

/* ── Recent Activity Feed (Last 8 Events) ─────── */
export async function fetchRecentActivities(): Promise<ActivityEvent[]> {
  const supabase = await createAdminClient();
  const events: ActivityEvent[] = [];

  // 1. Recent appointments (bookings, completions, cancellations)
  const { data: recentAppts } = await supabase
    .from("appointments")
    .select(
      "id, status, created_at, updated_at, guest_name, client:profiles!client_id(full_name), barber:profiles!barber_id(full_name)"
    )
    .in("status", ["pending", "approved", "completed", "cancelled", "no_show"])
    .order("updated_at", { ascending: false })
    .limit(10);

  if (recentAppts) {
    for (const appt of recentAppts) {
      const clientName =
        (appt.client as any)?.full_name || appt.guest_name || "A client";
      const barberName = (appt.barber as any)?.full_name || "a barber";

      if (appt.status === "completed") {
        events.push({
          id: `appt-comp-${appt.id}`,
          type: "completion",
          title: "Appointment Completed",
          description: `${clientName} with ${barberName}`,
          timestamp: appt.updated_at,
        });
      } else if (appt.status === "cancelled") {
        events.push({
          id: `appt-cancel-${appt.id}`,
          type: "cancellation",
          title: "Appointment Cancelled",
          description: `${clientName} cancelled with ${barberName}`,
          timestamp: appt.updated_at,
        });
      } else if (appt.status === "no_show") {
        events.push({
          id: `appt-noshow-${appt.id}`,
          type: "cancellation",
          title: "Client No-Show",
          description: `${clientName} didn't show up for ${barberName}`,
          timestamp: appt.updated_at,
        });
      } else if (appt.status === "pending" || appt.status === "approved") {
        events.push({
          id: `appt-book-${appt.id}`,
          type: "booking",
          title: "New Queue Booking",
          description: `${clientName} booked with ${barberName}`,
          timestamp: appt.created_at,
        });
      }
    }
  }

  // 2. Recent barber registrations
  const { data: recentBarbers } = await supabase
    .from("profiles")
    .select("id, full_name, created_at, status")
    .eq("role", "barber")
    .order("created_at", { ascending: false })
    .limit(5);

  if (recentBarbers) {
    for (const barber of recentBarbers) {
      events.push({
        id: `reg-${barber.id}`,
        type: "registration",
        title: "New Barber Registered",
        description: `${barber.full_name || "A barber"} joined the platform`,
        timestamp: barber.created_at,
      });
    }
  }

  // 3. Recent client registrations
  const { data: recentClients } = await supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .eq("role", "client")
    .order("created_at", { ascending: false })
    .limit(3);

  if (recentClients) {
    for (const client of recentClients) {
      events.push({
        id: `client-reg-${client.id}`,
        type: "registration",
        title: "New Client Joined",
        description: `${client.full_name || "A client"} signed up`,
        timestamp: client.created_at,
      });
    }
  }

  // 4. Sort all events by timestamp DESC, return top 8
  events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return events.slice(0, 8);
}
