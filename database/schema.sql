-- ============================================================
-- GCC AI CREDIT SCORING PLATFORM — COMPLETE DATABASE SCHEMA
-- ============================================================

-- 1. CUSTOMERS
CREATE TABLE customers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_type       VARCHAR(10) NOT NULL CHECK (customer_type IN ('RETAIL', 'SME')),
    country_code        VARCHAR(2) NOT NULL CHECK (country_code IN ('AE','SA','QA','BH','KW','OM')),
    first_name_en       VARCHAR(100),
    last_name_en        VARCHAR(100),
    first_name_ar       VARCHAR(100),
    last_name_ar        VARCHAR(100),
    national_id_hash    VARCHAR(256) NOT NULL,
    national_id_token   VARCHAR(256),
    date_of_birth       DATE,
    gender              VARCHAR(10),
    nationality         VARCHAR(3),
    phone_hash          VARCHAR(256),
    email_hash          VARCHAR(256),
    employer_name       VARCHAR(200),
    employer_type       VARCHAR(50),
    employment_tenure_months INTEGER,
    monthly_salary      DECIMAL(15,2),
    salary_currency     VARCHAR(3),
    salary_verified     BOOLEAN DEFAULT FALSE,
    risk_segment        VARCHAR(20),
    pep_status          BOOLEAN DEFAULT FALSE,
    sanctions_status    VARCHAR(20) DEFAULT 'CLEAR',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by          VARCHAR(100),
    is_active           BOOLEAN DEFAULT TRUE,
    data_consent_given  BOOLEAN DEFAULT FALSE,
    consent_timestamp   TIMESTAMPTZ,
    CONSTRAINT unique_national_id_country UNIQUE (national_id_hash, country_code)
);

CREATE INDEX idx_customers_country ON customers(country_code);
CREATE INDEX idx_customers_type ON customers(customer_type);
CREATE INDEX idx_customers_risk ON customers(risk_segment);

-- 2. SME PROFILES
CREATE TABLE sme_profiles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID NOT NULL REFERENCES customers(id),
    trade_license_no    VARCHAR(100),
    legal_name_en       VARCHAR(300),
    legal_name_ar       VARCHAR(300),
    business_type       VARCHAR(50),
    sector_code         VARCHAR(20),
    sector_name_en      VARCHAR(200),
    sector_name_ar      VARCHAR(200),
    years_in_business   INTEGER,
    number_of_employees INTEGER,
    annual_revenue      DECIMAL(18,2),
    annual_expenses     DECIMAL(18,2),
    net_profit          DECIMAL(18,2),
    total_assets        DECIMAL(18,2),
    total_liabilities   DECIMAL(18,2),
    revenue_currency    VARCHAR(3),
    avg_monthly_balance DECIMAL(15,2),
    avg_monthly_credits DECIMAL(15,2),
    avg_monthly_debits  DECIMAL(15,2),
    cheque_return_count INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CREDIT APPLICATIONS
CREATE TABLE credit_applications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID NOT NULL REFERENCES customers(id),
    application_number  VARCHAR(50) UNIQUE NOT NULL,
    product_type        VARCHAR(30) NOT NULL,
    customer_type       VARCHAR(10) NOT NULL CHECK (customer_type IN ('RETAIL','SME')),
    country_code        VARCHAR(2) NOT NULL,
    requested_amount    DECIMAL(18,2),
    requested_currency  VARCHAR(3),
    requested_tenure    INTEGER,
    purpose             VARCHAR(200),
    status              VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    credit_score        INTEGER,
    pd_score            DECIMAL(8,6),
    lgd_estimate        DECIMAL(8,6),
    risk_grade          VARCHAR(5),
    dsr_ratio           DECIMAL(6,4),
    decision            VARCHAR(20),
    decision_reason     TEXT,
    decision_by         VARCHAR(100),
    decision_type       VARCHAR(20),
    decision_at         TIMESTAMPTZ,
    approved_amount     DECIMAL(18,2),
    approved_rate       DECIMAL(6,4),
    approved_tenure     INTEGER,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_by        VARCHAR(100),
    assigned_officer    VARCHAR(100),
    branch_code         VARCHAR(20)
);

-- 4. CREDIT SCORES
CREATE TABLE credit_scores (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID NOT NULL REFERENCES credit_applications(id),
    customer_id         UUID NOT NULL REFERENCES customers(id),
    score_type          VARCHAR(20) NOT NULL,
    model_id            VARCHAR(50) NOT NULL,
    model_version       VARCHAR(20) NOT NULL,
    score_value         INTEGER NOT NULL,
    pd_value            DECIMAL(8,6),
    lgd_value           DECIMAL(8,6),
    risk_grade          VARCHAR(5),
    scoring_mode        VARCHAR(10) NOT NULL DEFAULT 'BATCH',
    scoring_timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rules_passed        BOOLEAN NOT NULL,
    rules_failed        JSONB,
    policy_overrides    JSONB,
    feature_snapshot    JSONB NOT NULL,
    country_code        VARCHAR(2) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SCORE EXPLANATIONS
CREATE TABLE score_explanations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    score_id            UUID NOT NULL REFERENCES credit_scores(id),
    feature_importances JSONB NOT NULL,
    top_positive_factors JSONB,
    top_negative_factors JSONB,
    narrative_en         TEXT,
    narrative_ar         TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TRANSACTIONS (partitioned)
CREATE TABLE transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID NOT NULL,
    account_id          VARCHAR(50) NOT NULL,
    transaction_ref     VARCHAR(100),
    transaction_date    TIMESTAMPTZ NOT NULL,
    amount              DECIMAL(18,2) NOT NULL,
    currency            VARCHAR(3) NOT NULL,
    direction           VARCHAR(6) NOT NULL CHECK (direction IN ('CREDIT','DEBIT')),
    balance_after       DECIMAL(18,2),
    category            VARCHAR(50),
    merchant_category   VARCHAR(10),
    merchant_name       VARCHAR(200),
    channel             VARCHAR(20),
    fraud_score         DECIMAL(5,4),
    is_suspicious       BOOLEAN DEFAULT FALSE,
    country_code        VARCHAR(2),
    city                VARCHAR(100),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (transaction_date);

-- 7. FRAUD ALERTS
CREATE TABLE fraud_alerts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID NOT NULL REFERENCES customers(id),
    transaction_id      UUID,
    alert_type          VARCHAR(30) NOT NULL,
    severity            VARCHAR(10) NOT NULL,
    fraud_score         DECIMAL(5,4),
    alert_details       JSONB NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'NEW',
    assigned_to         VARCHAR(100),
    assigned_at         TIMESTAMPTZ,
    resolved_by         VARCHAR(100),
    resolved_at         TIMESTAMPTZ,
    resolution_type     VARCHAR(20),
    resolution_notes    TEXT,
    sar_required        BOOLEAN DEFAULT FALSE,
    sar_reference       VARCHAR(50),
    sar_filed_at        TIMESTAMPTZ,
    country_code        VARCHAR(2) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AML CASES
CREATE TABLE aml_cases (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number         VARCHAR(50) UNIQUE NOT NULL,
    customer_id         UUID NOT NULL REFERENCES customers(id),
    alert_ids           UUID[] NOT NULL,
    case_type           VARCHAR(30) NOT NULL,
    priority            VARCHAR(10) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    investigator        VARCHAR(100),
    investigation_notes JSONB,
    evidence_docs       JSONB,
    decision            VARCHAR(30),
    decision_by         VARCHAR(100),
    decision_at         TIMESTAMPTZ,
    decision_rationale  TEXT,
    sar_filed           BOOLEAN DEFAULT FALSE,
    sar_details         JSONB,
    country_code        VARCHAR(2) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DECISION AUDIT LOG (immutable)
CREATE TABLE decision_audit_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type         VARCHAR(30) NOT NULL,
    entity_id           UUID NOT NULL,
    customer_id         UUID,
    action              VARCHAR(30) NOT NULL,
    actor_type          VARCHAR(20) NOT NULL,
    actor_id            VARCHAR(100),
    actor_name          VARCHAR(200),
    before_state        JSONB,
    after_state         JSONB,
    reason              TEXT,
    ai_recommendation   JSONB,
    human_decision      JSONB,
    country_code        VARCHAR(2),
    ip_address          VARCHAR(45),
    session_id          VARCHAR(100),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. MODEL REGISTRY
CREATE TABLE model_registry (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name          VARCHAR(100) NOT NULL,
    model_version       VARCHAR(20) NOT NULL,
    model_type          VARCHAR(30) NOT NULL,
    algorithm           VARCHAR(50),
    framework           VARCHAR(30),
    training_date       TIMESTAMPTZ,
    auc_roc             DECIMAL(6,4),
    gini                DECIMAL(6,4),
    ks_statistic        DECIMAL(6,4),
    status              VARCHAR(20) NOT NULL DEFAULT 'TRAINING',
    is_active           BOOLEAN DEFAULT FALSE,
    artifact_path       VARCHAR(500),
    feature_list        JSONB,
    hyperparameters     JSONB,
    country_codes       VARCHAR(2)[],
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_model_version UNIQUE (model_name, model_version)
);

-- 11. KYC RECORDS
CREATE TABLE kyc_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID NOT NULL REFERENCES customers(id),
    kyc_level           VARCHAR(10) NOT NULL,
    kyc_status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    id_type             VARCHAR(30),
    id_number_hash      VARCHAR(256),
    id_expiry           DATE,
    document_verified   BOOLEAN DEFAULT FALSE,
    customer_risk_rating VARCHAR(10),
    pep_flag            BOOLEAN DEFAULT FALSE,
    sanctions_checked   BOOLEAN DEFAULT FALSE,
    country_code        VARCHAR(2) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. DOCUMENTS
CREATE TABLE documents (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID REFERENCES customers(id),
    document_type       VARCHAR(30) NOT NULL,
    title_en            VARCHAR(300),
    title_ar            VARCHAR(300),
    storage_path        VARCHAR(500),
    is_indexed          BOOLEAN DEFAULT FALSE,
    chunk_count         INTEGER,
    access_level        VARCHAR(20) NOT NULL DEFAULT 'INTERNAL',
    allowed_roles       VARCHAR(50)[],
    country_code        VARCHAR(2),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. COLLATERAL RECORDS
CREATE TABLE collateral_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID NOT NULL REFERENCES credit_applications(id),
    customer_id         UUID NOT NULL REFERENCES customers(id),
    collateral_type     VARCHAR(30) NOT NULL,
    description_en      TEXT,
    description_ar      TEXT,
    estimated_value     DECIMAL(18,2),
    currency            VARCHAR(3),
    haircut_pct         DECIMAL(5,2),
    net_value           DECIMAL(18,2),
    status              VARCHAR(20) DEFAULT 'PENDING',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. CUSTOMER FEATURES (ML feature store)
CREATE TABLE customer_features (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID NOT NULL REFERENCES customers(id),
    computation_date    DATE NOT NULL,
    avg_monthly_income_3m       DECIMAL(15,2),
    income_volatility           DECIMAL(8,4),
    dsr_ratio                   DECIMAL(6,4),
    avg_monthly_spend_3m        DECIMAL(15,2),
    spend_to_income_ratio       DECIMAL(6,4),
    utilization_ratio           DECIMAL(6,4),
    on_time_payment_ratio_12m   DECIMAL(6,4),
    days_past_due_max_12m       INTEGER,
    avg_balance_3m              DECIMAL(15,2),
    balance_volatility          DECIMAL(8,4),
    feature_version             VARCHAR(10),
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_cust_feature UNIQUE (customer_id, computation_date)
);

-- 15. SME FEATURES
CREATE TABLE sme_features (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sme_profile_id      UUID NOT NULL REFERENCES sme_profiles(id),
    computation_date    DATE NOT NULL,
    avg_monthly_cashflow_6m     DECIMAL(15,2),
    cashflow_volatility         DECIMAL(8,4),
    revenue_growth_yoy          DECIMAL(8,4),
    gross_margin                DECIMAL(8,4),
    current_ratio               DECIMAL(8,4),
    debt_to_equity              DECIMAL(8,4),
    debt_service_coverage       DECIMAL(8,4),
    sector_risk_score           DECIMAL(5,2),
    cheque_return_rate           DECIMAL(6,4),
    feature_version             VARCHAR(10),
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_sme_feature UNIQUE (sme_profile_id, computation_date)
);
