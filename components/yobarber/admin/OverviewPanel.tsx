"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient as createBrowserClient } from "@/lib/supabase/supabase-client";
import {
  fetchDashboardMetrics,
  fetchAppointmentsTrend,
  fetchTopBarbers,
  fetchRecentActivities,
  fetchPendingBarbers,
  approveBarber,
  rejectBarber,
  type DashboardMetrics,
  type TrendDataPoint,
  type TopBarber,
  type ActivityEvent,
  type ProfileRow,
  type TimeRange,
} from "./admin-actions";
import {
  Scissors,
  Clock,
  Users,
  CalendarCheck,
  TrendingUp,
  Loader2,
  BarChart3,
  Crown,
  Activity,
  ShieldCheck,
  Star,
  CheckCircle2,
  XCircle,
  CalendarPlus,
  UserPlus,
  UserCheck,
  Ban,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ── Animated Counter ──────────────────────────── */
function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

/* ── Time Ago Utility ──────────────────────────── */
function timeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/* ── Custom Tooltip ────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const dataPoint = payload[0]?.payload;
  const displayDate = dataPoint?.fullDate || label;
  const total = payload[0].value ?? 0;
  const completed = dataPoint?.completedCount ?? 0;

  return (
    <div className="admin-chart-tooltip">
      <span className="admin-chart-tooltip-label">{displayDate}</span>
      <div className="flex flex-col gap-0.5 mt-1">
        <span className="admin-chart-tooltip-value">
          Total: <strong>{total}</strong>
        </span>
        <span className="text-[11.5px] text-emerald-400 font-semibold">
          Completed: <strong>{completed}</strong>
        </span>
      </div>
    </div>
  );
}

/* ── KPI Card Config ───────────────────────────── */
const CARDS = [
  {
    key: "activeBarbers" as const,
    label: "Active Barbers",
    icon: <Scissors size={22} />,
    gradient: "admin-kpi-blue",
  },
  {
    key: "pendingBarbers" as const,
    label: "Pending Barbers",
    icon: <Clock size={22} />,
    gradient: "admin-kpi-amber",
  },
  {
    key: "totalClients" as const,
    label: "Total Clients",
    icon: <Users size={22} />,
    gradient: "admin-kpi-emerald",
  },
  {
    key: "totalAppointments" as const,
    label: "Appointments",
    icon: <CalendarCheck size={22} />,
    gradient: "admin-kpi-violet",
  },
];

/* ── Activity Badge Colors ─────────────────────── */
const ACTIVITY_CONFIG: Record<
  ActivityEvent["type"],
  { icon: React.ReactNode; className: string }
> = {
  booking: {
    icon: <CalendarPlus size={14} />,
    className: "admin-activity-badge-blue",
  },
  registration: {
    icon: <UserPlus size={14} />,
    className: "admin-activity-badge-amber",
  },
  completion: {
    icon: <CheckCircle2 size={14} />,
    className: "admin-activity-badge-green",
  },
  cancellation: {
    icon: <Ban size={14} />,
    className: "admin-activity-badge-red",
  },
};

/* ── Entity ID Extractor for Activity Deduplication ────── */
function getEntityId(eventId: string): string {
  if (eventId.startsWith("appt-comp-")) return eventId.slice("appt-comp-".length);
  if (eventId.startsWith("appt-cancel-")) return eventId.slice("appt-cancel-".length);
  if (eventId.startsWith("appt-noshow-")) return eventId.slice("appt-noshow-".length);
  if (eventId.startsWith("appt-book-")) return eventId.slice("appt-book-".length);
  if (eventId.startsWith("reg-")) return eventId.slice("reg-".length);
  if (eventId.startsWith("client-reg-")) return eventId.slice("client-reg-".length);
  return eventId;
}

/* ═══════════════════════════════════════════════
   OVERVIEW PANEL COMPONENT
   ═══════════════════════════════════════════════ */
export default function OverviewPanel() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [trend, setTrend] = useState<TrendDataPoint[]>([]);
  const [totalPeriodAppointments, setTotalPeriodAppointments] = useState(0);
  const [completedPeriodAppointments, setCompletedPeriodAppointments] = useState(0);
  const [topBarbers, setTopBarbers] = useState<TopBarber[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [pendingBarbers, setPendingBarbers] = useState<ProfileRow[]>([]);
  // Granular Independent Loading States
  const [kpisLoading, setKpisLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [topBarbersLoading, setTopBarbersLoading] = useState(true);
  const [pendingApprovalsLoading, setPendingApprovalsLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set());

  const timeRangeRef = useRef(timeRange);
  useEffect(() => {
    timeRangeRef.current = timeRange;
  }, [timeRange]);

  /* ── Debounce ref for realtime events ────────── */
  const realtimeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Independent Progressive Initial Load ──────────────── */
  const loadAll = useCallback(() => {
    // 1. KPI Metrics
    setKpisLoading(true);
    fetchDashboardMetrics()
      .then((m) => setMetrics(m))
      .catch((err) => console.error("Failed to load dashboard metrics:", err))
      .finally(() => setKpisLoading(false));

    // 2. Appointments Chart Trend
    setChartLoading(true);
    fetchAppointmentsTrend(timeRangeRef.current)
      .then((res) => {
        setTrend(res.points);
        setTotalPeriodAppointments(res.totalCount);
        setCompletedPeriodAppointments(res.completedCount);
      })
      .catch((err) => console.error("Failed to load appointment trends:", err))
      .finally(() => setChartLoading(false));

    // 3. Top Performing Barbers
    setTopBarbersLoading(true);
    fetchTopBarbers()
      .then((tb) => setTopBarbers(tb))
      .catch((err) => console.error("Failed to load top barbers:", err))
      .finally(() => setTopBarbersLoading(false));

    // 4. Live Activity Feed
    setFeedLoading(true);
    fetchRecentActivities()
      .then((act) => setActivities(act))
      .catch((err) => console.error("Failed to load recent activities:", err))
      .finally(() => setFeedLoading(false));

    // 5. Quick Pending Approvals
    setPendingApprovalsLoading(true);
    fetchPendingBarbers()
      .then((pb) => setPendingBarbers(pb))
      .catch((err) => console.error("Failed to load pending barbers:", err))
      .finally(() => setPendingApprovalsLoading(false));
  }, []);

  /* ── Range change handler ───────────────────── */
  const handleRangeChange = async (newRange: TimeRange) => {
    if (newRange === timeRange || chartLoading) return;
    setTimeRange(newRange);
    setChartLoading(true);
    try {
      const res = await fetchAppointmentsTrend(newRange);
      setTrend(res.points);
      setTotalPeriodAppointments(res.totalCount);
      setCompletedPeriodAppointments(res.completedCount);
    } catch (err) {
      console.error("Failed to fetch trend for range:", newRange, err);
    } finally {
      setChartLoading(false);
    }
  };

  /* ── X-Axis tick formatter for clean 30D / Month labels ─ */
  const formatXAxisTick = useCallback(
    (value: string) => {
      if (timeRange === "30d" && value && value.includes(" ")) {
        const parts = value.split(" ");
        const month = parts[0];
        const dayStr = parts[1];

        // Find the actual index of this data point in the trend array
        const dataIndex = trend.findIndex((t) => t.date === value);

        // Always show Month if day is 1 or at index 0 of trend dataset
        if (dayStr === "1" || dataIndex === 0) {
          return `${month} ${dayStr}`;
        }

        // Show Month if the month changes from the previous item in trend
        if (dataIndex > 0) {
          const prevItem = trend[dataIndex - 1];
          if (prevItem && prevItem.date.includes(" ")) {
            const [prevMonth] = prevItem.date.split(" ");
            if (prevMonth !== month) {
              return `${month} ${dayStr}`;
            }
          }
        }

        // Otherwise return only numeric day number (e.g., "25", "28")
        return dayStr;
      }
      return value;
    },
    [timeRange, trend]
  );

  /* ── Realtime Event Parsers for Instant Feed Updates ── */
  const parseAppointmentPayload = useCallback((payload: any): ActivityEvent | null => {
    const record = payload.new || payload.old;
    if (!record) return null;
    const { id, status, updated_at, created_at, client_id, guest_name, client_name, barber_name } = record;
    
    // Check for Guest Status: client_id is null OR guest_name is present
    const isGuest = !client_id || Boolean(guest_name);
    const guestName = guest_name || "Guest";
    const clientName = guest_name || client_name || "A client";
    const barberName = barber_name || "A barber";
    const ts = updated_at || created_at || new Date().toISOString();

    let eventItem: ActivityEvent | null = null;

    if (status === "completed") {
      eventItem = {
        id: `appt-comp-${id}`,
        type: "completion",
        title: "Appointment Completed",
        description: isGuest
          ? `${barberName} completed guest '${guestName}'`
          : `${clientName} with ${barberName}`,
        timestamp: ts,
      };
    } else if (status === "cancelled") {
      eventItem = {
        id: `appt-cancel-${id}`,
        type: "cancellation",
        title: "Appointment Cancelled",
        description: isGuest
          ? `Guest '${guestName}' cancelled with ${barberName}`
          : `${clientName} cancelled with ${barberName}`,
        timestamp: ts,
      };
    } else if (status === "no_show") {
      eventItem = {
        id: `appt-noshow-${id}`,
        type: "cancellation",
        title: "Client No-Show",
        description: isGuest
          ? `Guest '${guestName}' didn't show up for ${barberName}`
          : `${clientName} didn't show up for ${barberName}`,
        timestamp: ts,
      };
    } else if (status === "pending" || status === "approved") {
      if (isGuest) {
        eventItem = {
          id: `appt-book-${id}`,
          type: "booking",
          title: "Guest Added to Queue",
          description: `${barberName} added guest '${guestName}'`,
          timestamp: ts,
        };
      } else {
        eventItem = {
          id: `appt-book-${id}`,
          type: "booking",
          title: "New Queue Booking",
          description: `${clientName} booked with ${barberName}`,
          timestamp: ts,
        };
      }
    }

    if (eventItem) {
      console.log("🔔 [Realtime Feed Event Created]:", eventItem);
    }
    return eventItem;
  }, []);

  const parseProfilePayload = useCallback((payload: any): ActivityEvent | null => {
    const record = payload.new;
    // Only trigger registration event for newly created accounts (INSERT)
    if (!record || payload.eventType !== "INSERT") return null;
    const { id, full_name, role, created_at } = record;
    const name = full_name || (role === "barber" ? "A barber" : "A client");
    const ts = created_at || new Date().toISOString();

    const isBarber = role === "barber";
    const eventItem: ActivityEvent = {
      id: isBarber ? `reg-${id}` : `client-reg-${id}`,
      type: "registration",
      title: isBarber ? "New Barber Registered" : "New Client Joined",
      description: isBarber ? `${name} joined the platform` : `${name} signed up`,
      timestamp: ts,
    };

    console.log("🔔 [Realtime Feed Event Created]:", eventItem);
    return eventItem;
  }, []);

  /* ── Background Sync for Aggregate Widgets (KPIs, Chart, Top Barbers) ─ */
  const syncAggregatesBackground = useCallback(async () => {
    try {
      const [m, trendRes, tb, freshActivities] = await Promise.all([
        fetchDashboardMetrics(),
        fetchAppointmentsTrend(timeRangeRef.current),
        fetchTopBarbers(),
        fetchRecentActivities(),
      ]);
      setMetrics(m);
      setTrend(trendRes.points);
      setTotalPeriodAppointments(trendRes.totalCount);
      setCompletedPeriodAppointments(trendRes.completedCount);
      setTopBarbers(tb);

      setActivities((prev) => {
        const merged: ActivityEvent[] = [];
        const seenEntityIds = new Set<string>();

        // 1. Fresh server activities with full joined relations take precedence
        for (const item of freshActivities) {
          merged.push(item);
          seenEntityIds.add(getEntityId(item.id));
        }

        // 2. Retain any un-synced realtime items for entities not present in server response
        for (const item of prev) {
          const entityId = getEntityId(item.id);
          if (!seenEntityIds.has(entityId)) {
            merged.push(item);
            seenEntityIds.add(entityId);
          }
        }

        // 3. Sort by timestamp DESC
        merged.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return merged.slice(0, 8);
      });
    } catch (err) {
      console.error("Background aggregate sync failed:", err);
    }
  }, []);

  /* ── Debounced realtime aggregate sync (500ms) ───────── */
  const handleRealtimeEvent = useCallback(() => {
    if (realtimeTimer.current) clearTimeout(realtimeTimer.current);
    realtimeTimer.current = setTimeout(() => {
      syncAggregatesBackground();
    }, 500);
  }, [syncAggregatesBackground]);

  /* ── Initial load ────────────────────────────── */
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Keep stable refs for realtime handlers to prevent subscription teardown on re-renders
  const parseAppointmentPayloadRef = useRef(parseAppointmentPayload);
  useEffect(() => {
    parseAppointmentPayloadRef.current = parseAppointmentPayload;
  }, [parseAppointmentPayload]);

  const parseProfilePayloadRef = useRef(parseProfilePayload);
  useEffect(() => {
    parseProfilePayloadRef.current = parseProfilePayload;
  }, [parseProfilePayload]);

  const handleRealtimeEventRef = useRef(handleRealtimeEvent);
  useEffect(() => {
    handleRealtimeEventRef.current = handleRealtimeEvent;
  }, [handleRealtimeEvent]);

  /* ── Single Centralized Supabase Realtime Subscription + Auto Sync Backup ─ */
  useEffect(() => {
    const supabase = createBrowserClient();

    console.log("📡 [OverviewPanel] Subscribing to Supabase Realtime Channel...");

    const channel = supabase
      .channel("admin-overview-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        (payload) => {
          console.log("⚡ Realtime appointment event:", payload);
          const eventItem = parseAppointmentPayloadRef.current(payload);
          if (eventItem) {
            const entityId = getEntityId(eventItem.id);
            setActivities((prev) =>
              [eventItem, ...prev.filter((e) => getEntityId(e.id) !== entityId)].slice(0, 8)
            );
          }
          handleRealtimeEventRef.current();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          console.log("⚡ Realtime profile event:", payload);
          const record = payload.new as ProfileRow | undefined;
          if (record && record.role === "barber") {
            if (record.status === "pending") {
              setPendingBarbers((prev) => {
                const exists = prev.some((b) => b.id === record.id);
                if (exists) {
                  return prev.map((b) => (b.id === record.id ? { ...b, ...record } : b));
                }
                return [record, ...prev];
              });
            } else {
              setPendingBarbers((prev) => prev.filter((b) => b.id !== record.id));
            }
          }

          const regEvent = parseProfilePayloadRef.current(payload);
          if (regEvent) {
            const entityId = getEntityId(regEvent.id);
            setActivities((prev) =>
              [regEvent, ...prev.filter((e) => getEntityId(e.id) !== entityId)].slice(0, 8)
            );
          }

          handleRealtimeEventRef.current();
        }
      )
      .subscribe((status, err) => {
        console.log("📡 Realtime Subscription Status:", status);
        if (err) console.error("❌ Realtime Subscription Error:", err);
      });

    // 6-second backup polling for 100% reliable live updates
    const syncInterval = setInterval(() => {
      syncAggregatesBackground();
    }, 6000);

    return () => {
      console.log("🔌 [OverviewPanel] Unsubscribing from Realtime Channel...");
      clearInterval(syncInterval);
      if (realtimeTimer.current) clearTimeout(realtimeTimer.current);
      supabase.removeChannel(channel);
    };
  }, [syncAggregatesBackground]);

  /* ── Approve / Reject Handlers ───────────────── */
  const handleApprove = async (id: string) => {
    setActionLoading(id);
    // Optimistic removal
    setPendingBarbers((prev) => prev.filter((b) => b.id !== id));
    setMetrics((prev) =>
      prev
        ? {
            ...prev,
            activeBarbers: prev.activeBarbers + 1,
            pendingBarbers: Math.max(0, prev.pendingBarbers - 1),
          }
        : prev
    );
    try {
      const res = await approveBarber(id);
      if (!res.success) {
        // Rollback on failure — reload fresh data
        await syncAggregatesBackground();
      }
      // Background sync all server state
      router.refresh();
    } catch (err) {
      console.error("Approve failed:", err);
      await syncAggregatesBackground();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    // Optimistic removal
    setPendingBarbers((prev) => prev.filter((b) => b.id !== id));
    setMetrics((prev) =>
      prev
        ? {
            ...prev,
            pendingBarbers: Math.max(0, prev.pendingBarbers - 1),
          }
        : prev
    );
    try {
      const res = await rejectBarber(id, "reject");
      if (!res.success) {
        await syncAggregatesBackground();
      }
      router.refresh();
    } catch (err) {
      console.error("Reject failed:", err);
      await syncAggregatesBackground();
    } finally {
      setActionLoading(null);
    }
  };

  const hasChartData = trend.some((d) => d.count > 0);

  return (
    <div className="admin-overview">
      {/* ── KPI Grid ── */}
      <div className="admin-kpi-grid">
        {CARDS.map((card) => (
          <div key={card.key} className={`admin-kpi-card ${card.gradient}`}>
            <div className="admin-kpi-icon">{card.icon}</div>
            <div className={`admin-kpi-data ${!kpisLoading ? "admin-fade-in" : ""}`}>
              {kpisLoading ? (
                <>
                  <div className="admin-skeleton h-7 w-16 mb-1.5 rounded" />
                  <div className="admin-skeleton h-3.5 w-24 rounded" />
                </>
              ) : (
                <>
                  <span className="admin-kpi-value">
                    <AnimatedCounter value={metrics?.[card.key] ?? 0} />
                  </span>
                  <span className="admin-kpi-label">{card.label}</span>
                </>
              )}
            </div>
            <div className="admin-kpi-trend">
              <TrendingUp size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* ── 2-Column Content Grid ── */}
      <div className="admin-overview-grid">
        {/* ═══ Left Column ═══ */}
        <div className="admin-overview-col">
          {/* ── Chart Widget ── */}
          <div className="admin-widget">
            <div className="admin-widget-header">
              <BarChart3 size={18} className="admin-widget-icon" />
              <div className="admin-widget-title-group">
                <h3>Appointments</h3>
                {!chartLoading && (
                  <div className="flex items-center gap-2 admin-fade-in">
                    <span className="admin-chart-total-badge">
                      Total: <strong>{totalPeriodAppointments}</strong>
                    </span>
                    <span className="admin-chart-total-badge admin-chart-completed-badge">
                      Completed: <strong>{completedPeriodAppointments}</strong>
                    </span>
                  </div>
                )}
              </div>
              <div className="admin-chart-filter-toggle">
                {chartLoading && (
                  <Loader2 size={13} className="admin-spinner" />
                )}
                {(
                  [
                    { key: "7d", label: "Week" },
                    { key: "30d", label: "Month" },
                    { key: "12m", label: "Year" },
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    className={`admin-chart-filter-pill ${
                      timeRange === key ? "active" : ""
                    }`}
                    onClick={() => handleRangeChange(key)}
                    disabled={chartLoading}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-chart-container">
              {chartLoading ? (
                <div className="admin-skeleton h-[240px] w-full rounded-xl" />
              ) : hasChartData ? (
                <div className="admin-fade-in w-full h-[240px]">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart
                      data={trend}
                      margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="chartGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="100%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#8888a8", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={formatXAxisTick}
                        interval="preserveStartEnd"
                        minTickGap={25}
                      />
                      <YAxis
                        tick={{ fill: "#8888a8", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        fill="url(#chartGradient)"
                        dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
                        activeDot={{
                          r: 6,
                          fill: "#a78bfa",
                          stroke: "#8b5cf6",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="admin-widget-empty admin-fade-in">
                  <BarChart3 size={36} />
                  <p>No appointment data yet</p>
                  <span>Chart will populate as bookings come in</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Top Performing Barbers ── */}
          <div className="admin-widget">
            <div className="admin-widget-header">
              <Crown size={18} className="admin-widget-icon" />
              <h3>Top Performing Barbers</h3>
            </div>
            <div className="admin-top-barbers-list">
              {topBarbersLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="admin-top-barber-item">
                    <div className="admin-skeleton w-6.5 h-6.5 rounded-lg flex-shrink-0" />
                    <div className="admin-skeleton w-9 h-9 rounded-xl flex-shrink-0" />
                    <div className="admin-top-barber-info gap-1.5">
                      <div className="admin-skeleton h-3.5 w-28 rounded" />
                      <div className="admin-skeleton h-3 w-16 rounded" />
                    </div>
                    <div className="admin-skeleton h-4 w-8 rounded flex-shrink-0" />
                  </div>
                ))
              ) : topBarbers.length > 0 ? (
                topBarbers.map((barber, idx) => (
                  <div key={barber.id} className="admin-top-barber-item admin-fade-in">
                    <span className={`admin-top-barber-rank rank-${idx + 1}`}>
                      {idx + 1}
                    </span>
                    <div className="admin-top-barber-avatar">
                      {barber.avatar_url && !failedAvatars.has(barber.id) ? (
                        <img
                          src={barber.avatar_url}
                          alt={barber.full_name}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedAvatars((prev) => new Set(prev).add(barber.id))
                          }
                        />
                      ) : (
                        <span className="admin-top-barber-initials">
                          {barber.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="admin-top-barber-info">
                      <span className="admin-top-barber-name">
                        {barber.full_name}
                      </span>
                      <span className="admin-top-barber-stats">
                        {barber.completedCount} completed
                      </span>
                    </div>
                    <div className="admin-top-barber-rating">
                      {barber.avgRating !== null ? (
                        <>
                          <Star size={13} className="admin-star-icon" />
                          <span>{barber.avgRating}</span>
                        </>
                      ) : (
                        <span className="admin-no-rating">—</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-widget-empty compact admin-fade-in">
                  <Scissors size={28} />
                  <p>No barber data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ Right Column ═══ */}
        <div className="admin-overview-col">
          {/* ── Live Activity Feed ── */}
          <div className="admin-widget">
            <div className="admin-widget-header">
              <Activity size={18} className="admin-widget-icon" />
              <h3>Live Activity Feed</h3>
            </div>
            <div className="admin-activity-list">
              {feedLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="admin-activity-item">
                    <div className="admin-skeleton w-7.5 h-7.5 rounded-lg flex-shrink-0" />
                    <div className="admin-activity-content gap-1.5">
                      <div className="admin-skeleton h-3.5 w-32 rounded" />
                      <div className="admin-skeleton h-3 w-44 rounded" />
                    </div>
                    <div className="admin-skeleton h-3 w-12 rounded flex-shrink-0" />
                  </div>
                ))
              ) : activities.length > 0 ? (
                activities.map((event) => {
                  const config = ACTIVITY_CONFIG[event.type];
                  return (
                    <div key={event.id} className="admin-activity-item admin-fade-in">
                      <div
                        className={`admin-activity-badge ${config.className}`}
                      >
                        {config.icon}
                      </div>
                      <div className="admin-activity-content">
                        <span className="admin-activity-title">
                          {event.title}
                        </span>
                        <span className="admin-activity-desc">
                          {event.description}
                        </span>
                      </div>
                      <span className="admin-activity-time">
                        {timeAgo(event.timestamp)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="admin-widget-empty compact admin-fade-in">
                  <Activity size={28} />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Quick Pending Approvals ── */}
          <div className="admin-widget">
            <div className="admin-widget-header">
              <ShieldCheck size={18} className="admin-widget-icon" />
              <h3>Pending Approvals</h3>
              {!pendingApprovalsLoading && pendingBarbers.length > 0 && (
                <span className="admin-widget-count admin-fade-in">
                  {pendingBarbers.length}
                </span>
              )}
            </div>
            <div className="admin-pending-list">
              {pendingApprovalsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="admin-pending-mini">
                    <div className="admin-skeleton w-8.5 h-8.5 rounded-xl flex-shrink-0" />
                    <div className="admin-pending-info gap-1.5">
                      <div className="admin-skeleton h-3.5 w-24 rounded" />
                      <div className="admin-skeleton h-3 w-20 rounded" />
                    </div>
                    <div className="admin-pending-actions gap-1.5">
                      <div className="admin-skeleton w-7.5 h-7.5 rounded-lg" />
                      <div className="admin-skeleton w-7.5 h-7.5 rounded-lg" />
                    </div>
                  </div>
                ))
              ) : pendingBarbers.length > 0 ? (
                pendingBarbers.slice(0, 4).map((barber) => (
                  <div key={barber.id} className="admin-pending-mini admin-fade-in">
                    <div className="admin-pending-avatar">
                      {barber.avatar_url && !failedAvatars.has(barber.id) ? (
                        <img
                          src={barber.avatar_url}
                          alt={barber.full_name}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedAvatars((prev) => new Set(prev).add(barber.id))
                          }
                        />
                      ) : (
                        <UserCheck size={16} />
                      )}
                    </div>
                    <div className="admin-pending-info">
                      <span className="admin-pending-name">
                        {barber.full_name}
                      </span>
                      <span className="admin-pending-phone">
                        {barber.phone}
                      </span>
                    </div>
                    <div className="admin-pending-actions">
                      <button
                        className="admin-mini-approve"
                        onClick={() => handleApprove(barber.id)}
                        disabled={actionLoading === barber.id}
                        title="Approve"
                      >
                        {actionLoading === barber.id ? (
                          <Loader2 size={14} className="admin-spinner" />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                      </button>
                      <button
                        className="admin-mini-reject"
                        onClick={() => handleReject(barber.id)}
                        disabled={actionLoading === barber.id}
                        title="Reject"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-widget-empty compact admin-fade-in">
                  <Inbox size={28} />
                  <p>All clear!</p>
                  <span>No pending barbers to review</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
