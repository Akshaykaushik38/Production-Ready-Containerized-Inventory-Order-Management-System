import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Toast from "../components/Toast";
import Modal from "../components/Modal";

const OrderCreate = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch customers and products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          api.get("/customers"),
          api.get("/products"),
        ]);
        setCustomers(custRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        Toast.error("Failed to load customers or products");
      }
    };
    fetchData();
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      Toast.error("Select a customer");
      return;
    }
    const payload = {
      customer_id: parseInt(selectedCustomer, 10),
      items: items.map((it) => ({
        product_id: parseInt(it.productId, 10),
        quantity: parseInt(it.quantity, 10),
      })),
    };
    setLoading(true);
    try {
      await api.post("/orders", payload);
      Toast.success("Order created");
      navigate("/orders");
    } catch (err) {
      Toast.error(err.response?.data?.detail || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "700px", margin: "2rem auto" }}>
        <h2 className="text-2xl mb-6" style={{ color: "var(--primary)" }}>Create New Order</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Customer *
            <select
              className="input"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              required
            >
              <option value="" disabled>Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </label>
          
          <h3 className="text-lg mt-6 mb-2" style={{ color: "var(--primary)" }}>Order Items</h3>
          <div className="order-items" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {items.map((item, idx) => (
              <div key={idx} className="order-item" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <select
                  className="input"
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(idx, "productId", e.target.value)
                  }
                  required
                  style={{ flex: 3 }}
                >
                  <option value="" disabled>Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                      {p.name} (Available: {p.quantity})
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(idx, "quantity", e.target.value)
                  }
                  required
                  placeholder="Qty"
                  style={{ flex: 1, minWidth: "80px" }}
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeItem(idx)}
                  disabled={items.length === 1}
                  style={{ padding: "0.5rem 0.75rem" }}
                >
                  ✕
                </button>
              </div>
            ))}
            <div>
              <button type="button" className="btn" onClick={addItem} style={{ marginTop: "0.5rem" }}>
                + Add Item Line
              </button>
            </div>
          </div>
          
          <div className="flex gap-2" style={{ marginTop: "2rem" }}>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Creating Order…" : "Submit Order"}
            </button>
            <button type="button" className="btn" onClick={() => navigate("/orders")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCreate;
