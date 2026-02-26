# ⚡ AdMatrix AI — Distributed Marketing Infrastructure

> Multi-tenant, event-driven AI advertising platform built as a modular monolith.

---

## 📁 Project Structure

```
admatrix-ai/
├── apps/
│   ├── frontend/              # Next.js 14 — App Router
│   │   └── src/
│   │       ├── app/           # Pages (dashboard, campaigns, creatives, queue, logs)
│   │       ├── components/    # UI, layout, campaign, creative, ai components
│   │       ├── hooks/         # useDashboard, useCampaigns, useQueue
│   │       ├── lib/           # API client (axios + SWR)
│   │       ├── store/         # Zustand auth store
│   │       └── types/         # Frontend-specific types
│   │
│   ├── api/                   # NestJS — REST API
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/          # JWT auth, RBAC, strategies
│   │       │   ├── campaign/      # DDD aggregate (entity, service, repo, events)
│   │       │   ├── creative/      # Creative management
│   │       │   ├── metrics/       # Performance metrics
│   │       │   ├── optimization/  # AI optimization triggers
│   │       │   ├── organization/  # Multi-tenant orgs
│   │       │   ├── user/          # User management
│   │       │   └── webhook/       # Meta/Google/TikTok ingestion
│   │       ├── common/
│   │       │   ├── decorators/    # @CurrentUser, @OrgId
│   │       │   ├── filters/       # Global exception filter
│   │       │   ├── guards/        # JwtAuthGuard
│   │       │   ├── interceptors/  # Transform, Logging
│   │       │   └── middleware/    # TenantMiddleware
│   │       ├── config/            # RedisModule
│   │       └── database/prisma/   # PrismaService + Schema
│   │
│   └── worker/                # NestJS — Async Worker Process
│       └── src/
│           ├── processors/
│           │   ├── metrics/       # Metrics ingestion + normalization
│           │   ├── campaign/      # Campaign lifecycle (start, pause, sync)
│           │   ├── optimization/  # AI scoring + action execution
│           │   └── creative/      # AI creative generation + scoring
│           └── worker.module.ts
│
└── packages/
    ├── shared-types/          # All TypeScript types/enums/DTOs shared across apps
    ├── ai-engine/             # AI scoring engine + anomaly detection
    │   └── src/
    │       ├── scoring/       # CampaignScoringEngine
    │       └── anomaly/       # AnomalyDetector
    ├── integrations/          # Platform API adapters
    │   └── src/
    │       ├── meta/          # Meta Marketing API
    │       ├── google/        # Google Ads API
    │       └── tiktok/        # TikTok Ads API
    └── core/                  # Shared entities, events, base repositories
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- Docker (for PostgreSQL + Redis)

### 1. Install dependencies
```bash
pnpm install
```

### 2. Start infrastructure
```bash
docker-compose up -d
# Starts: PostgreSQL (5432), Redis (6379), Redis Commander (8081)
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your DB credentials, JWT secret, etc.
```

### 4. Database setup
```bash
pnpm db:generate   # Generate Prisma client
pnpm db:migrate    # Run migrations
pnpm db:studio     # Open Prisma Studio (optional)
```

### 5. Run all apps
```bash
pnpm dev
# Starts:
#   Frontend  → http://localhost:3000
#   API       → http://localhost:3001
#   Worker    → http://localhost:3002
#   API Docs  → http://localhost:3001/api/docs
```

### Run individually
```bash
cd apps/frontend && pnpm dev
cd apps/api      && pnpm dev
cd apps/worker   && pnpm dev
```

---

## 🏗 Architecture

### Event-Driven Flow
```
User Action (API)
    ↓
Campaign Service
    ↓ emits event (EventEmitter2)
Campaign Events Listener
    ↓ adds job
BullMQ Queue (Redis)
    ↓
Worker Process (apps/worker)
    ↓
Platform API (Meta/Google/TikTok)
```

### Metrics Ingestion Pipeline
```
Platform Webhook → POST /webhooks/meta|google|tiktok
    ↓ push to queue
metrics Queue (Redis)
    ↓
MetricsProcessor (Worker)
    ↓ normalize payload
campaign_metrics table (Postgres)
    ↓ check thresholds
OptimizationProcessor (if triggered)
    ↓
AI Scoring → Action Execution → optimization_logs
```

### Multi-Tenant Isolation
```
Every request:
  JWT → TenantMiddleware → req.tenant.organizationId
  CampaignRepository.findAll(organizationId) → auto-filtered
  No route manually queries orgId
```

---

## 🔑 Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Architecture | Modular Monolith | Start fast, split later |
| ORM | Prisma | Type safety, migrations |
| Queue | BullMQ | Redis-backed, reliable, DLQ |
| Events | NestJS EventEmitter → Redis Pub/Sub | Internal + cross-process |
| State | Zustand | Lightweight, no boilerplate |
| Data fetching | SWR | Auto-revalidation, caching |
| Monorepo | Turborepo + pnpm | Fast builds, workspace packages |

---

## 📡 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/auth/register | Register user + org |
| POST | /api/v1/auth/login | Login, get JWT |
| GET | /api/v1/campaigns | List campaigns (org-scoped) |
| POST | /api/v1/campaigns | Create campaign |
| PATCH | /api/v1/campaigns/:id/start | Start (async queued) |
| PATCH | /api/v1/campaigns/:id/pause | Pause (async queued) |
| GET | /api/v1/campaigns/:id/metrics | Get metrics |
| POST | /api/v1/webhooks/meta | Meta metrics webhook |
| POST | /api/v1/webhooks/google | Google metrics webhook |
| POST | /api/v1/webhooks/tiktok | TikTok metrics webhook |

Full docs: **http://localhost:3001/api/docs**

---

## 🧠 AI Optimization Engine

The `packages/ai-engine` package contains:

### CampaignScoringEngine
- Computes score (0–100) from 7-day rolling metrics
- Analyzes CTR trend, CPA trend, spend velocity, ROAS
- Recommends action: PAUSE_CREATIVE, INCREASE_BUDGET, DUPLICATE_ADSET

### AnomalyDetector
- Detects: SPEND_SPIKE, CTR_DROP, CONVERSION_DROP, ROAS_DROP
- Severity levels: LOW, MEDIUM, HIGH, CRITICAL
- Compares current metrics against 7-day baseline

---

## 🗄 Database Schema

Key tables:
- `organizations` — Tenant root
- `users` + `organization_members` — RBAC
- `campaigns` — Campaign aggregate
- `creatives` — Creative assets
- `campaign_metrics` — Time-series (indexed by campaign_id + timestamp)
- `optimization_logs` — AI action audit trail (your data moat)

---

## 🔧 Environment Variables

See `.env.example` for all required variables.
