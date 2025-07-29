# Zone21 Risk Scores

A public repository of the **raw 13‑factor risk scores** that Zone21 assigns to Bitcoin‑backed loan products. Each provider’s file lives in `providers/<slug>/data.json`, and CI bundles them into aggregate datasets at `dist/all-providers.json` (pretty) **and** `dist/all-providers.min.json` (compact) for easy download.

→ **Full methodology:** see [`docs/risk-model.md`](docs/risk-model.md)

---

## 📑 Contents

| Section                                      | Why read it                                                      |
| -------------------------------------------- | ---------------------------------------------------------------- |
| [Motivation](#motivation)                    | What problem this dataset solves.                                |
| [Folder Layout](#folderlayout)               | Where everything lives & who edits what.                         |
| [Data Model](#datamodel)                     | Field‑by‑field rundown of a provider JSON file.                  |
| [Build & Validation](#build-validation)      | How CI turns raw files into an aggregate & guarantees integrity. |
| [Quick start](#quickstart)                   | Two‑minute guide to cloning, validating, and building.           |
| [Contributing](#contributing)                | Ground rules for PRs & coding style.                             |
| [License & Attribution](#licenseattribution) | CC‑BY‑4.0 terms, citation format.                                |

---

## Motivation

Bitcoin‑backed lenders differ wildly in custody, rehypothecation practices, oracle design, and jurisdictional safeguards. Zone21’s **13‑factor Risk Score** surfaces these differences quantitatively so borrowers can compare apples to apples and researchers can back‑test systemic‑risk scenarios.

The full methodology is described in the [**Zone21 Risk Model**](https://www.zone21.com/risk-model). In short, each factor is graded on **0, 2, 4, 7, 10** where 10 is worst. Bonus or critical penalties are automatically added based on specific risk patterns, producing a **0–100 total score** (lower is safer).

---

## Folder Layout

```
/                            # repo root
├── providers/               # ⇠ HUMAN‑EDITED SOURCE FILES
│   ├── aave/
│   │   └── data.json
│   ├── ledn/
│   │   └── data.json
│   └── …
├── schema/
│   └── provider.schema.json  # JSON‑Schema (single source of truth)
├── docs/
│   └── risk-model.md         # Human‑readable methodology & future docs
├── scripts/
│   ├── validate.js           # AJV schema‑lint
│   └── build-aggregate.js    # generates dist/ artefacts
├── dist/                     # ⇠ **CI‑GENERATED** — never edit manually
│   ├── all-providers.json     # enriched list with totals, risk bands, penalties
│   └── all-providers.min.json # minified version for CDN delivery
├── .github/workflows/
│   └── build.yml             # PR validation & post‑merge publish
└── README.md                 # you are here 🚀
```

### Source‑of‑truth vs artefacts

| Directory               | Edited by                  | Contains                                          |
| ----------------------- | -------------------------- | ------------------------------------------------- |
| `providers/*/data.json` | Analysts via PR            | Raw factor scores, notes, evidence URLs, metadata |
| `docs/`                 | Zone21 team & contributors | Risk‑model explainer and other human docs         |
| `dist/*`                | CI bot                     | Auto‑calculated fields and aggregate JSON files   |

Humans **must not** commit directly to `dist/`; branch protection will reject such PRs.

---

## Data Model

Each `data.json` is validated by [`schema/provider.schema.json`](./schema/provider.schema.json). Here are the key level-1 fields:

| Field           | Type                 | Description                                                                     |
| --------------- | -------------------- | ------------------------------------------------------------------------------- |
| `provider_name` | `string`             | Human-readable name of the loan provider or product.                            |
| `slug`          | `string`             | Unique, URL-safe, lowercase kebab-case identifier (e.g., 'ledn').               |
| `model_version` | `string`             | Version of the Zone21 risk-scoring methodology (e.g., '1.0').                   |
| `highlights`    | `string`             | Short narrative summary highlighting key strengths or weaknesses.               |
| `introduction`  | `string`             | Elevator pitch describing the provider.                                         |
| `status`        | `string`             | Operational status: 'active', 'inactive', or 'withdrawn'.                       |
| `is_beta`       | `boolean` (optional) | Flag indicating if the provider is a beta product.                              |
| `notes`         | `string` (optional)  | Additional remarks not covered by specific factor notes.                        |
| `details`       | `object`             | Structured product details displayed in UI tables.                              |
| `factors`       | `object`             | Contains 13 sub-objects each with a `score`, `note`, and optionally `evidence`. |

The `evidence` sub-object includes:

- `link`: URL to the supporting document (image or PDF).
- `type`: Type of evidence ('image' or 'pdf').
- `source_url`: URL to the original source of evidence.
- `created_at`: UTC datetime indicating when the evidence was retrieved (e.g., '2025-07-29T05:04:11Z').

> **Note:** Fields like `final_score`, `risk_band`, and penalty-related fields are calculated automatically and do not appear in source files.

---

## Build & Validation

| Stage         | Trigger                      | What happens                                                                                                                                                                                                   |
| ------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Validate**  | Every pull‑request           | `scripts/validate.js` runs AJV against modified `providers/*/data.json`. Build fails on any schema error or illegal score.                                                                                     |
| **Aggregate** | Merge to `main` (or nightly) | `scripts/build-aggregate.js` re‑validates, applies penalty rules, calculates totals & risk bands, writes `dist/all-providers.json` and `dist/all-providers.min.json`, then commits or deploys to GitHub Pages. |

### Dependencies

- **Node ≥ 20** (LTS)
- `npm install` – installs dev dependencies (`ajv` for schema validation, `prettier` for formatting).

---

## Quick start

```bash
# 1. clone the repo
$ git clone https://github.com/Zone21BTC/zone21-risk-scores.git && cd zone21-risk-scores
# 2. install dev deps
$ npm install
# 3. validate all provider files
$ npm run validate
# 4. build aggregate dataset locally (outputs to ./dist)
$ npm run build
```

Need the latest dataset only?

```bash
curl -sL https://raw.githubusercontent.com/Zone21BTC/zone21-risk-scores/main/dist/all-providers.json | jq '.[0]'
```

---

## Contributing

1. **Fork → branch → PR.** One logical change per PR (e.g., update `rehypothecation.score` for `ledn`).
2. **Run `npm run validate`** before pushing. Zero schema errors.
3. **Explain _why_** in the PR description — link to audits, docs.
4. CI must pass. Reviewers focus on factor reasoning; the bot enforces math.
5. No direct edits to `dist/`; those commits will be rejected.

Coding style: Prettier default settings (`npm run format`). Scripts are tiny—plain ESM Node preferred, no TS for now.

---

## License & Attribution

- **Data:** Creative Commons **CC‑BY‑4.0**. Cite “Zone21 Risk Scores” and link back to this repo.

> _Disclaimer: The scores are research opinions, not financial advice. Do your own due diligence._
