// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "../api";
import Table from "../components/Table";
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

  const columns = [
    {
      Header: "Product Name", accessor: "name",
      Cell: (row) => (
        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{row.name}</span>
      ),
    },
    {
      Header: "SKU", accessor: "sku",
      Cell: (row) => <span className="badge badge-indigo">{row.sku}</span>,
    },
    {
      Header: "Price", accessor: "price",
      Cell: (row) => (
        <span style={{ color: "#a5b4fc", fontWeight: 600 }}>
          ${parseFloat(row.price).toFixed(2)}
        </span>
      ),
    },
    {
      Header: "Stock", accessor: "quantity",
      Cell: (row) => {
        const qty = row.quantity;
        const cls = qty <= 0 ? "badge-rose" : qty <= 10 ? "badge-amber" : "badge-emerald";
        return <span className={`badge ${cls}`}>{qty} units</span>;
      },
    },
    {
      Header: "Actions", accessor: "actions",
      Cell: (row) => (
        <div className="flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/products/edit/${row.id}`)}>
            ✏ Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>
            🗑 Delete
          </button>
        </div>
      ),
    },
  ];

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
      <Table columns={columns} data={products} loading={loading} />
    </div>
  );
};

export default Products;
