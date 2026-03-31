# ML Pipeline Design

## 1. Pipeline Architecture

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Data    │──▶│ Feature  │──▶│  Model   │──▶│  Model   │──▶│  Model   │
│ Extract  │   │Engineer  │   │ Training │   │  Eval    │   │ Registry │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
                                                                  │
                    ┌─────────────────────────────────────────────┘
                    ▼
              ┌──────────┐   ┌──────────┐   ┌──────────┐
              │ Champion │──▶│  A/B     │──▶│Production│
              │ /Chall.  │   │  Test    │   │ Serving  │
              └──────────┘   └──────────┘   └──────────┘
                                                  │
                    ┌─────────────────────────────┘
                    ▼
              ┌──────────┐   ┌──────────┐
              │  Drift   │──▶│ Retrain  │
              │ Monitor  │   │ Trigger  │
              └──────────┘   └──────────┘
```

## 2. Model Inventory

| Model | Algorithm | Input Features | Output | Frequency |
|-------|-----------|---------------|--------|-----------|
| Retail PD | XGBoost + LR ensemble | 45 features | PD (0-1) + Score (300-850) | Real-time + batch |
| SME PD | LightGBM + LR ensemble | 52 features | PD (0-1) + Score (300-850) | Batch (daily) |
| Retail LGD | Gradient Boosted Trees | 20 features | LGD (0-1) | Batch |
| SME LGD | Beta regression + GBT | 25 features | LGD (0-1) | Batch |
| Fraud Score | Isolation Forest + NN | 30 features | Fraud prob (0-1) | Real-time |

## 3. Feature Engineering

### 3.1 Retail Features (45 total)

**Income & Affordability (8)**
- `avg_monthly_income_3m/6m/12m` — Rolling average salary
- `income_volatility` — CV of monthly income
- `dsr_ratio` — Total obligations / income
- `free_disposable_income` — Income after obligations
- `salary_multiplier` — Balance / salary ratio
- `employer_risk_score` — Employer type + sector risk

**Spending Behavior (10)**
- `avg_monthly_spend_3m` — Total monthly spending
- `spend_to_income_ratio` — Spend / income
- `essential_spend_ratio` — Essential / total spend
- `discretionary_spend_ratio` — Discretionary / total
- `max_single_txn_30d` — Largest single transaction
- `cash_withdrawal_ratio` — ATM withdrawals / income
- `international_txn_ratio` — Cross-border transactions
- `evening_txn_ratio` — Off-hours transaction pattern
- `merchant_diversity` — Unique merchant categories
- `recurring_payment_count` — Stable recurring payments

**Credit Utilization (7)**
- `utilization_ratio` — Used credit / limit
- `num_active_loans` — Active loan accounts
- `num_active_cards` — Active credit cards
- `total_exposure` — Sum of all outstanding
- `credit_age_months` — Oldest credit account
- `new_credit_inquiries_6m` — Recent bureau inquiries
- `credit_mix_score` — Diversity of credit types

**Payment History (8)**
- `on_time_payment_ratio_12m` — On-time / total payments
- `days_past_due_max_12m` — Max DPD in 12 months
- `dpd_30_count_12m` — 30+ DPD instances
- `dpd_60_count_12m` — 60+ DPD instances
- `consecutive_on_time_months` — Current streak
- `bounced_cheques_12m` — Returned cheques
- `utility_payment_score` — Utility bill timeliness
- `worst_delinquency_24m` — Worst status in 24 months

**Demographics & Stability (7)**
- `age` — Customer age
- `employment_tenure_months` — Job stability
- `address_stability_months` — Address tenure
- `employer_type_score` — Gov > Semi-gov > Private
- `nationality_risk_score` — Risk-adjusted
- `banking_relationship_months` — Tenure with bank
- `digital_engagement_score` — Mobile/online activity

**Account Behavior (5)**
- `avg_balance_3m` — Average account balance
- `min_balance_3m` — Minimum balance  
- `balance_volatility` — Balance standard deviation
- `zero_balance_days_ratio` — Days with zero balance
- `inflow_outflow_ratio` — Credits / debits ratio

### 3.2 SME Features (52 total)

**Cashflow (8)** — Monthly cashflow, volatility, coverage, negative months, operating cashflow margin, free cashflow, cashflow-to-debt, working capital change

**Revenue (7)** — Growth YoY, concentration (Herfindahl), seasonality, top-client dependency, invoice aging, revenue per employee, export ratio

**Profitability (6)** — Gross/net/EBITDA margins, ROA, ROE, operating leverage

**Liquidity (5)** — Current ratio, quick ratio, cash ratio, working capital days, cash conversion cycle

**Leverage (5)** — Debt-to-equity, interest coverage, DSCR, total leverage, secured vs unsecured

**Trade (6)** — DSO, DPO, inventory turnover, trade finance utilization, LC defaults, cheque returns

**Sector (5)** — Sector risk score, sector default rate, sector growth, sector concentration, GCC-specific sector adjustments

**Behavioral (5)** — Account turnover, POS growth, digital transaction ratio, supplier payment behavior, balance trend

**Owner/Management (5)** — Owner experience years, owner credit score, management team size, related party exposure, governance score

## 4. Model Training Pipeline

### 4.1 Training Flow (Airflow DAG)

```python
# Pseudo-code for training DAG
dag = DAG('credit_scoring_training', schedule='0 2 1 * *')  # Monthly

task_extract = extract_training_data(
    source='data_warehouse',
    lookback_months=36,
    target_definition='90_dpd_12m'  # Default = 90+ DPD in 12 months
)

task_features = compute_features(
    data=task_extract,
    feature_set='retail_v3',
    imputation='median_per_segment'
)

task_split = split_data(
    data=task_features,
    method='time_based',  # Train on older, test on recent
    train_cutoff='2025-06-30',
    test_cutoff='2025-12-31'
)

task_train = train_models(
    algorithms=['xgboost', 'lightgbm', 'logistic_regression'],
    hyperparams_search='optuna',
    n_trials=100,
    cv_folds=5,
    class_weight='balanced'
)

task_evaluate = evaluate_models(
    metrics=['auc_roc', 'gini', 'ks', 'precision', 'recall'],
    champion_threshold={'auc_roc': 0.75, 'ks': 0.35},
    discrimination_test=True,  # Demographic parity check
    stability_test=True        # PSI < 0.25
)

task_ensemble = create_ensemble(
    models=['xgboost', 'logistic_regression'],
    method='weighted_average',
    weights_from='validation_auc'
)

task_register = register_model(
    registry='mlflow',
    stage='STAGING',
    metadata={'features': feature_list, 'metrics': eval_results}
)

task_extract >> task_features >> task_split >> task_train >> task_evaluate >> task_ensemble >> task_register
```

### 4.2 Scorecard Calibration

```
Raw PD → Score mapping:
Score = Offset + Factor × ln(Odds)

Where:
- Offset = 600 (score at 50:1 odds)
- Factor = 20 / ln(2) ≈ 28.85 (20 points to double odds)
- Odds = (1 - PD) / PD

Score Range: 300 (worst) to 850 (best)
Risk Grades: AAA, AA, A, BBB, BB, B, CCC, CC, C, D
```

## 5. Model Monitoring

### 5.1 Drift Detection

| Metric | Threshold | Action | Frequency |
|--------|-----------|--------|-----------|
| PSI (Population Stability Index) | > 0.25 | Alert + investigate | Weekly |
| CSI (Characteristic Stability Index) | > 0.25 per feature | Alert | Weekly |
| KS Statistic decay | > 10% decline | Retrain trigger | Monthly |
| Gini decay | > 15% decline | Retrain trigger | Monthly |
| Feature distribution shift | KL divergence > 0.1 | Investigate | Daily |

### 5.2 Performance Monitoring

| Metric | Monitoring | Target |
|--------|-----------|--------|
| AUC-ROC | Monthly back-test | > 0.75 |
| Gini coefficient | Monthly back-test | > 0.50 |
| Approval rate | Daily | 55-75% (configurable) |
| Default rate by grade | Quarterly | Within ±20% of prediction |
| Score distribution | Weekly | Stable shape |
| Reject inference | Quarterly | Bias check |

## 6. Rule Engine (Policy Overlay)

### 6.1 Hard Rules (Retail)

| Rule | UAE | KSA | Qatar | Bahrain | Kuwait | Oman |
|------|-----|-----|-------|---------|--------|------|
| Max DSR | 50% | 55% | 50% | 50% | 40% | 50% |
| Min salary | 5000 AED | 4000 SAR | 4000 QAR | 400 BHD | 400 KWD | 350 OMR |
| Min age | 21 | 21 | 21 | 21 | 21 | 21 |
| Max age at maturity | 65 | 65 | 60 | 65 | 65 | 60 |
| Max tenure (PL) | 48m | 60m | 60m | 60m | 60m | 60m |
| Blacklist check | Required | Required | Required | Required | Required | Required |
| Bureau check | AECB | SIMAH | QCB | BENEFIT | Ci-Net | CBO |

### 6.2 Hard Rules (SME)

| Rule | Description | Default |
|------|-------------|---------|
| Min years in business | Minimum operating history | 2 years |
| Active trade license | Valid and not expired | Required |
| Min annual revenue | Varies by product | 500K AED equiv |
| Max single exposure | % of total portfolio | 5% |
| Sector exclusion | Restricted sectors list | Configurable |
| Related party check | Connected exposures | Required |
| Financial statements | Audited for > 2M AED | Required |
