# InsureAgent

> Insurance Agent CRM & Dashboard Platform

A full-stack application for insurance agents to manage leads, products, and appointments — built with **Spring Boot** and **React**.

---

## Features

- **Lead Management** — Track leads through a 7-stage pipeline (New → Contacted → Qualified → Proposal Sent → Negotiation → Won/Lost) with activity notes
- **Product Catalog** — Organize insurance products by category with premium, coverage, and feature details
- **Calendar Scheduling** — Create and manage time slots, mark as booked/available
- **Dashboard** — Real-time stats cards, recent leads, and quick actions
- **Authentication** — JWT-based auth with role support (Agent / Admin)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Java 21, Spring Boot 3.4, Spring Security, Spring Data JPA |
| Database | PostgreSQL with Flyway migrations |
| Auth | JWT (HS256, 24h expiry) |
| API Docs | Swagger UI (SpringDoc OpenAPI) |

## Project Structure

```
├── src/                    # Spring Boot backend
│   └── main/java/com/insuranceagent/
│       ├── auth/           # Authentication (login, register, JWT)
│       ├── lead/           # Lead management + notes
│       ├── product/        # Products, categories, documents
│       ├── calendar/       # Calendar slot scheduling
│       ├── security/       # JWT filter, config
│       └── config/         # App configuration
├── frontend/               # React SPA
│   └── src/
│       ├── api/            # Axios client with JWT interceptor
│       ├── context/        # Auth context provider
│       ├── components/     # Layout, PrivateRoute, UI components
│       ├── pages/          # Dashboard, Leads, Products, Calendar, etc.
│       └── types/          # TypeScript interfaces
└── docs/                   # Documentation
    ├── InsureAgent_Product_Presentation.pptx
    ├── User_Guide.md
    └── Functional_Design_Specification.md
```

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL 15+

### 1. Database Setup

```bash
createdb insurance_agent
```

### 2. Backend

```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run the backend
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`. Swagger UI is available at `http://localhost:8080/swagger-ui.html`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173` and proxies API calls to the backend.

### 4. Use the App

1. Open `http://localhost:5173`
2. Register a new account
3. Start managing leads, products, categories, and calendar slots

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | 8080 | Backend server port |
| `POSTGRES_HOST` | localhost | Database host |
| `POSTGRES_PORT` | 5432 | Database port |
| `POSTGRES_DB` | insurance_agent | Database name |
| `POSTGRES_USER` | postgres | Database user |
| `POSTGRES_PASSWORD` | postgres | Database password |
| `JWT_SECRET` | (base64 key) | JWT signing secret |
| `JWT_EXPIRATION_MS` | 86400000 | Token expiry (24h) |

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /api/v1/auth/register`, `POST /api/v1/auth/login` |
| Leads | `GET/POST /api/v1/leads`, `GET/PUT/DELETE /api/v1/leads/{id}`, `GET /api/v1/leads/status/{status}` |
| Lead Notes | `POST/GET /api/v1/leads/{id}/notes` |
| Products | `GET/POST /api/v1/products`, `GET/PUT/DELETE /api/v1/products/{id}` |
| Categories | `GET/POST /api/v1/product-categories`, `GET/PUT/DELETE /api/v1/product-categories/{id}` |
| Calendar | `GET/POST /api/v1/calendar/slots`, `GET/PUT/DELETE /api/v1/calendar/slots/{id}`, `GET /api/v1/calendar/slots/available` |

## Documentation

- [Product Presentation](docs/InsureAgent_Product_Presentation.pptx) — 10-slide overview deck
- [User Guide](docs/User_Guide.md) — Step-by-step usage instructions
- [Functional Design Spec](docs/Functional_Design_Specification.md) — Architecture, data models, API contracts

## License

This project is private and proprietary.