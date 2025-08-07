#!/usr/bin/env node
/**
 * update-changelog.js
 *
 * Usage:  node scripts/update-changelog.js providers/libre/data.json
 *
 * Must be run from the repo root in a Git working tree that already
 * contains the *new* version of the provider file (i.e. after checkout).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

/* ---------- helpers ------------------------------------------------------ */

const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));

const baseSha = process.env.BASE_SHA || 'HEAD^';

const gitShowJSON = (file, sha = baseSha) => {
  try {
    const out = execSync(`git show ${sha}:${file}`, { encoding: 'utf8' });
    return JSON.parse(out);
  } catch {
    return null; // file did not exist at base SHA
  }
};

const getCommitInfo = () => {
  try {
    const hash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const message = execSync('git log -1 --pretty=format:%s', {
      encoding: 'utf8',
    }).trim();
    return { hash: hash.substring(0, 8), message };
  } catch {
    return { hash: 'unknown', message: 'unknown' };
  }
};

const deepDiff = (a, b, prefix = '') => {
  const out = {};
  const keys = new Set([
    ...(a ? Object.keys(a) : []),
    ...(b ? Object.keys(b) : []),
  ]);

  for (const k of keys) {
    const pa = a ? a[k] : undefined;
    const pb = b ? b[k] : undefined;
    const keyPath = prefix ? `${prefix}.${k}` : k;

    if (JSON.stringify(pa) === JSON.stringify(pb)) continue;

    if (
      pa &&
      pb &&
      typeof pa === 'object' &&
      typeof pb === 'object' &&
      !Array.isArray(pa) &&
      !Array.isArray(pb)
    ) {
      Object.assign(out, deepDiff(pa, pb, keyPath));
    } else {
      out[keyPath] = {
        from: pa === undefined ? null : pa,
        to: pb === undefined ? null : pb,
      };
    }
  }
  return out;
};

const toMd = val => {
  if (val === null || val === undefined) return '`null`';
  if (typeof val === 'object') {
    return `\n\`\`\`json\n${JSON.stringify(val, null, 2)}\n\`\`\`\n`;
  }
  return `\`${String(val)}\``;
};

/* ---------- main --------------------------------------------------------- */

const providerFile = process.argv[2];
if (!providerFile || !fs.existsSync(providerFile)) {
  console.error(
    '❌  Must pass path to provider JSON, e.g. providers/libre/data.json'
  );
  process.exit(1);
}

const next = readJSON(providerFile);
const prev = gitShowJSON(providerFile); // Uses BASE_SHA automatically
const slug = next.slug;
const nowISO = new Date().toISOString();
const commitInfo = getCommitInfo();

const diff = deepDiff(prev, next);
if (Object.keys(diff).length === 0) {
  console.log(`ℹ️  No user-visible changes for ${slug}. Skipping changelog.`);
  process.exit(0);
}

/* --- load / initialise changelog ---------------------------------------- */

const dir = path.dirname(providerFile);
const jsonPath = path.join(dir, 'changelog.json');
const mdPath = path.join(dir, 'CHANGELOG.md');

let changelog = { provider: slug, logs: [] };
if (fs.existsSync(jsonPath)) changelog = readJSON(jsonPath);

/* --- append entry -------------------------------------------------------- */

changelog.logs.push({
  action: prev ? 'update' : 'publish',
  changedAt: nowISO,
  changedBy: process.env.GITHUB_ACTOR || 'ci-bot',
  commit: commitInfo.hash,
  commitMessage: commitInfo.message,
  changes: diff,
});

/* --- write JSON ---------------------------------------------------------- */

fs.writeFileSync(jsonPath, `${JSON.stringify(changelog, null, 2)}\n`);
console.log(`✅  Updated ${jsonPath}`);

/* --- write / update Markdown -------------------------------------------- */

const mdLines = [];

if (fs.existsSync(mdPath)) {
  mdLines.push(fs.readFileSync(mdPath, 'utf8').trimEnd());
} else {
  mdLines.push(`# Changelog - ${next.provider_name || slug}\n`);
}

mdLines.push(
  `## ${nowISO.slice(0, 10)}`,
  `**Action:** ${prev ? 'update' : 'publish'}`,
  `**By:** ${process.env.GITHUB_ACTOR || 'ci-bot'}`,
  `**Commit:** [${commitInfo.hash}](https://github.com/your-repo/commit/${commitInfo.hash})`,
  `**Message:** ${commitInfo.message}\n`,
  '### Changed'
);

for (const [k, v] of Object.entries(diff)) {
  mdLines.push(`- **${k}:** ${toMd(v.from)} → ${toMd(v.to)}`);
}

mdLines.push('\n---\n');
fs.writeFileSync(mdPath, mdLines.join('\n'));
console.log(`✅  Updated ${mdPath}`);
