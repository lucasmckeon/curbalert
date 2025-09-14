#!/usr/bin/env tsx
// Usage:
//   pnpm tsx scripts/client-files.ts auth/LoginForm ->in app/auth folder
//   pnpm tsx scripts/client-files.ts LoginForm -> in app folder
// Writes under /app/<relativePath>/ (no extra folder for the component)

import fs from 'fs';
import path from 'path';

// Convert kebab_case or snake_case to PascalCase
function toPascalCase(input: string): string {
  return input
    .split(/[-_ ]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const projectRoot = process.cwd();
const arg = process.argv[2];

if (!arg) {
  console.error(
    '❌  Usage: pnpm tsx scripts/client-files.ts <relativePath/ComponentName>'
  );
  process.exit(1);
}

const parts = arg.split('/');
const rawName = parts.pop()!;
const componentName = toPascalCase(rawName);
const baseDir = path.join(projectRoot, 'app', ...parts);

// Ensure parent dirs exist
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
  console.log(`📁 Created parent dirs: ${baseDir}`);
}

const componentFile = path.join(baseDir, `${componentName}.tsx`);
const styleFile = path.join(baseDir, `${componentName}.module.scss`);

// ---------- <ComponentName>.tsx ----------
const componentTsx = `'use client';

import styles from './${componentName}.module.scss';

export default function ${componentName}() {
  return (
    <div className={styles.root}>
      <p>${componentName}</p>
    </div>
  );
}
`;

fs.writeFileSync(componentFile, componentTsx);
console.log(
  `${
    fs.existsSync(componentFile) ? '✍️  Wrote' : '🆕 Created'
  }: ${componentFile}`
);

// ---------- <ComponentName>.module.scss ----------
const componentScss = `.root {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
`;

fs.writeFileSync(styleFile, componentScss);
console.log(
  `${fs.existsSync(styleFile) ? '✍️  Wrote' : '🆕 Created'}: ${styleFile}`
);

console.log(`✅  Created client component at: ${componentFile}`);
