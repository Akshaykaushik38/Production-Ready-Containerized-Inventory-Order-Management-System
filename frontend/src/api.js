// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" }
});

export const fetchDashboardStats = () => api.get("/dashboard/stats");
export const fetchProducts = () => api.get("/products");
export const fetchProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const fetchCustomers = () => api.get("/customers");
export const createCustomer = (data) => api.post("/customers", data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

export const fetchOrders = () => api.get("/orders");
export const fetchOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post("/orders", data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export default api;
