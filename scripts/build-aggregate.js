import fs from 'node:fs';
import path from 'node:path';
import { calculateFinalScore, deriveRiskBand } from '../lib/utils.js'; // implement separately

const providersDir = './providers';
const distDir = './dist';
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

const providers = fs
  .readdirSync(providersDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => {
    const dataPath = path.join(providersDir, dirent.name, 'data.json');
    if (!fs.existsSync(dataPath)) {
      console.warn(`⚠️  No data.json found for provider: ${dirent.name}`);
      return null;
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  })
  .filter(provider => provider !== null)
  .map(raw => {
    const calculatedData = calculateFinalScore(raw.factors);
    const riskBand = deriveRiskBand(calculatedData.final_score);
    return {
      ...raw,
      risk_band: riskBand,
      ...calculatedData,
    };
  });

// Sort providers: non-beta first by score, then beta providers at the end
// If both are same score, sort by linear_score
providers.sort((a, b) => {
  const aIsBeta = a.is_beta === true;
  const bIsBeta = b.is_beta === true;

  // If one is beta and the other isn't, beta goes to the end
  if (aIsBeta && !bIsBeta) return 1;
  if (!aIsBeta && bIsBeta) return -1;

  // If both are beta or both are non-beta, sort by final_score
  if (a.final_score === b.final_score) {
    return a.linear_score - b.linear_score;
  }

  return a.final_score - b.final_score;
});
fs.writeFileSync(
  path.join(distDir, 'all-providers.json'),
  JSON.stringify(providers, null, 2)
);
fs.writeFileSync(
  path.join(distDir, 'all-providers.min.json'),
  JSON.stringify(providers)
);
console.log('✅  dist/all-providers.json built');
console.log('✅  dist/all-providers.min.json built');
