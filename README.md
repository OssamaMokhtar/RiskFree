# RiskFree — AI Credit Scoring & Risk Platform for GCC Lending

> Retail and SME credit decisioning with explainable scoring, AML/fraud screening, and an LLM copilot over regulatory policy — designed for Arabic/English markets.

**[Architecture](docs/01-system-architecture.md)** · **[All documentation](#documentation)** · **[Scoring logic](docs/07-scoring-logic.md)**

---

## The problem

Conventional credit scoring in the GCC leaves large segments effectively invisible: expatriate workers with short local credit histories, SMEs whose cash flow lives outside formal reporting, and first-time borrowers with no bureau file at all. Lenders respond by either rejecting them or pricing in blanket risk — losing viable customers and mispricing the ones they keep.

RiskFree is a product architecture for scoring those borrowers using alternative signals (open banking, telecom, utility) while staying explainable enough to defend to a regulator and a rejected applicant.

## What it does

- **Retail and SME credit scoring** — PD and LGD models with explainable factor attribution
- **Fraud detection & AML/sanctions screening** — pre-decision, not post-hoc
- **LLM copilot with RAG** over regulations, credit policy, and customer documents
- **Bilingual AR/EN interface** with a documented tone system for both languages
- **Full audit trail** — every automated decision reconstructable

## Architecture

The platform separates scoring, ingestion, fraud/AML, and LLM services behind an API gateway, with an event bus for async processing and a split OLTP / warehouse / vector data layer.

See **[docs/01-system-architecture.md](docs/01-system-architecture.md)** for the full diagram and component breakdown.

## Documentation

The substance of this project is the product and architecture thinking. Start here:

| Document | What's in it |
|---|---|
| [01 · System architecture](docs/01-system-architecture.md) | Services, message bus, data layer, external integrations |
| [02 · Data model](docs/02-data-model.md) | Core entities and relationships |
| [03 · API endpoints](docs/03-api-endpoints.md) | Service contracts |
| [04 · ML pipeline](docs/04-ml-pipeline.md) | Feature engineering → training → serving |
| [05 · LLM / RAG architecture](docs/05-llm-rag-architecture.md) | Copilot design, embeddings, retrieval strategy |
| [06 · User journeys & wireframes](docs/06-user-journeys-wireframes.md) | Credit officer, SME applicant, risk analyst flows |
| [07 · Scoring logic](docs/07-scoring-logic.md) | How a credit decision is actually reached |
| [08 · Security & deployment](docs/08-security-deployment.md) | Security posture, infrastructure, compliance |
| [09 · UI/UX design system](docs/09-ui-ux-design-system.md) | Components and interaction patterns |
| [10 · Bilingual tone pack](docs/10-bilingual-tone-pack.md) | AR/EN voice, copy rules, RTL considerations |
| [11 · Fintech UX elevation spec](docs/11-fintech-ux-elevation-spec.md) | Interaction quality bar |

## Repository layout

| Path | Status |
|---|---|
| `frontend-app/` | **Canonical UI** — Vite + React application |
| `database/schema.sql` | Core relational schema |
| `docs/` | Product & architecture documentation |
| `react-ui/`, `ui-kit/`, root `index.html` | Earlier design explorations — kept for reference, not the current app |

## Status

**Prototype / reference architecture.** This is a designed and documented system with a working front-end prototype — not a production deployment. The scoring models are specified rather than trained on live bureau data.

## License

MIT — see [LICENSE](LICENSE).
