// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Toast from "../components/Toast";
import Table from "../components/Table";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      Toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const columns = [
    {
      Header: "Order ID", accessor: "id",
      Cell: (row) => (
        <span className="badge badge-indigo">#{row.id}</span>
      ),
    },
    {
      Header: "Customer", accessor: "customer_name",
      Cell: (row) => (
        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{row.customer_name}</span>
      ),
    },
    {
      Header: "Total Amount", accessor: "total_amount",
      Cell: (row) => (
        <span style={{ color: "#34d399", fontWeight: 700, fontSize: "0.9rem" }}>
          ${parseFloat(row.total_amount).toFixed(2)}
        </span>
      ),
    },
    {
      Header: "Status", accessor: "status",
      Cell: () => <span className="badge badge-emerald">● Confirmed</span>,
    },
    {
      Header: "Actions", accessor: "actions",
      Cell: (row) => (
        <button className="btn btn-primary btn-sm" onClick={() => navigate(`/orders/${row.id}`)}>
          View Details →
        </button>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{orders.length} total orders processed</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/orders/new")}>
          + Create Order
        </button>
      </div>
      <Table data={orders} columns={columns} loading={loading} />
    </div>
  );
};

export default Orders;
