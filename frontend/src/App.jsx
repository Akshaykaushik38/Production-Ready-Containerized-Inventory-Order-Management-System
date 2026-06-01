import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import OrderCreate from "./pages/OrderCreate";
import Toast from "./components/Toast";

const pageTitles = {
  "/": "Dashboard",
  "/products": "Products",
  "/products/new": "New Product",
  "/customers": "Customers",
  "/orders": "Orders",
  "/orders/new": "Create Order",
};

const Sidebar = () => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: "⬡", end: true },
    { to: "/products", label: "Products", icon: "📦" },
    { to: "/customers", label: "Customers", icon: "👥" },
    { to: "/orders", label: "Orders", icon: "📋" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⬡</div>
        <div>
          <div className="sidebar-logo-text">InvenFlow</div>
          <div className="sidebar-logo-sub">Operations OS</div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Navigation</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-badge">
          <div className="sidebar-badge-dot" />
          <span className="sidebar-badge-text">All systems online</span>
        </div>
      </div>
    </aside>
  );
};

const Header = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "InvenFlow";
  return (
    <header className="top-header">
      <div className="header-breadcrumb">
        <span>InvenFlow</span>
        <span style={{ color: "var(--text-muted)" }}>›</span>
        <strong>{title}</strong>
      </div>
      <div className="header-actions">
        <div className="header-avatar">AK</div>
      </div>
    </header>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-wrapper">
          <Header />
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
        </div>
        <Toast />
      </div>
    </Router>
  );
};

export default App;
