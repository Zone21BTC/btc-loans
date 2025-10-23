# Changelog - Arch

## 2025-08-07
**Action:** bootstrap  
*Tracking starts from this date; edits made before 2025-08-07 are not included.*

---
## 2025-08-12
**Action:** update
**By:** tocomax
**Commit:** [3566b205](https://github.com/your-repo/commit/3566b205)
**Message:** chore: update interest rates and APR values for multiple providers to reflect recent changes

### Changed
- **details.apr_min.value:** `14` → `12.5`
- **details.apr_max.value:** `14` → `12.5`
- **details.interest_rate_min.value:** `12.5` → `11`
- **details.interest_rate_max.value:** `12.5` → `11`

---
## 2025-10-23
**Action:** update
**By:** tocomax
**Commit:** [e3691564](https://github.com/your-repo/commit/e3691564)
**Message:** feat: update Arch Lending's score

### Changed
- **highlights:** `Uses native BTC escrow but offers no public proof-of-reserves and depends on a single oracle, leaving users blind to hidden leverage or price-feed failure. Live PoR and multiple independent pricing sources would materially shrink uncertainty.` → `Anchorage custody in bankruptcy-remote trusts is a solid base, but Arch publishes no public proof of reserves and liabilities and discloses no SOC 2 for its own platform. Ship continuous, publicly verifiable PoR and a SOC 2 Type II so customers get verifiable reserves and audited security.`
- **factors.oracle.score:** `10` → `4`
- **factors.oracle.note:** `Arch Lending's public materials never disclose where their BTC-USD price comes from, how often it updates, or whether more than one exchange is consulted.` → `Arch discloses a single third-party oracle: CoinMarketCap's market price feed, refreshed roughly every 60 seconds. CoinMarketCap aggregates quotes from multiple exchanges and applies data-cleaning/outlier filters before publishing a USD price. Arch adds guardrails (alerts for stale prices and a manual hold on liquidations when an 'extreme' LTV is computed), which reduces auto-liquidation risk from a bad tick.`

---
