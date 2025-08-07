## Zone21 Risk Model Explained

### **1. Introduction**

Imagine you could peek under the hood of every Bitcoin-backed loan and instantly know how risky it is. That’s the goal of our Risk Model. It’s a comprehensive scoring system, built by Bitcoiners, for Bitcoiners, that helps you understand the behind-the-scenes risks of Bitcoin-backed lending products.

Our model analyzes 13 distinct risk factors, from the security of the custodied Bitcoin to the transparency of the lender’s operations. Each factor is scored, weighted, and then combined to generate a single, easy-to-understand risk score for every loan product.

This article breaks down how we calculate this score, giving you the knowledge to make more informed borrowing decisions.

#### **Why a Non-Linear Risk Model?**

The real world of risk is not linear; it often has fat tails, where extreme events are more likely than a normal distribution would suggest. Our risk model reflects this reality. We use a non-linear scoring ladder (0, 2, 4, 7, 10) for each factor. This approach, along with "Bonus Penalties" and “Critical Penalties” for certain factors or combinations of factors, allows us to more accurately represent the asymmetric nature of risk in Bitcoin-backed lending.

For advanced users, we offer the ability to customize factor weights and penalty points in the settings, allowing you to tailor the risk model to your own perspective.

#### **Note on DeFi vs. CeFi vs. CeDeFi Classification**

Some projects, like Aave or Coinbase‑Morpho, are often marketed as "DeFi." However, we take a more stringent view. If the underlying Bitcoin is held by a centralized custodian (such as BitGo or Coinbase Custody), or if a small group (through token voting, multisig upgrades, or corporate governance) can unilaterally alter protocol rules or freeze withdrawals, we classify it as **CeDeFi** for the purposes of our risk assessment. Truly “decentralized” finance, in our view, should not have such centralized points of failure.

#### **Note on Taxes**

Zone21’s risk scores assess only operational and counter-party risk; they do not evaluate how any loan may be taxed.

Tax rules differ sharply across jurisdictions and can materially change the true cost (or after-tax return) of a Bitcoin-backed loan. Always confirm the local treatment of interest, collateral sales, and capital gains and **consult a qualified tax professional** before entering into any agreement.

### **2. Risk Formula**

**Step 1 – Base Score**  
`Base Score = Σ(weightᵢ × factorScoreᵢ) / 10` → 0–100

**Step 2 – Bonus Penalties**  
Add **+2 / +3 / +5 / +10** when certain high‑impact factor values are present.

**Step 3 – Critical Penalties**  
If any _fatal flag_ is true, set the score to **≥ 90**.
`Final = max(current, 90)`

| Band   | Range    | Meaning                                                      |
| ------ | -------- | ------------------------------------------------------------ |
| Green  | 0 – 30   | Closest to self-custody; minimal added trust.                |
| Yellow | 31 – 60  | Noticeable trade‑offs; monitor closely.                      |
| Orange | 61 – 80  | Fragile; a moderate shock could trigger losses.              |
| Red    | 81 – 100 | Severe danger; high chance of losing some or all collateral. |

#### **Factor Weights**

| Factor                | Weight |
| :-------------------- | -----: |
| Collateral            |    10% |
| Rehypothecation       |    10% |
| Custody               |    10% |
| Security & Governance |    10% |
| Platform              |    10% |
| Oracle                |    10% |
| Liquidation Buffer    |     8% |
| Rate & Term           |     7% |
| Transparency          |     7% |
| Loan Currency         |     5% |
| Privacy               |     5% |
| History               |     5% |
| Jurisdiction          |     3% |
| Total                 |   100% |

#### **Bonus Penalties**

| Condition                             | +Pts | Why it escalates risk                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rehypothecation = 7                   | 10   | Third-party reuse allowed; borrower kept in the dark; hidden leverage can vaporize collateral if a downstream partner blows up.                                                                                                                                                                                       |
| Rehypothecation = 4                   | 5    | Collateral is pledged to one outside venue; a single counter-party default can still cascade back to the loan.                                                                                                                                                                                                        |
| Oracle = 10                           | 5    | Closed, provider-controlled feed can inject hidden spreads or false prints to force liquidations.                                                                                                                                                                                                                     |
| Custody = 7                           | 5    | **DeFi**: no fallback or funds locked in upgradeable contract. **CeFi**: pooled hot wallet with self-declared segregation and zero external audit.                                                                                                                                                                    |
| Collateral = 10                       | 5    | Paper-BTC has no on-chain redemption; insolvency wipes out 100 % of collateral.                                                                                                                                                                                                                                       |
| Security & Governance = 7             | 5    | **DeFi**: no public audit; borrower key generated in-browser or with OSS lacking a reproducible build; cosigner/oracle key locations undisclosed; critical off-chain bots unaudited. **CeFi**: audit private/redacted; Internet-exposed or single-sig hot wallet; staff can change wallet software without oversight. |
| Collateral ≥ 7 AND Platform ≥ 7       | 5    | When the same proprietary bridge both custodies BTC and executes loan logic, a single exploit wipes out the entire stack.                                                                                                                                                                                             |
| Liquidation Buffer ≥ 7 AND Oracle ≥ 7 | 5    | Narrow liquidation buffer plus self-run oracle makes flash liquidations almost certain.                                                                                                                                                                                                                               |
| Rate & Term = 10                      | 5    | Retroactive APR hikes possible.                                                                                                                                                                                                                                                                                       |
| Security & Governance = 4             | 3    | **DeFi:** audit partial/outdated; borrower key module audited but builds not reproducible; cosigner & oracle keys kept in non-HSMs. **CeFi:** custodian tech audited, but cold-to-hot workflow only self-declared; hot-wallet balance larger than minimal float.                                                      |
| Privacy ≥ 7 AND Jurisdiction ≥ 7      | 3    | Large KYC trove stored in a venue with weak legal recourse; prime target for breaches and coercion.                                                                                                                                                                                                                   |
| Custody ≤ 2 AND Transparency ≥ 7      | 3    | A custody model that appears to give the user control (e.g., Custody Score ≤ 2) is meaningless if the signing software is a black box that could leak or duplicate the key. The risk is comparable to CeFi hot-wallet sweep.                                                                                          |
| Rate & Term = 7                       | 2    | Uncapped variable APR.                                                                                                                                                                                                                                                                                                |

#### **Critical Penalties**

| Fatal flag (score 10) | Why it is fatal                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rehypothecation       | Unlimited, opaque reuse of BTC; liabilities may exceed assets.                                                                                                                     |
| Custody               | Single signer or undisclosed control path; sweep risk.                                                                                                                             |
| Security & Governance | No audits and unilateral admin control; the operator can sweep or freeze user funds at will.                                                                                       |
| Platform              | Effective control held by a single entity or tightly affiliated group, or past exploits have locked or lost user funds; balances can be rewritten or blocked without user consent. |
| Privacy               | Mandatory KYC plus confirmed PII breach.                                                                                                                                           |
| History               | Fraud, unresolved litigation, recent bankruptcy, or any major verifiable loss of customer funds.                                                                                   |

### **3. The 13 Risk Factors**

> **How to read the tables:** Each table lists the five possible scores (0 / 2 / 4 / 7 / 10) and the criteria needed to earn them. Lower scores mean lower risk.

#### 3.1 Collateral (10 %)

**What it measures**  
_What are you pledging?_ Native BTC is safest; wrappers, bridges, or paper IOUs add redemption risk.

| Score | Criteria                                                               |
| ----- | ---------------------------------------------------------------------- |
| 0     | Native on-chain BTC or DLC escrow; no third-party permission required. |
| 2     | Federated peg redeemable 1:1 (e.g., Liquid, Fedimint).                 |
| 4     | Wrapped BTC with audited custodial keys (e.g., WBTC).                  |
| 7     | Opaque or lightly audited wrappers / bridges.                          |
| 10    | Paper BTC or ETF share; no direct redemption path.                     |

**Why it matters**  
The closer your collateral stays to real Bitcoin on the main chain, the fewer things can go wrong. Once you wrap BTC (put it inside another token) you’re now betting that 1) a custodian keeps the real coins safe and 2) regulators never freeze redemptions. Bridge tokens add even more risk: if hackers break the bridge, your “wrapped” coins become worthless IOUs. In 2022 alone [more than **$2 billion** disappeared](https://www.chainalysis.com/blog/cross-chain-bridge-hacks-2022/) that way. Paper claims like an ETF are worst of all: you have no on-chain path home and must wait in bankruptcy court if the issuer fails.

---

#### 3.2 Rehypothecation (10 %)

**What it measures**  
_Will your BTC be re‑used?_ More hidden leverage → bigger blow‑up chance.

| Score | Criteria                                                                           |
| ----- | ---------------------------------------------------------------------------------- |
| 0     | Coins cannot be reused; locked in escrow.                                          |
| 2     | Internal pooling only; still segregated on-chain.                                  |
| 4     | Collateral pledged to a single external partner under a “no further reuse” clause. |
| 7     | Third-party reuse allowed; borrower kept in the dark.                              |
| 10    | Aggressive, undisclosed diversion of customer BTC.                                 |

**Why it matters**  
If a lender can re-use (rehypothecate) your coins, you’re quietly guaranteeing _their_ trades. Every extra hop adds another party who must stay honest and solvent. When markets crash, those hidden links snap all at once—exactly what happened when FTX shifted customer BTC to its sister fund, [Alameda Research](https://www.coindesk.com/opinion/2023/06/02/bridge-exploits-cost-2b-in-2022-heres-how-they-could-have-been-averted). With true “no-rehypothecation” (enforced on-chain) the coins never leave the escrow address, so a third-party blow-up cannot touch you.

---

#### 3.3 Custody (10 %)

**What it measures**  
_Who can move the coins?_ Scores quorum design, recovery paths, and (for CeFi) bankruptcy‑remote segregation.

#### **DeFi ladder**

| Score | Criteria                                                                                                                               |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Script-enforced refund; borrower can sweep alone after timeout; no live cosigner needed.                                               |
| 2     | Cold multisig; borrower can sweep instantly with any surviving cosigner(s); wallet descriptor already in borrower’s hands.             |
| 4     | Timelocked or manual fallback; recovery possible only after a timelock or a documented signer-replacement process.                     |
| 7     | No fallback; funds are stuck if the lending platform, cosigner, or oracle goes offline, or funds sit in an upgradeable smart contract. |
| 10    | Single admin key can sweep funds.                                                                                                      |

#### **CeFi ladder**

| Score | Criteria                                                               |
| ----- | ---------------------------------------------------------------------- |
| 4     | Cold storage at regulated custodian and bankruptcy-remote segregation. |
| 7     | Pooled hot wallet; segregation self-declared.                          |
| 10    | Single-sig exchange wallet; no audit.                                  |

**Why it matters**

**DeFi:** The gold standard is a script that lets _you_ unilaterally pull the coins back after a timelock, even if every server at the lending platform goes down. That self-destruct path turns platform failure into an inconvenience, not a loss.

**CeFi:** By definition you give up all keys, so our CeFi ladder **starts at score 4**. There is always some added trust. The best-case design puts the coins in cold storage inside a _bankruptcy-remote legal trust_, ring-fencing them from corporate creditors. Anything less means creditors fight you for the same UTXOs.

---

#### 3.4 Security & Governance (10 %)

**What it measures**  
_How battle‑tested are code and ops?_ Counts audits, bug‑bounty, certs, and hardware key isolation.

#### **DeFi ladder**

| Score | Criteria                                                                                                                                                                                                                                                                         |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | ≥ 2 independent audits covering all code — on‑chain and off‑chain (oracles, bots, wallets) + live bug‑bounty; borrower, cosigner & oracle keys kept offline or in HSMs.                                                                                                          |
| 2     | 1 comprehensive independent audit that explicitly includes the cosigner/oracle infrastructure; borrower key from reproducible OSS or BYO hardware; cosigner/oracle keys offline or in HSMs.                                                                                      |
| 4     | Audit partial/outdated or scope excludes off‑chain components; borrower key from OSS without reproducible build, but key‑handling code has at least one independent audit; cosigner & oracle keys kept offline or in single-purpose hardware designed for secure key management. |
| 7     | No independent audit; borrower key generated via browser-based software or OSS without reproducible build; cosigner & oracle keys location unspecified; critical off-chain bots/scripts unaudited.                                                                               |
| 10    | No audit or attestations; borrower key generated or stored by closed-source, unaudited software; admin-controlled cosigner/oracle keys with unilateral authority to sweep or liquidate collateral.                                                                               |

#### **CeFi ladder**

| Score | Criteria                                                                                                                                              |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | ≥ 2 independent audits + SOC-2/ISO 27001 + bug‑bounty; assets in multi‑sig cold storage; hot‑wallet float minimal and within the audited scope.       |
| 2     | 1 comprehensive independent audit + SOC-2/ISO; most assets held in multi-sig cold storage; modest, audited hot-wallet pool for routine withdrawals.   |
| 4     | Custodian tech audited, but lender’s cold-to-hot workflow only self-declared; hot-wallet balance larger than a minimal float.                         |
| 7     | No independent audit of wallet tech or key‑management; Internet-exposed or single-sig keys; staff can push wallet-software changes without oversight. |
| 10    | Pooled assets behind a single hot key/exchange wallet; no audits or certs; unrestricted internal access.                                              |

**Why it matters**  
A multisig is only as strong as its weakest key. In **DeFi**, two weaknesses are common:

1. **Opaque borrower key generation**: If your signing key is created in-browser or inside a closed-source app, a hostile update can slip in predictable “randomness.” Whoever controls that update can later reconstruct your private key.

2. **Hot lender or oracle keys without HSMs**: Even if your own hardware wallet is rock-solid, the other keys in the escrow might sit unencrypted on a cloud server. One server breach could be all it takes to sweep the funds.

Every key in the quorum therefore needs the same discipline: dedicated hardware protection, publicly verifiable (or at least audited) code, and signed software releases.

On the **CeFi** side, dual-control rules (e.g., “two people must approve every spend”) create a human firewall that stops any single employee from draining the funds.

**Note on CeFi hot-wallet float:** The hot-wallet balance should hold just enough BTC for routine withdrawals. A large float magnifies theft and mismanagement risk.

**Note on DeFi audits:** Even with robust key handling, off-chain software (price feeds, PSBT builders, liquidation scripts) can steal or brick collateral. Independent, third-party audits remain essential.

---

#### 3.5 Platform (10 %)

**What it measures**  
_Is the chain or bridge robust?_ Rates consensus security and smart‑contract attack surface.

| Score | Criteria                                                                                                                                                                          |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Pure Bitcoin script; no extra VM.                                                                                                                                                 |
| 2     | Permissionless unilateral exit; user can reclaim L1 BTC without federation; no admin‑key or proxy can alter contract logic.                                                       |
| 4     | Federated peg-out; chain never rolled back; immutable and audited smart contracts; no single entity or affiliated group able to reach blocking or majority control.               |
| 7     | Platform where a minority coalition can block or has majority control, or the chain runs an expressive/upgradeable VM; or any chain with a documented halt/rollback/frozen funds. |
| 10    | Effective control held by a single entity or tightly affiliated group, or past exploits have locked or lost user funds.                                                           |

**Why it matters**  
The rail your collateral rides on determines how easily you can get coins back and how many new ways things can break.

- **Bitcoin Layer 1 and Lightning**: Channels always settle on Bitcoin’s base chain. Even if every routing node disappears, you can force-close and reclaim BTC on-chain. Few moving parts, a long track record, and no outside token economics to weaken security.

- **Federated pegs (e.g., Liquid, Fedimint)**: A fixed quorum of guardians signs redemptions, giving you faster and cheaper transfers. You must, however, trust that quorum to stay online and honest; if too many guardians drop out—or regulators apply pressure—withdrawals can slow or pause.

- **Proof-of-Stake smart-contract chains with highly expressive languages (Ethereum/Solidity, Solana, etc.)**: Security depends on validator incentives tied to the chain’s token price, while Turing-complete languages add a huge attack surface. Re-entrancy, arithmetic bugs, and upgrade-proxy errors have already drained billions. In crises, validators have halted or even rolled back chains, freezing bridged BTC and loan contracts in limbo. Bitcoin’s deliberately limited script avoids many of those foot-guns by trading flexibility for safety.

---

#### 3.6 Oracle (10 %)

**What it measures**  
_How is price fetched and signed?_ Independence, on‑chain proofs, refresh speed, circuit breakers.

| Score | Criteria                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------ |
| 0     | ≥ 3 independent feeds, on-chain verifiable.                                                                              |
| 2     | Two independent feeds aggregated on-chain; methodology and sources publicly documented.                                  |
| 4     | One independent feed, publicly auditable.                                                                                |
| 7     | Provider-run oracle with transparent, open-source methodology that blends multiple exchanges.                            |
| 10    | Closed, provider-controlled oracle that can embed hidden spreads when converting BTC ↔ fiat (effectively a hidden fee). |

**Why it matters**  
Liquidation engines treat the oracle price as _truth_. A single, closed-source feed lets the platform nudge the price window just enough to liquidate you, scoop up your BTC at a discount, then restore the real price. Requiring at least two independent feeds (and publishing their proofs on-chain) makes that attack far more expensive. An opaque feed also hides **extra fees**, because the operator controls the exchange rate on every fiat ↔ BTC conversion.

---

#### 3.7 Liquidation Buffer (8 %)

**What it measures**  
_How much room and time before liquidation?_ Combines LTV gap, grace window, and flash‑crash guards.

| Score | Criteria                                                                                                         |
| ----- | ---------------------------------------------------------------------------------------------------------------- |
| 0     | ≥ 30 pp cushion and a margin call system with ≥ 24 h grace window or partial liquidation; circuit-breaker ideal. |
| 2     | 20–29 pp cushion with a multi-hour grace window, or ≥ 30 pp with no grace or partial liquidation.                |
| 4     | 10–19 pp cushion, regardless of grace or margin call.                                                            |
| 7     | < 10 pp cushion, regardless of any grace or margin call.                                                         |
| 10    | ≤ 5 pp cushion, regardless of any grace or margin call.                                                          |

**Why it matters**  
Most Bitcoin lenders define three LTV thresholds:

- **Initial LTV**: where your loan begins.

- **Margin-call LTV (M-LTV)**: triggers a warning and, if allowed, lets you add collateral or repay.

- **Liquidation LTV (L-LTV)**: triggers an automatic sale of your BTC.

Your real safety hinges on two things:

1. **The overall gap** from the initial LTV up to the liquidation LTV.

2. **The grace window** you get after crossing the margin-call level.

- A **wide overall gap with a full-day grace window**—e.g., loan starts at 50 %, margin call at 60 %, liquidation at 80 %, and 24 h to act—gives you breathing room; normal price swings rarely approach liquidation.

- A **tight overall gap and a one-hour grace**—e.g., 65 % → 70 % → 75 %—means a modest 4 % drop could push the loan through both thresholds while you’re asleep, leaving no time to react.

- A **wide gap but zero grace** offers some protection, yet the loan can still be wiped out if the market crashes past both levels in one fast move.

**Note on DLC loans:** Current DLC tooling doesn’t allow topping up collateral after launch, so these products compensate with especially generous buffers instead of a grace period.

**Note on circuit breakers:** Nearly all Bitcoin-backed lenders liquidate without pausing; circuit breakers are therefore aspirational. Any setup with a narrow gap or minimal grace window effectively turns routine volatility into forced sales.

---

#### 3.8 Rate & Term (7 %)

**What it measures**  
_Can interest spike mid‑loan?_ Looks at fixed vs variable APR and funding duration match.

| Score | Criteria                                                                             |
| ----- | ------------------------------------------------------------------------------------ |
| 0     | Fixed APR; lender funding matched for the same term.                                 |
| 2     | Fixed APR; funding opaque but historically reliable.                                 |
| 4     | Transparent variable rate; rule-based caps.                                          |
| 7     | Variable and uncapped; borrow APRs on Aave spiked above 60 % during the USDC de-peg. |
| 10    | Bait-and-switch: promo rate later hiked unilaterally or retroactively.               |

**Why it matters**

- **Variable vs fixed**: Floating rates can jump overnight. Aave’s WBTC borrow APR hit 60 % during the 2023 USDC de-peg, [wiping out borrowers](https://aavescan.com/articles/aave-interest-rate-events) who expected “low double digits.” Fixed rates avoid that shock **only** if the lender has locked in funding for the same term.
- **Duration mismatch**: When a lender backs long-term loans with short-term deposits, rising funding costs force sudden rate hikes or withdrawal freezes. That trap sank [Celsius](https://calebandbrown.com/blog/why-crypto-lender-celsius-froze-withdrawals/) and [Voyager](https://www.coindesk.com/layer2/2022/07/12/behind-voyagers-fall-crypto-broker-acted-like-a-bank-went-bankrupt) in 2022, both of which froze accounts after short-term creditors ran for the exit.

A fixed-rate deal is truly safe only when the lender’s liabilities mature no sooner than your loan.

---

#### 3.9 Transparency (7 %)

**What it measures**  
_Can outsiders verify code & solvency?_ Rewards open‑source + live PoR; punishes black boxes.

| Score | Criteria                                                                                                                         |
| ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Live PoR for both assets and liabilities; each loan has its own on-chain UTXO; code fully open-source and reproducible.          |
| 2     | Scheduled PoR (assets + liabilities); UTXOs visible; core key-custody code open-source and reproducible.                         |
| 4     | Periodic assets-only PoR (no liabilities proof) or UTXOs visible; core wallet open-source but not reproducible or partly closed. |
| 7     | One-off or stale PoR; loan UTXOs hidden; wallet/custody code fully closed.                                                       |
| 10    | Total black box: no PoR, no address transparency, fully closed code with zero third-party review.                                |

**Why it matters**  
 Transparency tells you whether a lender is a glass box or a black box, and it comes on two fronts:

- **Operational health**: Continuous, auditable _Proof-of-Reserves_ **and** _Proof-of-Liabilities_ reveal whether assets still exceed debts. Platforms that publish on-chain wallet balances and Merkle-tree liability snapshots make it hard to hide a [fractional reserve](https://www.ainvest.com/news/celsius-collapse-cautionary-tale-crypto-investors-2504/); opaque lenders like Celsius offered no such proofs before locking withdrawals in 2022.

- **Code health**: Open-source, reproducible builds let anyone verify that tomorrow’s software update can’t siphon wallets. Closed-source platforms must lean on private audits. Yet audits alone are no guarantee. More than 90 % of the $2 billion+ lost to [smart-contract exploits](https://www.anchain.ai/blog/smart-contract-audits-failed) in recent years hit code that had [already “passed” an audit](https://www.quillaudits.com/blog/smart-contract/smart-contract-pass-audits-but-still-gets-hacked).

**When in doubt, open source beats audits.** Audited but proprietary code can gain a critical bug the very next release, whereas [open code](https://blink.sv/blog/open-source-software) lets the wider community spot and patch issues before they become exploits.

---

#### 3.10 Loan Currency (5 %)

**What it measures**  
_What asset do you borrow?_ Native‑BTC best; fiat stables graded on reserves, audits, censorship risk.

| Score | Criteria                                                       |
| ----- | -------------------------------------------------------------- |
| 0     | Borrow & repay in BTC.                                         |
| 2     | Fiat wire or fully-reserved e-money.                           |
| 4     | Top-tier fiat-backed stablecoin (USDC, USDT).                  |
| 7     | Mid-tier or thin-liquidity stablecoin.                         |
| 10    | Algorithmic or under-collateralized stablecoin (UST collapse). |

_Scoring rule_: If a provider offers multiple payout currencies, we assign the score using the worst (highest-risk) currency option.

**Why it matters**  
 Borrowing in fiat or stablecoins adds hidden foreign-exchange risk:

- **Stable-coin peg risk**: Even “blue-chip” stables can wobble. During the SVB scare (March 2023) USDC slipped to $0.87; repaying at the trough cost \~15 % more BTC. Thin-liquidity or algorithmic coins can de-peg far worse (or implode outright, as UST did) leaving you owing far more than planned or unable to repay at all.

- **Liquidity gaps & hidden fees**: Weekend order books for USDT or USDC can be 5–10 × thinner than weekday depth. Slippage, bridge tolls, and on/off-ramp fees quietly add percentage points to your real borrowing cost, especially when settlement happens on side-chains with few market makers.

- **Regulatory freeze risk**: Centralized issuers can blacklist or even burn tokens tied to sanctioned addresses. A sudden freeze might block you from repaying, triggering liquidation even though your BTC collateral is intact.

The farther you stray from native BTC (first into large-cap stables, then thin-liquidity or algorithmic coins) the more ways the loan can fail before you ever miss a payment.

---

#### 3.11 Privacy (5 %)

**What it measures**  
_How exposed is your identity?_ Scores KYC depth, data storage, and breach history.

| Score | Criteria                                      |
| ----- | --------------------------------------------- |
| 0     | No KYC + privacy-enhanced UTXOs.              |
| 2     | No KYC; standard on-chain footprint.          |
| 4     | Optional KYC tiers or minimal data retention. |
| 7     | Full KYC stored; no breaches yet.             |
| 10    | Full KYC and confirmed data leak.             |

**Why it matters**  
Leaked KYC data never expires, and it can quickly escalate from an online nuisance to a real-world threat.

- **Permanent extortion list**: After Ledger’s 2020 customer-data leak, attackers dumped 272,000 names and addresses online and launched [phone-extortion campaigns](https://www.bitdefender.com/en-gb/blog/hotforsecurity/threat-actors-target-ledger-data-breach-victims-in-new-extortion-campaign) demanding XMR ransoms.
- **Targeted rich lists**: A 2020 BlockFi breach exposed balances and addresses; analysts warned that [criminals could filter the data to single out high-value holders](https://cointelegraph.com/news/blockfis-data-breach-may-allow-criminals-to-extort-rich-clients) for blackmail or home invasions.
- **Physical attacks and kidnappings**: In 2025, [kidnappers abducted a Ledger co-founder](https://www.reuters.com/world/europe/co-founder-french-crypto-firm-ledger-freed-after-kidnapping-paris-prosecutors-2025-01-23/) and demanded a large Bitcoin ransom—proof that leaked identity data can lead to doorstep violence.

Traditional fraud tools (freezing a card, closing an account) offer no defense against a wrench attack. Data leaks occur every year, and once exposed, records circulate indefinitely. Minimal data collection isn’t a luxury; it’s a core safety control for anyone holding Bitcoin.

---

#### 3.12 History (5 %)

**What it measures**  
_Have they proven themselves?_ Measures years in production, audit/OSS footprint, and incident track record.

| Score | Criteria                                                                                                                                                                                     |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | ≥ 3 yrs in production; multiple public audits or major open-source releases; zero security or fraud incidents.                                                                               |
| 2     | 1–3 yrs continuous operation; at least one public audit or small OSS footprint; no incidents.                                                                                                |
| 4     | < 1 yr in production **or** first minor incident (data leak, regulator warning, small fine) with no customer loss **or** formerly score-7 platform remediated and incident-free for ≥ 3 yrs. |
| 7     | Major breach, lawsuit, or regulatory penalty that harmed customers; platform still operates.                                                                                                 |
| 10    | Proven fraud, bankruptcy with customer losses, or vanished team.                                                                                                                             |

**Why it matters**

- **No hacks or frauds**: Years of incident-free operation are a strong positive signal.

- **Stable in bull and bear markets**: Staying open during crashes shows the team can manage cash, support users, and deal with regulators.

- **Open code or public audits**: Letting outsiders inspect the software helps catch bugs before they bite.

Together, these are healthy signs of a well-run operator.

---

#### 3.13 Jurisdiction (3 %)

**What it measures**  
_Which legal system backs you?_ Rates clarity of licensing, creditor rights, and enforcement.

| Score | Criteria                                                                                                                      |
| ----- | ----------------------------------------------------------------------------------------------------------------------------- |
| 0     | Explicit Bitcoin lending licence in creditor-friendly, proven court system; clear bankruptcy priority for digital collateral. |
| 2     | General MSB / VASP or money-lending licence covers BTC loans; regime broadly stable but still evolving.                       |
| 4     | Offshore but contract-respecting venue; basic VASP law, limited consumer recourse.                                            |
| 7     | Grey-zone or minimal enforcement; no lending statute; borrower relies on T&Cs.                                                |
| 10    | Black-listed, sanctioned or expressly hostile jurisdiction.                                                                   |

**Why it matters**  
Where the platform is based shapes your options if something goes wrong. The Mt. Gox bankruptcy (filed 2014 in Japan) took years to work through foreign claims, leaving many U.S. customers waiting nearly a decade for partial payouts.

- **Well-established legal systems**: Clear bankruptcy rules and quicker paths to court (e.g., U.S., U.K.).

- **Offshore jurisdictions**: Can work for well-designed DeFi setups, but regulatory frameworks are less clear and disputes may take longer to resolve.

- **Sanctioned or high-risk countries**: Add extra uncertainty; payouts or legal claims can be delayed or blocked.

Strong, borrower-friendly laws don’t guarantee a win, yet they give you a clearer roadmap if trouble arises.

### **4. A Living Model**

Our scoring system is a **tool, not a verdict**. It shines a light on hidden risks, lets you compare products on the same scale, and gives you a head-start on your own due-diligence checklist. But there is no “perfect” model: markets evolve, new attack paths appear, and some factors matter more to certain borrowers than others.

We continually refine the rubrics, weights, and examples as real-world events teach us more. Your feedback, corrections, and counter-examples help make the model better for everyone. Please keep them coming.

> **Disclaimer: Nothing here is financial, investment, tax, or legal advice.** The formulas, scores, weights, and penalties are estimates, not guarantees. Always do your own research and consult qualified professionals to decide how much risk you are willing to accept.
