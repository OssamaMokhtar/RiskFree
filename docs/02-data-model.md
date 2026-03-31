# Data Model & Database Schema

## 1. Entity Relationship Overview

```
customers ──┬──▶ credit_applications ──▶ credit_scores ──▶ score_explanations
            │                           └──▶ decision_audit_logs
            ├──▶ transactions ──▶ fraud_alerts ──▶ aml_cases
            ├──▶ sme_profiles ──▶ sme_financials
            ├──▶ kyc_records
            ├──▶ documents
            └──▶ collateral_records
```

## 2. Core Tables — see schema files in `/database/` directory

All table definitions are in the `/database/` folder as individual SQL files.
See companion document `02b-schema-sql.md` for full CREATE TABLE statements.

Key tables:
- `customers` — Retail + SME customer master (PII encrypted/tokenized)
- `sme_profiles` — Extended SME business info
- `credit_applications` — Loan/card applications with status workflow
- `credit_scores` — Versioned scoring results per application
- `score_explanations` — SHAP-based feature importance per score
- `transactions` — Partitioned by month, categorized
- `fraud_alerts` — Alert lifecycle (NEW→ASSIGNED→INVESTIGATING→RESOLVED)
- `aml_cases` — Investigation case management
- `decision_audit_logs` — Immutable audit trail for every decision
- `model_registry` — ML model versioning and performance metrics
- `kyc_records` — KYC verification status and risk ratings
- `documents` — Document metadata for RAG indexing
- `customer_features` — Computed ML features for retail customers
- `sme_features` — Computed ML features for SME customers
- `collateral_records` — Security/collateral for SME lending

## 3. Vector DB Schema (RAG)

| Collection | Content | Key Metadata |
|---|---|---|
| `gcc_regulations` | Regulatory docs | country_code, regulator, section |
| `credit_policies` | Internal policies | policy_type, version |
| `customer_profiles` | Customer docs | customer_id, access_level |
| `aml_guidelines` | AML/CFT rules | country_code, topic |
