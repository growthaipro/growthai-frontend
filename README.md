# ⚡ AdMatrix AI
### Distributed Multi-Tenant AI Marketing Infrastructure

AdMatrix AI is an event-driven advertising platform that automates campaign management, optimization, and anomaly detection across Meta, Google, and TikTok.

Built as a **modular monolith** with strict domain boundaries, designed to scale into distributed microservices when required.

---

## 🧩 Repository Structure

```
admatrix-ai/
├── apps/
│   ├── frontend/        # Next.js 14 (App Router)
│   ├── api/             # NestJS REST API
│   └── worker/          # Async background processors
│
└── packages/
    ├── shared-types/    # DTOs, enums, shared interfaces
    ├── ai-engine/       # Scoring engine + anomaly detection
    ├── integrations/    # Meta / Google / TikTok adapters
    └── core/            # Domain entities & base repositories
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker (PostgreSQL + Redis)

---

### 1. Install Dependencies

```bash
pnpm install
```

---

### 2. Start Infrastructure

```bash
docker-compose up -d
```

This starts:

- PostgreSQL → localhost:5432  
- Redis → localhost:6379  
- Redis Commander → localhost:8081  

---

### 3. Configure Environment

```bash
cp .env.example .env
```

Update:

- DATABASE_URL  
- JWT_SECRET  
- REDIS_HOST  
- Platform API credentials  

---

### 4. Setup Database

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

---

### 5. Run All Services

```bash
pnpm dev
```

Services:

- Frontend → http://localhost:3000  
- API → http://localhost:3001  
- Worker → http://localhost:3002  
- API Docs → http://localhost:3001/api/docs  

---

## 🏗 Architecture Overview

### Event-Driven Campaign Lifecycle

```
Client Request
    ↓
API (NestJS)
    ↓ emits domain event
Event Listener
    ↓
BullMQ Queue (Redis)
    ↓
Worker Processor
    ↓
Platform Integration (Meta / Google / TikTok)
```

---

### Metrics Ingestion Pipeline

```
Platform Webhook
    ↓
Webhook Controller
    ↓
Redis Queue
    ↓
Metrics Processor
    ↓
PostgreSQL (campaign_metrics)
    ↓
Optimization Engine
    ↓
AI Action Execution
    ↓
optimization_logs
```

---

## 🧠 AI Optimization Engine

Located in `packages/ai-engine`.

### Campaign Scoring Engine

Evaluates rolling 7-day performance:

- CTR trend
- CPA trend
- ROAS movement
- Spend velocity
- Conversion rate change

Outputs:

- Score (0–100)
- Recommended action:
  - INCREASE_BUDGET
  - PAUSE_CREATIVE
  - DUPLICATE_ADSET

---

### Anomaly Detector

Detects:

- Spend spikes  
- CTR drops  
- Conversion drops  
- ROAS deterioration  

Severity Levels:

- LOW  
- MEDIUM  
- HIGH  
- CRITICAL  

Uses rolling baseline comparison for deviation detection.

---

## 🏢 Multi-Tenant Isolation

Every request is automatically scoped by organization:

```
JWT → Tenant Middleware → organizationId
Repositories auto-filter by organizationId
```

No controller manually filters tenant data.  
Isolation is enforced at repository level.

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/v1/auth/register | Create user & organization |
| POST | /api/v1/auth/login | Authenticate & receive JWT |
| GET | /api/v1/campaigns | List campaigns |
| POST | /api/v1/campaigns | Create campaign |
| PATCH | /api/v1/campaigns/:id/start | Start campaign (async) |
| PATCH | /api/v1/campaigns/:id/pause | Pause campaign (async) |
| GET | /api/v1/campaigns/:id/metrics | Retrieve metrics |
| POST | /api/v1/webhooks/meta | Meta webhook |
| POST | /api/v1/webhooks/google | Google webhook |
| POST | /api/v1/webhooks/tiktok | TikTok webhook |

Full API documentation:

```
http://localhost:3001/api/docs
```

---

## 🗄 Core Database Tables

- organizations  
- users  
- organization_members  
- campaigns  
- creatives  
- campaign_metrics  
- optimization_logs  

`optimization_logs` serves as the AI audit trail and long-term data moat.

---

## 🔧 Technical Decisions

| Category | Choice | Reason |
|----------|--------|--------|
| Architecture | Modular Monolith | Faster iteration, future split ready |
| ORM | Prisma | Type safety + migrations |
| Queue | BullMQ | Reliable Redis-backed jobs |
| Events | NestJS EventEmitter + Redis | Internal + cross-process events |
| State Management | Zustand | Lightweight and scalable |
| Data Fetching | SWR | Auto revalidation & caching |
| Monorepo | Turborepo + pnpm | Fast builds & shared packages |

---

## 🔐 Environment Variables

Refer to `.env.example` for full configuration reference.

---

## 🛣 Roadmap

- Budget auto-reallocation engine  
- Predictive LTV modeling  
- Cross-platform attribution  
- Reinforcement learning bid optimization  
- Microservice extraction for horizontal scaling  

---

## 📌 Vision

AdMatrix AI is evolving into a fully autonomous marketing operating system where campaign decisions become explainable, self-optimizing, and continuously improving.

---
