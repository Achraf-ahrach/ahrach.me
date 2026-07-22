"use client";

import { useEffect, useState } from "react";
import {
  fetchDashboardMetrics,
  type DashboardMetrics,
} from "./admin-actions";
import {
  Scissors,
  Clock,
  Users,
  CalendarCheck,
  TrendingUp,
  Loader2,
} from "lucide-react";

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

export default function OverviewPanel() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to load metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-state">
        <Loader2 size={32} className="admin-spinner" />
        <p>Loading dashboard metrics…</p>
      </div>
    );
  }

  return (
    <div className="admin-overview">
      {/* KPI Grid */}
      <div className="admin-kpi-grid">
        {CARDS.map((card) => (
          <div key={card.key} className={`admin-kpi-card ${card.gradient}`}>
            <div className="admin-kpi-icon">{card.icon}</div>
            <div className="admin-kpi-data">
              <span className="admin-kpi-value">
                <AnimatedCounter value={metrics?.[card.key] ?? 0} />
              </span>
              <span className="admin-kpi-label">{card.label}</span>
            </div>
            <div className="admin-kpi-trend">
              <TrendingUp size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary */}
      <div className="admin-overview-summary">
        <h3>Quick Summary</h3>
        <p>
          You have{" "}
          <strong className="text-amber-400">
            {metrics?.pendingBarbers ?? 0} pending barber
            {(metrics?.pendingBarbers ?? 0) !== 1 ? "s" : ""}
          </strong>{" "}
          awaiting approval. Use the{" "}
          <strong className="text-blue-400">Pending Approvals</strong> tab to
          review and approve or reject applications.
        </p>
      </div>
    </div>
  );
}
