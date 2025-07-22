import {
  WEIGHT_CONFIGS,
  BONUS_PENALTY_RULES,
  CRITICAL_PENALTY_RULES,
} from './configs.js';

const calculateFactorWeightedScore = (score, weight) => {
  return (score * weight) / 10;
};

export const calculateBonusPenalties = factors => {
  // List of bonus rules that are met
  const results = [];
  for (const rule of BONUS_PENALTY_RULES) {
    if (rule.validate(factors)) {
      const { validate: _validate, ...rest } = rule;
      results.push({ ...rest });
    }
  }
  return results;
};

export const calculateCriticalPenalties = factors => {
  // List of critical rules that are met
  const results = [];
  for (const rule of CRITICAL_PENALTY_RULES) {
    if (rule.validate(factors)) {
      const { validate: _validate, ...rest } = rule;

      results.push({ ...rest });
    }
  }
  return results;
};

export const calculateFinalScore = factors => {
  let linear_score = Object.entries(factors).reduce((acc, [key, value]) => {
    return acc + calculateFactorWeightedScore(value.score, WEIGHT_CONFIGS[key]);
  }, 0);
  linear_score = Math.ceil(linear_score);
  let final_score = linear_score;
  const critical_penalties = calculateCriticalPenalties(factors);
  const bonus_penalties = calculateBonusPenalties(factors);
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
