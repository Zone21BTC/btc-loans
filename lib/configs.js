export const BONUS_PENALTY_RULES = [
  {
    key: 'rehypothecation_7',
    label: 'Rehypothecation = 7',
    description:
      'Third-party reuse allowed; borrower kept in the dark; hidden leverage can vaporize collateral if a downstream partner blows up.',
    penalty: 10,
    validate: factors => {
      return factors.rehypothecation.score === 7;
    },
  },
  {
    key: 'collateral_10',
    label: 'Collateral = 10',
    description:
      'Paper-BTC has no on-chain redemption; insolvency wipes out 100% of collateral.',
    validate: factors => {
      return factors.collateral.score === 10;
    },
  },
  {
    key: 'rehypothecation_4',
    label: 'Rehypothecation = 4',
    description:
      'Collateral is pledged to one outside venue; a single counter-party default can still cascade back to the loan.',
    validate: factors => {
      return factors.rehypothecation.score === 4;
    },
  },
  {
    key: 'custody_7',
    label: 'Custody = 7',
    description:
      'DeFi: no fallback or funds locked in upgradeable contract. CeFi: pooled hot wallet with self-declared segregation and zero external audit.',
    validate: factors => {
      return factors.custody.score === 7;
    },
  },
  {
    key: 'security_governance_7',
    label: 'Security & Governance = 7',
    description:
      'DeFi: no public audit; borrower key generated in-browser or with OSS lacking a reproducible build; cosigner/oracle key locations undisclosed; critical off-chain bots unaudited. CeFi: audit private/redacted; Internet-exposed or single-sig hot wallet; staff can change wallet software without oversight.',
    validate: factors => {
      return factors.security_governance.score === 7;
    },
  },
  {
    key: 'collateral_7_and_platform_7',
    label: 'Collateral ≥ 7 AND Platform ≥ 7',
    description:
      'When the same proprietary bridge both custodies BTC and executes loan logic, a single exploit wipes out the entire stack.',
    validate: factors => {
      return factors.collateral.score >= 7 && factors.platform.score >= 7;
    },
  },
  {
    key: 'oracle_10',
    label: 'Oracle = 10',
    description:
      'Closed, provider-controlled feed can inject hidden spreads or false prints to force liquidations.',
    validate: factors => {
      return factors.oracle.score === 10;
    },
  },
  {
    key: 'liquidation_buffer_and_oracle_7',
    label: 'Liquidation Buffer ≥ 7 AND Oracle ≥ 7',
    description:
      'Narrow liquidation buffer plus self-run oracle makes flash liquidations almost certain.',
    validate: factors => {
      return factors.liquidation_buffer.score >= 7 && factors.oracle.score >= 7;
    },
  },
  {
    key: 'rate_and_term_10',
    label: 'Rate & Term = 10',
    description: 'Retroactive APR hikes possible.',
    validate: factors => {
      return factors.rate_and_term.score === 10;
    },
  },
  {
    key: 'custody_2_and_transparency_7',
    label: 'Custody ≤ 2 AND Transparency ≥ 7',
    description:
      'A custody model that appears to give the user control (e.g., Custody Score ≤ 2) is meaningless if the signing software is a black box that could leak or duplicate the key. The risk is comparable to CeFi hot-wallet sweep.',
    validate: factors => {
      return factors.custody.score <= 2 && factors.transparency.score >= 7;
    },
  },
  {
    key: 'security_governance_4',
    label: 'Security & Governance = 4',
    description:
      'DeFi: audit partial/outdated; borrower key module audited but builds not reproducible; cosigner & oracle keys kept in non-HSMs. CeFi: custodian tech audited, but cold-to-hot workflow only self-declared; hot-wallet balance larger than minimal float.',
    validate: factors => {
      return factors.security_governance.score === 4;
    },
  },
  {
    key: 'privacy_and_jurisdiction_7',
    label: 'Privacy ≥ 7 AND Jurisdiction ≥ 7',
    description:
      'Large KYC trove stored in a venue with weak legal recourse; prime target for breaches and coercion.',
    validate: factors => {
      return factors.privacy.score >= 7 && factors.jurisdiction.score >= 7;
    },
  },
  {
    key: 'rate_and_term_7',
    label: 'Rate & Term = 7',
    description: 'Uncapped variable APR.',
    validate: factors => {
      return factors.rate_and_term.score === 7;
    },
  },
];

export const CRITICAL_PENALTY_RULES = [
  {
    key: 'rehypothecation',
    label: 'Rehypothecation',
    description:
      'Unlimited, opaque reuse of BTC; liabilities may exceed assets.',
    validate: factors => {
      return factors.rehypothecation.score === 10;
    },
  },
  {
    key: 'custody',
    label: 'Custody',
    description: 'Single signer or undisclosed control path; sweep risk.',
    validate: factors => {
      return factors.custody.score === 10;
    },
  },
  {
    key: 'security_governance',
    label: 'Security & Governance',
    description:
      'No audits and unilateral admin control; the operator can sweep or freeze user funds at will.',
    validate: factors => {
      return factors.security_governance.score === 10;
    },
  },
  {
    key: 'platform',
    label: 'Platform',
    description:
      'Effective control held by a single entity or tightly affiliated group, or past exploits have locked or lost user funds; balances can be rewritten or blocked without user consent.',
    validate: factors => {
      return factors.platform.score === 10;
    },
  },
  {
    key: 'privacy',
    label: 'Privacy',
    description: 'Mandatory KYC plus confirmed PII breach.',
    validate: factors => {
      return factors.privacy.score === 10;
    },
  },
  {
    key: 'history',
    label: 'History',
    description:
      'Fraud, unresolved litigation, recent bankruptcy, or any major verifiable loss of customer funds.',
    validate: factors => {
      return factors.history.score === 10;
    },
  },
];

export const WEIGHT_CONFIGS = {
  collateral: 10,
  rehypothecation: 10,
  custody: 10,
  security_governance: 10,
  platform: 10,
  oracle: 10,
  liquidation_buffer: 8,
  rate_and_term: 7,
  transparency: 7,
  loan_currency: 5,
  privacy: 5,
  history: 5,
  jurisdiction: 3,
};

export const BONUS_PENALTY_VALUE = {
  rehypothecation_7: 10,
  collateral_10: 5,
  rehypothecation_4: 5,
  custody_7: 5,
  security_governance_7: 5,
  collateral_7_and_platform_7: 5,
  oracle_10: 5,
  liquidation_buffer_and_oracle_7: 5,
  rate_and_term_10: 5,
  custody_2_and_transparency_7: 3,
  security_governance_4: 3,
  privacy_and_jurisdiction_7: 3,
  rate_and_term_7: 2,
};

export const CRITICAL_PENALTY_VALUE = {
  rehypothecation: 90,
  custody: 90,
  security_governance: 90,
  platform: 90,
  privacy: 90,
  history: 90,
};
