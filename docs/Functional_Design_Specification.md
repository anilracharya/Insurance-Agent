# InsureAgent — Functional Design Specification

**Version:** 1.0
**Date:** February 2026
**Status:** Implemented (Phase 1 & 2 Complete)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Module Specifications](#4-module-specifications)
   - 4.1 [Authentication Module](#41-authentication-module)
   - 4.2 [Lead Management Module](#42-lead-management-module)
   - 4.3 [Product Management Module](#43-product-management-module)
   - 4.4 [Product Category Module](#44-product-category-module)
   - 4.5 [Calendar & Scheduling Module](#45-calendar--scheduling-module)
   - 4.6 [Dashboard Module](#46-dashboard-module)
5. [Data Model](#5-data-model)
6. [API Specification](#6-api-specification)
7. [Security Design](#7-security-design)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Glossary](#10-glossary)

---

## 1. Introduction

### 1.1 Purpose

This document defines the functional design of **InsureAgent**, an insurance agent CRM and dashboard platform. It describes the system's modules, data models, API contracts, security architecture, and frontend design.

### 1.2 Scope

InsureAgent provides insurance agents with tools to:
- Manage leads through a complete sales pipeline
- Maintain an organized product catalog with categories
- Schedule and manage calendar appointments
- View business metrics on a central dashboard

### 1.3 Audience

- Development team
- QA/testing team
- Product stakeholders
- Technical architects

---

## 2. System Overview

### 2.1 Architecture

InsureAgent follows a **client-server architecture** with clear separation:

```
┌─────────────────┐     REST/JSON      ┌─────────────────┐      JDBC       ┌──────────────┐
│   React SPA     │ ◄───────────────► │  Spring Boot    │ ◄────────────► │  PostgreSQL  │
│   (Frontend)    │    /api/v1/*       │  (Backend API)  │                 │  (Database)  │
│   Port: 5173    │                    │  Port: 8080     │                 │  Port: 5432  │
└─────────────────┘                    └─────────────────┘                 └──────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | 18.3 |
| Build Tool | Vite | 6.x |
| Styling | Tailwind CSS | 3.4 |
| Routing | React Router | 6.28 |
| HTTP Client | Axios | 1.7 |
| Backend | Spring Boot | 3.4.1 |
| Language | Java | 21 |
| Security | Spring Security + JWT | 6.x |
| ORM | Spring Data JPA / Hibernate | 6.x |
| Database | PostgreSQL | 15+ |
| Migrations | Flyway | 10.x |
| API Docs | SpringDoc OpenAPI (Swagger) | 2.x |

---

## 3. User Roles & Permissions

### 3.1 Roles

| Role | Description |
|------|-------------|
| **AGENT** | Standard insurance agent. Can manage leads, products, categories, and calendar slots. Default role on registration. |
| **ADMIN** | Administrator with full access including admin-only endpoints under `/api/v1/admin/**`. |

### 3.2 Permission Matrix

| Resource | AGENT | ADMIN |
|----------|-------|-------|
| Register / Login | Yes | Yes |
| Leads CRUD | Yes | Yes |
| Lead Notes | Yes | Yes |
| Products CRUD | Yes | Yes |
| Categories CRUD | Yes | Yes |
| Calendar Slots CRUD | Yes | Yes |
| Admin endpoints | No | Yes |

---

## 4. Module Specifications

### 4.1 Authentication Module

#### 4.1.1 Registration

**Actors:** Unauthenticated user

**Flow:**
1. User submits registration form (username, password, email, fullName)
2. System validates:
   - Username is unique (3-50 characters)
   - Password meets minimum length (8 characters)
   - Email is valid format
3. System creates user with BCrypt-hashed password
4. System generates JWT token
5. System returns token + user metadata

**Validation Rules:**
| Field | Rule |
|-------|------|
| username | Required, 3-50 chars, unique |
| password | Required, 8-100 chars |
| email | Required, valid email format |
| fullName | Optional |

#### 4.1.2 Login

**Actors:** Registered user

**Flow:**
1. User submits username + password
2. System authenticates via Spring Security
3. On success: returns JWT token + user metadata
4. On failure: returns error message

#### 4.1.3 Token Management

- Token stored in browser `localStorage`
- Axios interceptor attaches `Authorization: Bearer {token}` to every request
- On HTTP 401 response: token cleared, user redirected to login

---

### 4.2 Lead Management Module

#### 4.2.1 Lead Entity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Auto | Unique identifier |
| firstName | String | Yes | Lead's first name |
| lastName | String | Yes | Lead's last name |
| email | String | Yes | Valid email address |
| phone | String | No | Phone number |
| status | Enum | Auto | Pipeline stage (default: NEW) |
| source | String | No | Lead acquisition source |
| assignedAgent | String | No | Agent handling the lead |
| notes | String | No | General notes field |
| createdAt | DateTime | Auto | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

#### 4.2.2 Lead Status Pipeline

```
NEW → CONTACTED → QUALIFIED → PROPOSAL_SENT → NEGOTIATION → WON
                                                            → LOST
```

| Status | Description | UI Badge Color |
|--------|-------------|----------------|
| NEW | Freshly created lead | Blue |
| CONTACTED | Initial contact made | Yellow |
| QUALIFIED | Confirmed as viable prospect | Purple |
| PROPOSAL_SENT | Insurance proposal delivered | Indigo |
| NEGOTIATION | Terms being discussed | Orange |
| WON | Successfully converted to client | Green |
| LOST | Lead did not convert | Red |

#### 4.2.3 Lead Operations

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| List all | GET | /api/v1/leads | Returns all leads |
| Get by ID | GET | /api/v1/leads/{id} | Returns single lead |
| Create | POST | /api/v1/leads | Creates new lead (status=NEW) |
| Update | PUT | /api/v1/leads/{id} | Updates lead fields including status |
| Delete | DELETE | /api/v1/leads/{id} | Removes lead |
| Filter by status | GET | /api/v1/leads/status/{status} | Returns leads with given status |

#### 4.2.4 Lead Notes

Each lead can have multiple timestamped activity notes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Auto | Unique identifier |
| leadId | UUID | Auto | Parent lead reference |
| content | String | Yes | Note text |
| author | String | No | Who wrote the note |
| createdAt | DateTime | Auto | Creation timestamp |

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Add note | POST | /api/v1/leads/{id}/notes |
| List notes | GET | /api/v1/leads/{id}/notes |

---

### 4.3 Product Management Module

#### 4.3.1 Product Entity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Auto | Unique identifier |
| name | String | Yes | Product name |
| description | String | No | Product description |
| categoryId | UUID | Yes | FK to ProductCategory |
| categoryName | String | Auto | Denormalized category name |
| premiumRange | String | No | e.g., "$100-500/month" |
| coverageAmount | String | No | e.g., "$1,000,000" |
| features | String | No | Product features text |
| active | Boolean | Auto | Active status (default: true) |
| createdAt | DateTime | Auto | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

#### 4.3.2 Product Operations

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| List all | GET | /api/v1/products | Returns all products |
| Get by ID | GET | /api/v1/products/{id} | Returns single product |
| Create | POST | /api/v1/products | Creates product (active=true) |
| Update | PUT | /api/v1/products/{id} | Updates product fields |
| Delete | DELETE | /api/v1/products/{id} | Removes product |
| By category | GET | /api/v1/products/category/{catId} | Filter by category |

#### 4.3.3 Product Documents

Products can have attached documents (metadata only, no file upload).

| Field | Type | Required |
|-------|------|----------|
| id | UUID | Auto |
| productId | UUID | Auto |
| fileName | String | Yes |
| fileUrl | String | Yes |
| documentType | String | No |
| createdAt | DateTime | Auto |

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Add document | POST | /api/v1/products/{id}/documents |
| List documents | GET | /api/v1/products/{id}/documents |

---

### 4.4 Product Category Module

#### 4.4.1 Category Entity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Auto | Unique identifier |
| name | String | Yes | Category name |
| description | String | No | Category description |
| createdAt | DateTime | Auto | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

#### 4.4.2 Category Operations

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List all | GET | /api/v1/product-categories |
| Get by ID | GET | /api/v1/product-categories/{id} |
| Create | POST | /api/v1/product-categories |
| Update | PUT | /api/v1/product-categories/{id} |
| Delete | DELETE | /api/v1/product-categories/{id} |

---

### 4.5 Calendar & Scheduling Module

#### 4.5.1 Calendar Slot Entity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Auto | Unique identifier |
| agentId | String | Yes | Agent who owns the slot |
| startTime | DateTime | Yes | Slot start time |
| endTime | DateTime | Yes | Slot end time |
| booked | Boolean | Auto | Booking status (default: false) |
| leadId | UUID | No | Linked lead (when booked) |
| title | String | No | Slot title/description |
| notes | String | No | Additional notes |
| createdAt | DateTime | Auto | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

#### 4.5.2 Calendar Operations

| Operation | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| List all | GET | /api/v1/calendar/slots | All slots |
| Get by ID | GET | /api/v1/calendar/slots/{id} | Single slot |
| Create | POST | /api/v1/calendar/slots | New slot (booked=false) |
| Update | PUT | /api/v1/calendar/slots/{id} | Update slot fields |
| Delete | DELETE | /api/v1/calendar/slots/{id} | Remove slot |
| Available | GET | /api/v1/calendar/slots/available | Unbooked slots only |

---

### 4.6 Dashboard Module

The dashboard is a **frontend-only** module that aggregates data from other API endpoints.

#### 4.6.1 Data Sources

| Metric | Source API | Calculation |
|--------|-----------|-------------|
| Total Leads | GET /leads | Array length |
| New Leads | GET /leads | Filter status=NEW, count |
| Won Leads | GET /leads | Filter status=WON, count |
| Total Products | GET /products | Array length |
| Available Slots | GET /calendar/slots | Filter booked=false, count |

#### 4.6.2 Dashboard Components

1. **Stats Cards** — Five metric cards (see above)
2. **Quick Actions** — Buttons linking to create lead / create product
3. **Recent Leads Table** — Last 5 leads sorted by createdAt descending

---

## 5. Data Model

### 5.1 Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    Users     │       │  ProductCategory  │       │   CalendarSlot   │
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (UUID)    │       │ id (UUID)         │       │ id (UUID)        │
│ username     │       │ name              │       │ agentId          │
│ password     │       │ description       │       │ startTime        │
│ email        │       │ createdAt         │       │ endTime          │
│ fullName     │       │ updatedAt         │       │ booked           │
│ role         │       └────────┬─────────┘       │ leadId (FK?)     │
│ createdAt    │                │ 1               │ title            │
│ updatedAt    │                │                 │ notes            │
└──────────────┘                │ *               │ createdAt        │
                       ┌────────┴─────────┐       │ updatedAt        │
┌──────────────┐       │     Product       │       └──────────────────┘
│     Lead     │       ├──────────────────┤
├──────────────┤       │ id (UUID)         │
│ id (UUID)    │       │ name              │
│ firstName    │       │ description       │
│ lastName     │       │ categoryId (FK)   │
│ email        │       │ premiumRange      │
│ phone        │       │ coverageAmount    │
│ status       │       │ features          │
│ source       │       │ active            │
│ assignedAgent│       │ createdAt         │
│ notes        │       │ updatedAt         │
│ createdAt    │       └────────┬─────────┘
│ updatedAt    │                │ 1
└──────┬───────┘                │ *
       │ 1               ┌─────┴────────────┐
       │ *               │ ProductDocument   │
┌──────┴───────┐         ├──────────────────┤
│   LeadNote   │         │ id (UUID)         │
├──────────────┤         │ productId (FK)    │
│ id (UUID)    │         │ fileName          │
│ leadId (FK)  │         │ fileUrl           │
│ content      │         │ documentType      │
│ author       │         │ createdAt         │
│ createdAt    │         └──────────────────┘
└──────────────┘
```

### 5.2 Key Constraints

- All primary keys are **UUID** (auto-generated)
- `createdAt` is set on insert, immutable
- `updatedAt` is updated on every modification
- `Lead.status` defaults to `NEW`
- `Product.active` defaults to `true`
- `CalendarSlot.booked` defaults to `false`
- `Product.categoryId` is a foreign key to `ProductCategory.id`
- `LeadNote.leadId` is a foreign key to `Lead.id`
- `ProductDocument.productId` is a foreign key to `Product.id`

---

## 6. API Specification

### 6.1 Base URL

```
http://localhost:8080/api/v1
```

### 6.2 Standard Response Format

All API responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-02-16T12:00:00"
}
```

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Whether the operation succeeded |
| message | string | Human-readable message (optional) |
| data | T / T[] | Response payload (optional) |
| timestamp | datetime | Server timestamp |

### 6.3 Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2026-02-16T12:00:00"
}
```

### 6.4 HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Successful GET/PUT |
| 201 | Successful POST (resource created) |
| 204 | Successful DELETE (no content) |
| 400 | Validation error |
| 401 | Missing or invalid JWT token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 500 | Internal server error |

### 6.5 Authentication Header

All endpoints except `/auth/*` require:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## 7. Security Design

### 7.1 Authentication Flow

```
Client                          Server
  │                               │
  │  POST /auth/login             │
  │  {username, password}         │
  │──────────────────────────────►│
  │                               │  Validate credentials
  │                               │  Generate JWT (HS256)
  │  {token, userId, role}        │
  │◄──────────────────────────────│
  │                               │
  │  GET /leads                   │
  │  Authorization: Bearer {jwt}  │
  │──────────────────────────────►│
  │                               │  Validate JWT signature
  │                               │  Extract username from subject
  │  {success: true, data: [...]} │  Load user authorities
  │◄──────────────────────────────│
  │                               │
```

### 7.2 JWT Token Details

| Property | Value |
|----------|-------|
| Algorithm | HMAC SHA-256 (HS256) |
| Subject | Username |
| Expiration | 24 hours (configurable) |
| Secret | Base64-encoded key (env: `JWT_SECRET`) |
| Header | `Authorization: Bearer {token}` |

### 7.3 Security Configuration

- **Session Management:** Stateless (no server-side sessions)
- **CSRF:** Disabled (token-based auth)
- **Password Hashing:** BCrypt
- **Public Endpoints:** `/api/v1/auth/**`, `/swagger-ui/**`, `/actuator/health`

### 7.4 Frontend Token Handling

1. On login/register success → store token in `localStorage`
2. Axios request interceptor → attach `Authorization` header
3. Axios response interceptor → on 401, clear token and redirect to `/login`

---

## 8. Frontend Architecture

### 8.1 Component Hierarchy

```
<BrowserRouter>
  <AuthProvider>
    <App>
      ├── /login → <Login />
      ├── /register → <Register />
      └── <PrivateRoute>
            <Layout>  (Sidebar + Topbar + <Outlet>)
              ├── / → <Dashboard />
              ├── /leads → <Leads />
              ├── /leads/:id → <LeadDetail />
              ├── /products → <Products />
              ├── /categories → <Categories />
              └── /calendar → <Calendar />
            </Layout>
          </PrivateRoute>
    </App>
  </AuthProvider>
</BrowserRouter>
```

### 8.2 State Management

- **Auth state:** React Context (`AuthContext`) holding user object and token
- **Page state:** Local `useState` per page component (leads, products, etc.)
- **API calls:** Direct Axios calls within `useEffect` hooks

### 8.3 Key UI Patterns

| Pattern | Implementation |
|---------|----------------|
| Protected routes | `<PrivateRoute>` wrapper checks auth context |
| CRUD modals | Shared `<Modal>` component with form inside |
| Status badges | `<Badge>` component with color mapping per status |
| Loading states | Spinner animation during API calls |
| Responsive layout | Tailwind breakpoints, collapsible sidebar on mobile |
| Confirmation dialogs | Browser `confirm()` for delete operations |

### 8.4 API Proxy

The Vite dev server proxies `/api/**` requests to `http://localhost:8080` to avoid CORS issues during development:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true }
  }
}
```

---

## 9. Non-Functional Requirements

### 9.1 Performance

| Metric | Target |
|--------|--------|
| API response time | < 200ms (P95) |
| Frontend initial load | < 3 seconds |
| Frontend navigation | < 100ms (SPA routing) |
| Database queries | Indexed UUID lookups |

### 9.2 Scalability

- Backend uses Java 21 **virtual threads** for high concurrency
- Stateless JWT auth enables horizontal scaling
- Database supports connection pooling via HikariCP

### 9.3 Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

### 9.4 Accessibility

- Semantic HTML elements
- Form labels for all inputs
- Keyboard-navigable interface
- Color contrast meeting WCAG 2.1 AA

---

## 10. Glossary

| Term | Definition |
|------|------------|
| **Lead** | A potential insurance client being tracked through the sales pipeline |
| **Lead Note** | A timestamped activity entry attached to a lead |
| **Product** | An insurance product offered by the agency |
| **Product Category** | A classification grouping for insurance products |
| **Calendar Slot** | A time block available for scheduling client meetings |
| **JWT** | JSON Web Token — a compact, self-contained token for authentication |
| **SPA** | Single Page Application — the React frontend loads once and handles routing client-side |
| **CRUD** | Create, Read, Update, Delete — the four basic data operations |
| **DTO** | Data Transfer Object — the JSON shape exchanged between frontend and backend |
