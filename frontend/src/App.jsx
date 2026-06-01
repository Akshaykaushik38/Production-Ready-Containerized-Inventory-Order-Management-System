import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import OrderCreate from "./pages/OrderCreate";
import Toast from "./components/Toast";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <span style={{ fontSize: "1.5rem" }}>📦</span> TeamFlow Ops
          </div>
          <div className="navbar-links">
            <NavLink to="/" className="nav-link" end>Dashboard</NavLink>
            <NavLink to="/products" className="nav-link">Products</NavLink>
            <NavLink to="/customers" className="nav-link">Customers</NavLink>
            <NavLink to="/orders" className="nav-link">Orders</NavLink>
          </div>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm editMode={true} />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/new" element={<OrderCreate />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
          </Routes>
        </main>
        <Toast />
      </div>
    </Router>
  );
};

export default App;
