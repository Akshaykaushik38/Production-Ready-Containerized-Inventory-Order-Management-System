// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchDashboardStats } from "../api";
import Table from "../components/Table";

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

  if (loading) return <div className="toast">Loading dashboard…</div>;
  if (error) return <div className="toast error">{error}</div>;

  const cards = [
    { label: "Total Products", value: stats.total_products, color: "#6366f1" },
    { label: "Total Customers", value: stats.total_customers, color: "#8b5cf6" },
    { label: "Total Orders", value: stats.total_orders, color: "#10b981" },
    { label: "Low Stock Alert", value: stats.low_stock_count, color: "#f59e0b" }
  ];

  const lowStockColumns = [
    { Header: "Name", accessor: "name" },
    { Header: "SKU", accessor: "sku" },
    { Header: "Qty", accessor: "quantity" },
    { Header: "Price", accessor: "price", Cell: (row) => `$${parseFloat(row.price).toFixed(2)}` }
  ];

  return (
    <div className="container">
      <h1 className="text-2xl mb-6" style={{ color: "var(--primary)" }}>Operations Dashboard</h1>
      <div className="grid gap-4 mb-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="card"
            style={{ borderLeft: `4px solid ${c.color}` }}
          >
            <h2 className="text-xl" style={{ color: c.color }}>{c.label}</h2>
            <p className="stat-value">{c.value}</p>
          </div>
        ))}
      </div>
      <h2 className="text-xl mb-4" style={{ color: "#f59e0b" }}>⚠️ Low Stock Warning (Less than 10 units)</h2>
      <Table columns={lowStockColumns} data={stats.low_stock_products} loading={false} />
    </div>
  );
};

export default Dashboard;
