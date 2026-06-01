// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchDashboardStats } from "../api";
import Table from "../components/Table";

const StatCard = ({ label, value, icon, colorClass, trend }) => (
  <div className={`stat-card ${colorClass}`}>
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-label">{label}</div>
    <div className="stat-value">{value ?? "—"}</div>
    {trend && <div className="stat-card-trend">{trend}</div>}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchDashboardStats();
        setStats(res.data);
      } catch (e) {
        setError(e.response?.data?.detail || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--text-muted)", gap: 12 }}>
      <span style={{ fontSize: "1.5rem", animation: "spin 1s linear infinite" }}>⟳</span>
      Loading dashboard…
    </div>
  );
  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div className="badge badge-rose" style={{ padding: "10px 20px", fontSize: "0.9rem" }}>⚠ {error}</div>
    </div>
  );

  const cards = [
    { label: "Total Products",   value: stats.total_products,   icon: "📦", colorClass: "indigo",  trend: "Inventory items" },
    { label: "Total Customers",  value: stats.total_customers,  icon: "👥", colorClass: "violet",  trend: "Registered accounts" },
    { label: "Total Orders",     value: stats.total_orders,     icon: "📋", colorClass: "emerald", trend: "All time orders" },
    { label: "Low Stock Alert",  value: stats.low_stock_count,  icon: "⚠",  colorClass: "amber",   trend: "Items below 10 units" },
  ];

  const lowStockColumns = [
    { Header: "Product Name", accessor: "name" },
    { Header: "SKU", accessor: "sku" },
    {
      Header: "Qty",
      accessor: "quantity",
      Cell: (row) => (
        <span className={`badge ${row.quantity <= 5 ? "badge-rose" : "badge-amber"}`}>
          {row.quantity} units
        </span>
      ),
    },
    {
      Header: "Price",
      accessor: "price",
      Cell: (row) => (
        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
          ${parseFloat(row.price).toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Operations Dashboard</h1>
          <p className="page-subtitle">Real-time overview of your inventory & orders</p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      <div className="low-stock-header">
        <span className="low-stock-badge">⚠ Low Stock Warning — Less than 10 units</span>
      </div>
      <Table columns={lowStockColumns} data={stats.low_stock_products} loading={false} />
    </div>
  );
};

export default Dashboard;
