# InsureAgent - User Guide

**Version:** 1.0
**Date:** February 2026

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Login & Registration](#2-login--registration)
3. [Dashboard](#3-dashboard)
4. [Lead Management](#4-lead-management)
5. [Product Management](#5-product-management)
6. [Category Management](#6-category-management)
7. [Calendar & Scheduling](#7-calendar--scheduling)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Getting Started

### Prerequisites

- **Backend:** Java 21, PostgreSQL database running on `localhost:5432`
- **Frontend:** Node.js 18+

### Starting the Application

**Step 1 — Start the backend:**

```bash
# From the project root directory
./mvnw spring-boot:run
```

The backend API starts on `http://localhost:8080`. You can verify it's running by visiting `http://localhost:8080/swagger-ui.html`.

**Step 2 — Start the frontend:**

```bash
cd frontend
npm install    # First time only
npm run dev
```

The frontend starts on `http://localhost:5173`.

**Step 3 — Open the application:**

Open your browser and navigate to `http://localhost:5173`. You'll see the login page.

---

## 2. Login & Registration

### Creating a New Account

1. On the login page, click **"Register"**
2. Fill in the registration form:
   - **Full Name** — Your display name (optional)
   - **Username** — Unique username (3-50 characters)
   - **Email** — Valid email address
   - **Password** — Minimum 8 characters
3. Click **"Create account"**
4. You'll be automatically logged in and redirected to the Dashboard

### Logging In

1. Enter your **Username** and **Password**
2. Click **"Sign in"**
3. On success, you're redirected to the Dashboard

### Logging Out

Click the **"Logout"** button in the top-right corner of any page.

> **Note:** Your session (JWT token) expires after 24 hours. You'll be automatically redirected to login when this happens.

---

## 3. Dashboard

The Dashboard is your home page, providing a quick overview of your CRM data.

### Stats Cards

Five metric cards are displayed at the top:

| Card | Description |
|------|-------------|
| **Total Leads** | Total number of leads in the system |
| **New Leads** | Leads with status "NEW" |
| **Won Leads** | Leads with status "WON" |
| **Products** | Total number of insurance products |
| **Available Slots** | Unbooked calendar slots |

### Quick Actions

- **"+ New Lead"** — Opens the Leads page to create a new lead
- **"+ New Product"** — Opens the Products page to create a new product

### Recent Leads

A table showing the 5 most recently created leads with:
- Name (clickable link to lead detail)
- Email
- Status (color-coded badge)
- Source

---

## 4. Lead Management

### Viewing All Leads

Navigate to **Leads** in the sidebar. You'll see a table with all your leads.

### Filtering by Status

Use the status filter buttons above the table:
- **All** — Show all leads
- **NEW** — Newly created leads
- **CONTACTED** — Leads you've reached out to
- **QUALIFIED** — Leads confirmed as potential clients
- **PROPOSAL SENT** — Leads who received a proposal
- **NEGOTIATION** — Leads in active negotiation
- **WON** — Successfully converted leads
- **LOST** — Leads that didn't convert

### Creating a Lead

1. Click the **"+ Add Lead"** button
2. Fill in the form:
   - **First Name** (required)
   - **Last Name** (required)
   - **Email** (required)
   - **Phone** (optional)
   - **Source** — How the lead found you (e.g., "Website", "Referral")
   - **Assigned Agent** — Agent handling the lead
   - **Notes** — Any initial notes
3. Click **"Save"**

### Editing a Lead

1. Click the **pencil icon** on a lead's row
2. Modify any fields, including **Status** (only available when editing)
3. Click **"Save"**

### Deleting a Lead

1. Click the **trash icon** on a lead's row
2. Confirm the deletion in the dialog

### Viewing Lead Details

Click a lead's **name** to open the detail page. Here you can see:

- Full contact information
- Current status badge
- Creation and last update timestamps
- General notes

### Adding Activity Notes

On the lead detail page:

1. Type your note in the input field at the bottom
2. Click **"Send"**
3. The note appears in the activity timeline with your username and timestamp

> **Tip:** Use activity notes to log calls, emails, meetings, and follow-ups to maintain a complete history.

---

## 5. Product Management

### Viewing Products

Navigate to **Products** in the sidebar. Products are displayed as cards showing:
- Product name
- Category
- Description
- Premium range
- Coverage amount
- Active/Inactive status

### Creating a Product

1. Click **"+ Add Product"**
2. Fill in the form:
   - **Name** (required)
   - **Category** (required — select from dropdown)
   - **Description** (optional)
   - **Premium Range** (e.g., "$100-500/month")
   - **Coverage Amount** (e.g., "$1,000,000")
   - **Features** (optional — key selling points)
3. Click **"Save"**

> **Note:** You must create at least one category before creating products. See [Category Management](#6-category-management).

### Editing a Product

1. Click the **pencil icon** on a product card
2. Modify fields as needed
3. Toggle **Active** checkbox to enable/disable the product
4. Click **"Save"**

### Toggling Active/Inactive

Click the **"Active"** or **"Inactive"** badge on a product card to toggle its status directly.

### Deleting a Product

Click the **trash icon** on a product card and confirm the deletion.

---

## 6. Category Management

Categories organize your insurance products (e.g., "Life Insurance", "Health Insurance", "Auto Insurance").

### Viewing Categories

Navigate to **Categories** in the sidebar. Categories appear as cards.

### Creating a Category

1. Click **"+ Add Category"**
2. Enter:
   - **Name** (required)
   - **Description** (optional)
3. Click **"Save"**

### Editing a Category

Click the **pencil icon** on a category card, modify fields, and save.

### Deleting a Category

Click the **trash icon** on a category card and confirm.

> **Warning:** Deleting a category may affect products assigned to it. Reassign products first.

---

## 7. Calendar & Scheduling

### Viewing Calendar Slots

Navigate to **Calendar** in the sidebar. Slots are displayed as a list showing:
- Title
- Date and time range
- Booked/Available status
- Notes

### Filtering Slots

- **All Slots** — Show all calendar slots
- **Available Only** — Show only unbooked slots

### Creating a Slot

1. Click **"+ New Slot"**
2. Fill in:
   - **Title** (e.g., "Client Consultation", "Follow-up Meeting")
   - **Agent ID** — Pre-filled with your user ID
   - **Start Time** — Date and time picker
   - **End Time** — Date and time picker
   - **Notes** (optional)
3. Click **"Create Slot"**

### Booking / Unbooking a Slot

Click the **"Available"** or **"Booked"** badge on a slot to toggle its booking status.

- Green "Available" = open for appointments
- Red "Booked" = appointment confirmed

### Deleting a Slot

Click the **trash icon** on a slot and confirm the deletion.

---

## 8. Troubleshooting

### "Login failed" error

- Verify your username and password are correct
- Ensure the backend server is running on port 8080
- Check that the database is accessible

### Page shows spinner indefinitely

- The backend may be down — check `http://localhost:8080/actuator/health`
- Open browser DevTools (F12) > Network tab to see failing API requests

### "401 Unauthorized" redirect to login

- Your session has expired (24-hour limit)
- Log in again to get a fresh token

### Cannot create products — category dropdown is empty

- Create at least one category first via the **Categories** page

### Frontend won't start

```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Backend won't start

- Verify PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Check database credentials in `.env` or `application.yml`
- Ensure Java 21 is installed: `java -version`

---

**Need help?** Contact the development team or check the API documentation at `http://localhost:8080/swagger-ui.html`.
