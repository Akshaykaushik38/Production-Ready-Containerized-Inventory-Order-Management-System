// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "../api";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (e) {
      alert(e.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{products.length} total items in inventory</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/products/new")}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <span style={{ color: "var(--indigo-light)", fontSize: "1.1rem" }}>Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "4rem 2rem", 
          background: "rgba(255, 255, 255, 0.02)", 
          borderRadius: "16px", 
          border: "1px dashed rgba(255,255,255,0.08)" 
        }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>No products found in the inventory.</p>
        </div>
      ) : (
        <div className="product-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginTop: "1.5rem"
        }}>
          {products.map((product) => {
            const qty = product.quantity;
            const stockClass = qty <= 0 ? "badge-rose" : qty <= 10 ? "badge-amber" : "badge-emerald";
            return (
              <div 
                key={product.id}
                className="product-card" 
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(99, 102, 241, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.3)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                }}
              >
                {/* Decorative aurora accent */}
                <div style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "120px",
                  height: "120px",
                  background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)",
                  pointerEvents: "none"
                }} />

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                    <span className="badge badge-indigo" style={{ fontSize: "0.7rem", letterSpacing: "0.03em" }}>
                      {product.sku}
                    </span>
                    <span className={`badge ${stockClass}`} style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                      {qty <= 0 ? "Out of Stock" : `${qty} left`}
                    </span>
                  </div>

                  <h3 style={{ 
                    color: "var(--text-primary)", 
                    fontSize: "1.2rem", 
                    fontWeight: 700, 
                    margin: "1rem 0 0.5rem 0",
                    lineHeight: "1.3"
                  }}>
                    {product.name}
                  </h3>

                  <div style={{ 
                    fontSize: "1.45rem", 
                    fontWeight: 800, 
                    color: "#a5b4fc",
                    margin: "0.5rem 0 1.25rem 0"
                  }}>
                    ₹{parseFloat(product.price).toFixed(2)}
                  </div>
                </div>

                <div style={{ 
                  display: "flex", 
                  gap: "0.75rem", 
                  marginTop: "auto", 
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)", 
                  paddingTop: "1rem" 
                }}>
                  <button 
                    className="btn btn-primary btn-sm" 
                    style={{ flex: 1, padding: "0.55rem", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}
                    onClick={() => navigate(`/products/edit/${product.id}`)}
                  >
                    ✏ Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    style={{ flex: 1, padding: "0.55rem", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}
                    onClick={() => handleDelete(product.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
