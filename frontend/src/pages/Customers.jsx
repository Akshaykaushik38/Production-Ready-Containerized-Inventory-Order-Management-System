import React, { useEffect, useState } from "react";
import api from "../api";
import Toast from "../components/Toast";
import Table from "../components/Table";
import Modal from "../components/Modal";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      Toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await api.delete(`/customers/${id}`);
      Toast.success("Customer deleted");
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      Toast.error(err.response?.data?.detail || "Delete failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Only keep digits and limit to 10 characters
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setForm(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) { 
      Toast.error("All fields (Name, Email, and Phone) are required"); 
      return; 
    }

    // Phone number must be exactly 10 digits
    if (form.phone.length !== 10) {
      Toast.error("Phone number must be exactly 10 digits");
      return;
    }

    // Email address must end with .com
    if (!form.email.toLowerCase().endsWith(".com")) {
      Toast.error("Email address must end with .com");
      return;
    }

    // Ensure customer doesn't already exist (by email or phone)
    const emailExists = customers.some(c => c.email.toLowerCase() === form.email.toLowerCase());
    const phoneExists = customers.some(c => c.phone === form.phone);
    if (emailExists) {
      Toast.error("Customer with this email already exists");
      return;
    }
    if (phoneExists) {
      Toast.error("Customer with this phone number already exists");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/customers", form);
      Toast.success("Customer added successfully");
      setCustomers(prev => [...prev, res.data]);
      setForm({ name: "", email: "", phone: "" });
      setIsModalOpen(false);
    } catch (err) {
      Toast.error(err.response?.data?.detail || "Failed to add customer");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      Header: "ID", accessor: "id",
      Cell: (row) => <span className="badge badge-indigo">#{row.id}</span>,
    },
    {
      Header: "Name", accessor: "name",
      Cell: (row) => <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{row.name}</span>,
    },
    {
      Header: "Email", accessor: "email",
      Cell: (row) => <span style={{ color: "#a5b4fc" }}>{row.email}</span>,
    },
    {
      Header: "Phone", accessor: "phone",
      Cell: (row) => <span style={{ color: "var(--text-secondary)" }}>{row.phone || "—"}</span>,
    },
    {
      Header: "Actions", accessor: "id",
      Cell: (row) => (
        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>
          🗑 Remove
        </button>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{customers.length} registered accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add Customer
        </button>
      </div>

      <Table data={customers} columns={columns} loading={loading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl mb-4" style={{ color: "var(--indigo-light)" }}>👤 Add Customer</h3>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Full Name *
            <input className="input" name="name" value={form.name} onChange={handleInputChange} required placeholder="John Doe" />
          </label>
          <label>
            Email Address *
            <input className="input" type="email" name="email" value={form.email} onChange={handleInputChange} required placeholder="john@example.com" />
          </label>
          <label>
            Phone Number *
            <input className="input" name="phone" value={form.phone} onChange={handleInputChange} required placeholder="+91" />
          </label>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Adding…" : "+ Add Customer"}
            </button>
            <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
