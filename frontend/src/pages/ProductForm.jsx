import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Toast from "../components/Toast";

const initialForm = { name: "", sku: "", price: "", quantity: "" };

const ProductForm = ({ editMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode && id) {
      // fetch existing product
      api.get(`/products/${id}`)
        .then(res => setForm({
          name: res.data.name,
          sku: res.data.sku,
          price: res.data.price,
          quantity: res.data.quantity,
        }))
        .catch(() => Toast.error("Failed to load product"));
    }
  }, [editMode, id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: form.name,
      sku: form.sku,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    };
    try {
      if (editMode) {
        await api.put(`/products/${id}`, payload);
        Toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        Toast.success("Product created");
      }
      navigate("/products");
    } catch (err) {
      Toast.error(err.response?.data?.detail || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "500px", margin: "2rem auto" }}>
        <h2 className="text-2xl mb-6" style={{ color: "var(--primary)" }}>
          {editMode ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Name
            <input className="input" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            SKU
            <input className="input" name="sku" value={form.sku} onChange={handleChange} required placeholder="e.g. PROD-1001" />
          </label>
          <label>
            Price ($)
            <input className="input" type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required placeholder="0.00" />
          </label>
          <label>
            Quantity
            <input className="input" type="number" name="quantity" value={form.quantity} onChange={handleChange} required min="0" placeholder="0" />
          </label>
          <div className="flex gap-2" style={{ marginTop: "1.5rem" }}>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Saving…" : editMode ? "Update Product" : "Create Product"}
            </button>
            <button type="button" className="btn" onClick={() => navigate("/products")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
