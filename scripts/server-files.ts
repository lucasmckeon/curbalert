#!/usr/bin/env tsx
// Usage:
// Regular:
// pnpm tsx scripts/server-files.ts auth/sign-in
// Route Group:
// pnpm tsx scripts/server-files.ts "(auth)/sign-in"
// Always anchors inside /app/<relativePath>

import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const featureArg = process.argv[2];

if (!featureArg) {
  console.error('❌  Usage: pnpm tsx scripts/server-files.ts <relativePath>');
  process.exit(1);
}

const featureDir = path.join(projectRoot, 'app', featureArg);
const featureName = path.basename(featureDir);

// Ensure folder exists (create or warn)
if (!fs.existsSync(featureDir)) {
  fs.mkdirSync(featureDir, { recursive: true });
  console.log(`📁 Created folder: ${featureDir}`);
} else {
  console.log(`⚠️  Folder already exists: ${featureDir}`);
}

// ---------- page.tsx ----------
const pageTsxPath = path.join(featureDir, 'page.tsx');
const pageTsx = `import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.root}>
      <p>${featureName} Page</p>
    </div>
  );
}
`;

fs.writeFileSync(pageTsxPath, pageTsx);
console.log(
  `${fs.existsSync(pageTsxPath) ? '✍️  Wrote' : '🆕 Created'}: ${pageTsxPath}`
);

// ---------- page.module.scss ----------
const pageScssPath = path.join(featureDir, 'page.module.scss');
const pageScss = `.root {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
}
`;
fs.writeFileSync(pageScssPath, pageScss);
console.log(
  `${fs.existsSync(pageScssPath) ? '✍️  Wrote' : '🆕 Created'}: ${pageScssPath}`
);

console.log(`✅  Created server feature at: ${featureDir}`);
