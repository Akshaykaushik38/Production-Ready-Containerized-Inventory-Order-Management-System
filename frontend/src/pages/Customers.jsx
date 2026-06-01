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

  useEffect(() => {
    fetchCustomers();
  }, []);

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
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      Toast.error("Name and Email are required");
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
    { Header: "Customer ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    {
      Header: "Actions",
      accessor: "id",
      Cell: (row) => (
        <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl" style={{ color: "var(--primary)" }}>Customers</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          Add Customer
        </button>
      </div>

      <Table data={customers} columns={columns} loading={loading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div style={{ minWidth: "320px", padding: "0.5rem" }}>
          <h3 className="text-xl mb-4" style={{ color: "var(--primary)" }}>Add Customer</h3>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Full Name *
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
              />
            </label>
            <label>
              Email Address *
              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
              />
            </label>
            <label>
              Phone Number
              <input
                className="input"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="+1 234-567-8900"
              />
            </label>
            <div className="flex gap-2" style={{ marginTop: "1.5rem" }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Adding..." : "Add Customer"}
              </button>
              <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Customers;
