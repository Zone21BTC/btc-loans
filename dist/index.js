// Main export file for the zone21-risk-scores library
import allProviders from './all-providers.min.json' assert { type: 'json' };

// Export the processed data with all calculated scores
export { allProviders };

// Export utilities for consumers who want to recalculate or analyze
export {
  calculateFinalScore,
  deriveRiskBand,
  calculateBonusPenalties,
  calculateCriticalPenalties,
  getDefaultConfigs,
  mergeConfigs
} from '../lib/utils.js';

// Export configuration constants
export {
  WEIGHT_CONFIGS,
  BONUS_PENALTY_RULES,
  CRITICAL_PENALTY_RULES,
  BONUS_PENALTY_VALUE,
  CRITICAL_PENALTY_VALUE
} from '../lib/configs.js';

// Export provider slugs for easy iteration
export const providerSlugs = allProviders.map(provider => provider.slug);

// Export risk bands
export const RISK_BANDS = ['Low', 'Medium', 'High', 'Critical'];

// Export custody models
export const CUSTODY_MODELS = ['DeFi', 'CeFi', 'CeDeFi'];

