import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrder, deleteOrder } from "../api";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await fetchOrder(id);
        setOrder(response.data);
      } catch (err) {
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteOrder(id);
      navigate("/orders");
    } catch (err) {
      alert("Unable to delete order.");
    }
  };

  if (loading) return <div className="toast">Loading...</div>;
  if (error) return <div className="toast error">{error}</div>;
  if (!order) return <div>No order found.</div>;

  return (
    <div className="order-detail glass-card container">
      <h1 className="title">Order #{order.id}</h1>
      <p><strong>Customer:</strong> {order.customer_name}</p>
      <p><strong>Total:</strong> ₹{parseFloat(order.total_amount).toFixed(2)}</p>
      <h2 className="subtitle">Items</h2>
      <ul className="item-list">
        {order.items?.map((item) => (
          <li key={item.id} className="item">
            {item.product_name} — Qty: {item.quantity} — ₹{parseFloat(item.price_at_purchase).toFixed(2)}
          </li>
        ))}
      </ul>
      <button className="btn btn-danger" onClick={handleDelete} style={{ marginTop: "1.5rem" }}>Delete Order</button>
    </div>
  );
};

export default OrderDetail;
