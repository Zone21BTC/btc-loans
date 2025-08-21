// TypeScript definitions for zone21-risk-scores library

export interface EvidenceItem {
  link: string;
  type: 'image' | 'pdf';
  source_url: string;
  captured_at: string;
  label: string;
}

export interface Factor {
  score: 0 | 2 | 4 | 7 | 10;
  note: string;
  evidence: EvidenceItem[];
}

export interface ValueMetric {
  value: number;
  unit?: string;
  note?: string;
}

export interface ValueArrayMetric {
  value: number[];
  unit?: string;
  note?: string;
}

export type RiskBand = 'Low' | 'Medium' | 'High' | 'Critical';

export type CustodyModel = 'DeFi' | 'CeFi' | 'CeDeFi';

export type LoanType = 'Consumer' | 'Business';

export type Rehypothecation = 'Yes' | 'No' | 'Limited';

export type KYC = 'Yes' | 'No' | 'Varies';

export type ProviderStatus = 'active' | 'inactive' | 'withdrawn';

export interface AprType {
  value: 'Fixed' | 'Variable';
  note?: string;
}

export interface ProviderDetails {
  launch_year: number;
  website: string;
  custody_model: CustodyModel;
  custodians: string[];
  collateral_type: string[];
  rehypothecation: Rehypothecation;
  kyc: KYC;
  loan_type: LoanType[];
  loan_currency: string[];
  support_channels: string[];
  apr_type: AprType;
  apr_min: ValueMetric;
  apr_max: ValueMetric;
  origination_fee: ValueMetric;
  interest_rate_min: ValueMetric;
  interest_rate_max: ValueMetric;
  ltv: ValueMetric;
  margin_call: ValueArrayMetric;
  liquidation_ltv: ValueMetric;
  loan_value_min: ValueMetric;
  loan_value_max: ValueMetric;
  loan_duration_min: ValueMetric;
  loan_duration_max: ValueMetric;
  total_loan_issued: ValueMetric;
}

export interface ProviderFactors {
  collateral: Factor;
  rehypothecation: Factor;
  custody: Factor;
  security_governance: Factor;
  platform: Factor;
  oracle: Factor;
  liquidation_buffer: Factor;
  rate_and_term: Factor;
  transparency: Factor;
  loan_currency: Factor;
  privacy: Factor;
  history: Factor;
  jurisdiction: Factor;
}

export interface Penalty {
  key: string;
  label: string;
  description: string;
  penalty: number;
}

export interface CalculatedScore {
  linear_score: number;
  final_score: number;
  critical_penalties: Penalty[];
  bonus_penalties: Penalty[];
  risk_band: RiskBand;
}

export interface Provider {
  provider_name: string;
  slug: string;
  model_version: string;
  highlights: string;
  introduction: string;
  status: ProviderStatus;
  is_beta?: boolean;
  notes?: string;
  details: ProviderDetails;
  factors: ProviderFactors;
  risk_band: RiskBand;
  linear_score: number;
  final_score: number;
  critical_penalties: Penalty[];
  bonus_penalties: Penalty[];
  logo?: string;
  preview_image?: string;
}

export interface WeightConfigs {
  collateral: number;
  rehypothecation: number;
  custody: number;
  security_governance: number;
  platform: number;
  oracle: number;
  liquidation_buffer: number;
  rate_and_term: number;
  transparency: number;
  loan_currency: number;
  privacy: number;
  history: number;
  jurisdiction: number;
}

export interface PenaltyRule {
  key: string;
  label: string;
  description: string;
  validate: (factors: ProviderFactors) => boolean;
}

// Custom configuration interface for user customization
export interface CustomConfigs {
  weights?: Partial<WeightConfigs>;
  bonusPenalties?: Partial<Record<string, number>>;
  criticalPenalties?: Partial<Record<string, number>>;
}

// Main exports
export const allProviders: Provider[];

// Utility functions with customizable configs
export function calculateFinalScore(factors: ProviderFactors, customConfigs?: CustomConfigs): CalculatedScore;
export function deriveRiskBand(finalScore: number): RiskBand;
export function calculateBonusPenalties(factors: ProviderFactors, bonusPenalties: Record<string, number>): Penalty[];
export function calculateCriticalPenalties(factors: ProviderFactors, criticalPenalties: Record<string, number>): Penalty[];

// Configuration utilities
export function getDefaultConfigs(): Required<CustomConfigs>;
export function mergeConfigs(customConfigs?: CustomConfigs): Required<CustomConfigs>;

// Configuration constants
export const WEIGHT_CONFIGS: WeightConfigs;
export const BONUS_PENALTY_RULES: PenaltyRule[];
export const CRITICAL_PENALTY_RULES: PenaltyRule[];
export const BONUS_PENALTY_VALUE: Record<string, number>;
export const CRITICAL_PENALTY_VALUE: Record<string, number>;

// Constants
export const providerSlugs: string[];
export const RISK_BANDS: RiskBand[];
export const CUSTODY_MODELS: CustodyModel[];