# Zone21 Risk Scores

**Public dataset & build tooling for 13‑factor risk assessments of Bitcoin‑backed loan products.**

This repository hosts the _raw research files_ maintained by Zone21 analysts **plus** a fully reproducible build pipeline that compiles those files into a single machine‑readable dataset. The data is open for researchers, developers & the curious to audit, remix, or integrate.

> **TL;DR** &#x20;
> • Each provider lives at `providers/<slug>/data.json` and contains only the 13 factor inputs + metadata. &#x20;
> • CI validates those files, then builds `dist/all-providers.json` (and a minified `dist/all-providers.min.json`) with derived risk metrics. &#x20;
> • Nothing inside `dist/` is ever edited by humans.

---

## 📑 Contents

| Section                                            | Why read it                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| [Motivation](#motivation)                      | What problem this dataset solves.                                |
| [Folder Layout](#folderlayout)                | Where everything lives & who edits what.                         |
| [Data Model](#datamodel)                      | Field‑by‑field rundown of a provider JSON file.                  |
| [Build & Validation](#build-validation)       | How CI turns raw files into an aggregate & guarantees integrity. |
| [Quick start](#quickstart)                    | Two‑minute guide to cloning, validating, and building.           |
| [Contributing](#contributing)                  | Ground rules for PRs & coding style.                             |
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

| Directory               | Edited by       | Contains                                          |
| ----------------------- | --------------- | ------------------------------------------------- |
| `providers/*/data.json` | Analysts via PR | Raw factor scores, notes, evidence URLs, metadata |
| `dist/*`                | CI bot          | Auto‑calculated fields and aggregate JSON files   |

Humans **must not** commit directly to `dist/`; branch protection will reject such PRs.

---

## Data Model

Each `data.json` is validated by [`schema/provider.schema.json`](./schema/provider.schema.json). Key required fields:

| Field        | Type                | Notes                                                                  |
| ------------ | ------------------- | ---------------------------------------------------------------------- |
| `slug`       | `string`            | Kebab‑case unique ID (matches folder name)                             |
| `version`    | `string`            | Manual revision stamp (e.g., `"1.0"`, `"2.0"`)                         |
| `highlights` | `string`            | 1–3 sentence summary for humans                                        |
| `status`     | `string` (optional) | `"active"`, `"inactive"`, `"withdrawn"`                                |
| `factors`    | `object`            | 13 sub‑objects → `score` (0/2/4/7/10), `note`, optional `evidence` \[] |

`evidence` items look like:

```json
{
  "link": "https://example.com/audit.pdf",
  "type": "pdf"
}
```

Allowed `type`: `image` | `pdf`.

> **No `final_score`, `risk_band`, or penalty fields appear in source files** — these are computed downstream.

---

## Build & Validation

| Stage         | Trigger                      | What happens                                                                                                                                                                                                   |
| ------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Validate**  | Every pull‑request           | `scripts/validate.js` runs AJV against modified `providers/*/data.json`. Build fails on any schema error or illegal score.                                                                                     |
| **Aggregate** | Merge to `main` (or nightly) | `scripts/build-aggregate.js` re‑validates, applies penalty rules, calculates totals & risk bands, writes `dist/all-providers.json` and `dist/all-providers.min.json`, then commits or deploys to GitHub Pages. |

### Dependencies

- **Node ≥ 20** (LTS)
- `npm ci` installs `ajv` (+ `prettier` for formatting)

---

## Quick start

```bash
# 1. clone the repo
$ git clone https://github.com/Zone21BTC/zone21-risk-scores.git && cd zone21-risk-scores
# 2. install dev deps
$ npm ci
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
