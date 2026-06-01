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

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--text-muted)", gap: 12 }}>
      <span style={{ fontSize: "1.5rem" }}>⟳</span> Loading order…
    </div>
  );
  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div className="badge badge-rose" style={{ padding: "10px 20px", fontSize: "0.9rem" }}>⚠ {error}</div>
    </div>
  );
  if (!order) return <div>No order found.</div>;

  const subtotal = order.items?.reduce((sum, item) => sum + parseFloat(item.price_at_purchase) * item.quantity, 0) || 0;

  return (
    <div className="container" style={{ maxWidth: 780 }}>
      {/* Back button */}
      <button
        className="btn"
        onClick={() => navigate("/orders")}
        style={{ alignSelf: "flex-start", marginBottom: 24, gap: 6 }}
      >
        ← Back to Orders
      </button>

      {/* Order Header Card */}
      <div className="card" style={{
        marginBottom: 20,
        background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
        borderColor: "rgba(99,102,241,0.25)",
        padding: "28px 32px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span className="badge badge-indigo" style={{ fontSize: "0.8rem", padding: "4px 12px" }}>
                📋 Order #{order.id}
              </span>
              <span className="badge badge-emerald">● Active</span>
            </div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              marginBottom: 4
            }}>
              Order Details
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Complete breakdown of order #{order.id}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 4 }}>
              Order Total
            </div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#34d399",
              letterSpacing: "-0.03em"
            }}>
              ₹{parseFloat(order.total_amount).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="card" style={{ marginBottom: 20, padding: "24px 28px" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 16 }}>
          👤 Customer Information
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              Customer Name
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {order.customer_name}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              Order Reference
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--indigo-light, #818cf8)" }}>
              #ORD-{String(order.id).padStart(4, "0")}
            </div>
          </div>
        </div>
      </div>

      {/* Items Card */}
      <div className="card" style={{ marginBottom: 20, padding: "24px 28px" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 16 }}>
          📦 Order Items ({order.items?.length || 0})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {order.items?.map((item, index) => (
            <div key={item.id || index} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              transition: "all 0.2s ease",
              gap: 12
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(99,102,241,0.07)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              {/* Item number */}
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700, color: "#818cf8",
                flexShrink: 0
              }}>
                {index + 1}
              </div>

              {/* Product name */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.925rem" }}>
                  {item.product_name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                  Unit Price: ₹{parseFloat(item.price_at_purchase).toFixed(2)}
                </div>
              </div>

              {/* Quantity badge */}
              <span className="badge badge-indigo">
                Qty: {item.quantity}
              </span>

              {/* Line total */}
              <div style={{ textAlign: "right", minWidth: 90 }}>
                <div style={{ fontWeight: 700, color: "#34d399", fontSize: "0.95rem" }}>
                  ₹{(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>line total</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Row */}
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 16
        }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>Order Total:</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#34d399" }}>
              ₹{parseFloat(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button className="btn" onClick={() => navigate("/orders")}>
          ← Back to Orders
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          🗑 Delete Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
