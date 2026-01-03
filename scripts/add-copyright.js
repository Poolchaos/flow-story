/*
 * Copyright Header Injection Script
 * Adds copyright headers to all source files in the project.
 *
 * Usage: node scripts/add-copyright.js
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Copyright header for TypeScript/JavaScript files
const TS_HEADER = `/*
 * Copyright (c) 2025 Artemis. All Rights Reserved.
 *
 * This source code is licensed under the PolyForm Noncommercial License 1.0.0
 * found in the LICENSE file in the root directory of this source tree.
 *
 * For commercial licensing, contact: artemis@example.com
 */

`;

// Copyright header for CSS files
const CSS_HEADER = `/*
 * Copyright (c) 2025 Artemis. All Rights Reserved.
 * Licensed under PolyForm Noncommercial License 1.0.0
 * Commercial licensing: artemis@example.com
 */

`;

// File extensions to process
const EXTENSIONS = {
  '.ts': TS_HEADER,
  '.tsx': TS_HEADER,
  '.js': TS_HEADER,
  '.jsx': TS_HEADER,
  '.css': CSS_HEADER,
};

// Directories to skip
const SKIP_DIRS = ['node_modules', 'dist', 'build', 'coverage', '.git', 'public'];

// Files to skip
const SKIP_FILES = ['vite-env.d.ts', 'next-env.d.ts'];

// Patterns that indicate file already has a copyright header
const COPYRIGHT_PATTERNS = [
  /^\/\*\s*\n\s*\*\s*Copyright/,
  /^\/\/\s*Copyright/,
  /^\/\*\*\s*\n\s*\*\s*@copyright/,
];

async function hasExistingCopyright(content) {
  return COPYRIGHT_PATTERNS.some(pattern => pattern.test(content.trim()));
}

async function processFile(filePath, header) {
  try {
    const content = await readFile(filePath, 'utf-8');

    // Skip if already has copyright
    if (await hasExistingCopyright(content)) {
      console.log(`  [SKIP] ${filePath} (already has copyright)`);
      return { skipped: true };
    }

    // Prepend header
    const newContent = header + content;
    await writeFile(filePath, newContent, 'utf-8');
    console.log(`  [DONE] ${filePath}`);
    return { updated: true };
  } catch (error) {
    console.error(`  [ERROR] ${filePath}: ${error.message}`);
    return { error: true };
  }
}

async function walkDirectory(dir, stats = { updated: 0, skipped: 0, errors: 0 }) {
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      // Skip excluded directories
      if (SKIP_DIRS.includes(entry)) {
        continue;
      }
      await walkDirectory(fullPath, stats);
    } else if (entryStat.isFile()) {
      // Skip excluded files
      if (SKIP_FILES.includes(entry)) {
        continue;
      }

      const ext = extname(entry);
      const header = EXTENSIONS[ext];

      if (header) {
        const result = await processFile(fullPath, header);
        if (result.updated) stats.updated++;
        if (result.skipped) stats.skipped++;
        if (result.error) stats.errors++;
      }
    }
  }

  return stats;
}

async function main() {
  console.log('='.repeat(60));
  console.log('  FlowStory Copyright Header Injection');
  console.log('='.repeat(60));
  console.log(`\nScanning: ${projectRoot}/src\n`);

  const srcDir = join(projectRoot, 'src');
  const stats = await walkDirectory(srcDir);

  console.log('\n' + '='.repeat(60));
  console.log('  Summary');
  console.log('='.repeat(60));
  console.log(`  Updated:  ${stats.updated} files`);
  console.log(`  Skipped:  ${stats.skipped} files (already had copyright)`);
  console.log(`  Errors:   ${stats.errors} files`);
  console.log('='.repeat(60));

  if (stats.updated > 0) {
    console.log('\n[SUCCESS] Copyright headers added successfully.');
    console.log('Review changes with: git diff');
  }
}

main().catch(console.error);
