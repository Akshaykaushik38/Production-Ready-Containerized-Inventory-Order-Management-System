# 📦 Production-Ready Containerized Inventory & Order Management System

A full-stack **Inventory & Order Management System** built for businesses to manage products, customers, orders, and inventory tracking — fully containerized with Docker and deployed on free hosting platforms.

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | https://frontend-phi-drab-26.vercel.app |
| **Backend API (Render)** | _Deploying..._ |
| **API Documentation** | _Deploying..._ `/docs` |
| **Docker Hub Image** | https://hub.docker.com/r/akshaykaushik38/inventory-order-backend |

---

## 🚀 Features

### Product Management
- Create, read, update, and delete products
- Unique SKU validation
- Real-time stock tracking
- Price management with decimal precision

### Customer Management
- Create and manage customer profiles
- Unique email validation
- Phone number tracking

### Order Management
- Create orders with multiple product line items
- Automatic stock deduction on order creation
- Automatic stock restoration on order deletion
- Server-side total amount calculation
- Insufficient stock prevention

### Dashboard
- Total products, customers, and orders overview
- Low stock alerts (< 10 units)
- Real-time statistics

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.12, FastAPI, SQLAlchemy, Pydantic |
| **Frontend** | React 18, Vite, React Router v6 |
| **Database** | PostgreSQL 15 |
| **Containerization** | Docker (multi-stage builds) |
| **Orchestration** | Docker Compose |
| **Backend Deployment** | Render |
| **Frontend Deployment** | Vercel |

---

## 📁 Project Structure

```
├── backend/
│   ├── Dockerfile            # Multi-stage production Dockerfile
│   ├── .dockerignore
│   ├── requirements.txt
│   ├── main.py               # FastAPI application & route definitions
│   ├── config.py             # Environment-based configuration
│   ├── database.py           # SQLAlchemy engine & session
│   ├── models.py             # Database models (Product, Customer, Order, OrderItem)
│   ├── schemas.py            # Pydantic request/response schemas with validation
│   └── crud.py               # Business logic & database operations
├── frontend/
│   ├── Dockerfile            # Multi-stage build (Node → Nginx)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx           # Router & navigation
│       ├── api.js            # API client (Axios)
│       ├── index.css         # Global styles
│       ├── main.jsx          # Entry point
│       ├── components/       # Reusable components (Table, Modal, Toast)
│       └── pages/            # Page components (Dashboard, Products, Customers, Orders)
├── docker-compose.yml        # 3-service orchestration
├── .env                      # Environment variables (not committed in production)
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/products` | Create a new product |
| `GET` | `/products` | Retrieve all products |
| `GET` | `/products/{id}` | Retrieve product by ID |
| `PUT` | `/products/{id}` | Update product details |
| `DELETE` | `/products/{id}` | Delete a product |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/customers` | Create a new customer |
| `GET` | `/customers` | Retrieve all customers |
| `GET` | `/customers/{id}` | Retrieve customer by ID |
| `DELETE` | `/customers/{id}` | Delete a customer |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Create a new order |
| `GET` | `/orders` | Retrieve all orders |
| `GET` | `/orders/{id}` | Retrieve order details |
| `DELETE` | `/orders/{id}` | Cancel/delete an order |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard/stats` | Dashboard summary statistics |

---

## ⚙️ Business Logic

- **Unique SKU**: Product SKU codes must be unique across the system
- **Unique Email**: Customer email addresses must be unique
- **Non-negative Stock**: Product quantity cannot be set below zero
- **Stock Validation**: Orders are rejected if requested quantity exceeds available stock
- **Auto Stock Deduction**: Creating an order automatically reduces product stock
- **Auto Stock Restoration**: Deleting an order automatically restores product stock
- **Server-Side Calculation**: Order total amounts are calculated automatically by the backend
- **Referential Integrity**: Products referenced in orders cannot be deleted

---

## 🐳 Running with Docker Compose

### Prerequisites
- Docker & Docker Compose installed

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Akshaykaushik38/Production-Ready-Containerized-Inventory-Order-Management-System.git
cd Production-Ready-Containerized-Inventory-Order-Management-System

# Create .env file
cat > .env << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=inventory_db
POSTGRES_PORT=5432
EOF

# Build and start all services
docker compose up --build -d

# Check status
docker compose ps
```

### Access the Application

| Service | URL |
|---------|-----|
| Frontend (React) | http://localhost |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

### Stop Services

```bash
docker compose down          # Stop containers
docker compose down -v       # Stop & remove volumes (resets database)
```

---

## 🐳 Docker Details

### Backend Dockerfile
- **Multi-stage build**: Builder stage compiles dependencies, production stage runs slim image
- **Base image**: `python:3.12-slim` (lightweight)
- **Exposed port**: 8000

### Frontend Dockerfile
- **Multi-stage build**: Node builds static assets, Nginx serves them
- **Base images**: `node:20-alpine` (build) → `nginx:alpine` (serve)
- **Exposed port**: 80

### Docker Compose Services
- **db**: PostgreSQL 15 with health checks and named volume persistence
- **backend**: FastAPI with environment-based configuration
- **frontend**: Nginx serving the React production build

---

## 👤 Author

**Akshay Kaushik**
- GitHub: [@Akshaykaushik38](https://github.com/Akshaykaushik38)

---

## 📄 License

This project is built as a technical assessment submission.
