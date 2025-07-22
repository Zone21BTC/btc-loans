#!/usr/bin/env node

import { execSync } from 'child_process';

try {
  // Get the list of staged files
  const stagedFiles = execSync('git diff --cached --name-only', {
    encoding: 'utf8',
  });

  // Check if any files in dist/ are staged
  const distFiles = stagedFiles
    .split('\n')
    .filter(file => file.trim() && file.startsWith('dist/'));

  if (distFiles.length > 0) {
    console.error('❌ Error: Cannot commit changes to dist/ folder!');
    console.error('');
    console.error('The following files in dist/ are staged for commit:');
    distFiles.forEach(file => console.error(`  - ${file}`));
    console.error('');
    console.error(
      'The dist/ folder contains generated files that should only be created by CI.'
    );
    console.error('Please remove these files from staging:');
    console.error(`  git reset HEAD ${distFiles.join(' ')}`);
    console.error('');
    console.error(
      'If you need to update generated files, please do so through CI/CD pipeline.'
    );
    process.exit(1);
  }

  console.log('✅ No dist/ folder changes detected. Proceeding with commit...');
} catch (error) {
  console.error('Error checking dist folder:', error.message);
  process.exit(1);
}
