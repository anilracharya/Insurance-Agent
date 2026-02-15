# Insurance AI Sales Agent – Full Build Prompt (Claude Code)

You are a **senior full-stack engineer**. Build a **production-ready Spring Boot application** that helps **insurance agents** manage leads, products, schedules, and run an **AI voice calling bot** that qualifies prospects, recommends suitable insurance products, and generates + emails a personalized prospectus.

---

## 0. Core Goals

### Agent-facing
1. Manage assigned leads (CRUD, status, notes, next action)
2. Manage insurance products and their details
3. Manage calendar & preferred calling time slots
4. AI voice bot initiates outbound calls and understands prospect needs
5. AI recommends suitable insurance product(s)
6. Capture email and send a personalized prospectus

### Admin
1. Add/edit all product information
2. Create product categories and manage documents category-wise
3. Admin UI for model selection and API key management
4. DB configurations must be configurable via environment variables

---

## 1. Architecture Overview

Spring Boot + Spring AI, PostgreSQL + pgvector, OpenAI Realtime API for voice, OpenAI APIs for text.

(See full spec in this document.)

---

## Acceptance Criteria

- Agent can manage leads and products
- AI voice bot calls prospects and extracts needs
- System recommends products via vector search
- Prospectus PDF generated and emailed
- Admin manages models, keys, and indexing
- Entire system runs via docker-compose

---

Start by generating the repository skeleton and backend services.
