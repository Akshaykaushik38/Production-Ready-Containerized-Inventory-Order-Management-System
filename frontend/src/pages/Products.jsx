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

  useEffect(() => {
    loadProducts();
  }, []);

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
    { Header: "Name", accessor: "name" },
    { Header: "SKU", accessor: "sku" },
    { Header: "Price", accessor: "price", Cell: (row) => `$${parseFloat(row.price).toFixed(2)}` },
    { Header: "Quantity", accessor: "quantity" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (row) => (
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => navigate(`/products/edit/${row.id}`)}>Edit</button>
          <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl" style={{ color: "var(--primary)" }}>Products</h1>
        <button className="btn btn-primary" onClick={() => navigate("/products/new")}>
          Add Product
        </button>
      </div>
      <Table columns={columns} data={products} loading={loading} />
    </div>
  );
};

export default Products;
