import {
  WEIGHT_CONFIGS,
  BONUS_PENALTY_RULES,
  CRITICAL_PENALTY_RULES,
  BONUS_PENALTY_VALUE,
  CRITICAL_PENALTY_VALUE,
} from './configs.js';

// Helper function to get default configs
export const getDefaultConfigs = () => ({
  weights: { ...WEIGHT_CONFIGS },
  bonusPenalties: { ...BONUS_PENALTY_VALUE },
  criticalPenalties: { ...CRITICAL_PENALTY_VALUE },
});

// Helper function to merge custom configs with defaults
export const mergeConfigs = (customConfigs = {}) => {
  const defaults = getDefaultConfigs();
  return {
    weights: { ...defaults.weights, ...customConfigs.weights },
    bonusPenalties: {
      ...defaults.bonusPenalties,
      ...customConfigs.bonusPenalties,
    },
    criticalPenalties: {
      ...defaults.criticalPenalties,
      ...customConfigs.criticalPenalties,
    },
  };
};

export const calculateFactorWeightedScore = (score, weight) => {
  return (score * weight) / 10;
};

export const calculateBonusPenalties = (factors, bonusPenalties) => {
  // List of bonus rules that are met
  const results = [];
  for (const rule of BONUS_PENALTY_RULES) {
    if (rule.validate(factors)) {
      const { validate: _validate, ...rest } = rule;
      results.push({ ...rest, penalty: bonusPenalties[rest.key] });
    }
  }
  return results;
};

export const calculateCriticalPenalties = (factors, criticalPenalties) => {
  // List of critical rules that are met
  const results = [];
  for (const rule of CRITICAL_PENALTY_RULES) {
    if (rule.validate(factors)) {
      const { validate: _validate, ...rest } = rule;

      results.push({ ...rest, penalty: criticalPenalties[rest.key] });
    }
  }
  return results;
};

export const calculateFinalScore = (factors, configs = {}) => {
  const mergedConfigs = mergeConfigs(configs);
  const { weights, bonusPenalties, criticalPenalties } = mergedConfigs;
  let linear_score = Object.entries(factors).reduce((acc, [key, value]) => {
    return acc + calculateFactorWeightedScore(value.score, weights[key]);
  }, 0);
  linear_score = Math.ceil(linear_score);
  let final_score = linear_score;
  const critical_penalties = calculateCriticalPenalties(
    factors,
    criticalPenalties
  );
  const bonus_penalties = calculateBonusPenalties(factors, bonusPenalties);
  final_score += bonus_penalties.reduce(
    (acc, penalty) => acc + penalty.penalty,
    0
  );

  if (critical_penalties.length) {
    const max_penalty = Math.max(
      ...critical_penalties.map(penalty => penalty.penalty)
    );
    final_score = Math.max(final_score, max_penalty);
  }

  return {
    risk_band: deriveRiskBand(final_score),
    linear_score,
    final_score,
    critical_penalties,
    bonus_penalties,
  };
};

export const deriveRiskBand = finalScore => {
  if (finalScore < 31) return 'Low';
  if (finalScore < 61) return 'Medium';
  if (finalScore < 81) return 'High';
  return 'Critical';
};
