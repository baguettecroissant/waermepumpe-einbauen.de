import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENT = resolve(ROOT, 'src/components/QuoteWidget.astro');
const TARGET = 'https://www.taptaphome.com/de/agb-nutzer';
const SOURCE_EXTENSIONS = new Set(['.astro', '.html', '.jsx', '.tsx', '.vue', '.svelte']);

const anchorsForTarget = (text) => [...text.matchAll(/<a\b[^>]*>/gi)]
  .map((match) => match[0])
  .filter((anchor) => new RegExp(`href=["']${TARGET.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(anchor));

const hasNofollow = (anchor) => {
  const rel = anchor.match(/\brel=["']([^"']*)["']/i)?.[1] ?? '';
  return rel.split(/\s+/).includes('nofollow');
};

const sourceFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  if (entry.isDirectory()) return sourceFiles(path);
  return SOURCE_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
});

test('TapTapHome AGB link in the final lead step is nofollow', () => {
  const source = readFileSync(COMPONENT, 'utf8');
  const anchors = anchorsForTarget(source);
  assert.ok(anchors.length > 0, `Missing TapTapHome AGB link in ${COMPONENT}`);
  anchors.forEach((anchor) => assert.ok(hasNofollow(anchor), `TapTapHome AGB link must be nofollow: ${anchor}`));
});

test('every rendered TapTapHome AGB link in src is nofollow', () => {
  for (const file of sourceFiles(resolve(ROOT, 'src'))) {
    const source = readFileSync(file, 'utf8');
    const occurrences = source.split(TARGET).length - 1;
    if (occurrences === 0) continue;
    const anchors = anchorsForTarget(source);
    assert.equal(anchors.length, occurrences, `Every TapTapHome AGB URL must be an anchor in ${file}`);
    anchors.forEach((anchor) => assert.ok(hasNofollow(anchor), `TapTapHome AGB link must be nofollow in ${file}: ${anchor}`));
  }
});
