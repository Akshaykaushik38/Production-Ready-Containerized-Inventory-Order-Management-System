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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/orders/${id}`);
  };

  const columns = [
    { Header: "Order ID", accessor: "id" },
    { Header: "Customer", accessor: "customer_name" },
    { Header: "Total Amount", accessor: "total_amount", Cell: (row) => `$${parseFloat(row.total_amount).toFixed(2)}` },
    {
      Header: "Actions",
      accessor: "id",
      Cell: (row) => (
        <button className="btn btn-primary" onClick={() => handleRowClick(row.id)}>
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl" style={{ color: "var(--primary)" }}>Orders</h1>
        <button className="btn btn-primary" onClick={() => navigate("/orders/new")}>
          Create Order
        </button>
      </div>
      <Table data={orders} columns={columns} loading={loading} />
    </div>
  );
};

export default Orders;
