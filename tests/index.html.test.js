/**
 * Tests for index.html - PR change: addition of CodeRabbit review comment
 *
 * These tests verify the HTML comment `<!-- CodeRabbit Review: v1.0 -->`
 * introduced in this PR is correctly present and does not break the document.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, '..', 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const lines = html.split('\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\nindex.html – CodeRabbit review comment\n');

// --- Presence ---

test('file contains the CodeRabbit review comment', () => {
  assert.ok(
    html.includes('<!-- CodeRabbit Review: v1.0 -->'),
    'Expected "<!-- CodeRabbit Review: v1.0 -->" to be present in index.html'
  );
});

test('comment is on line 2 (immediately after DOCTYPE)', () => {
  // lines array is 0-indexed; line 2 of the file == index 1
  assert.strictEqual(
    lines[1].trim(),
    '<!-- CodeRabbit Review: v1.0 -->',
    `Expected line 2 to contain the comment, got: "${lines[1]}"`
  );
});

test('comment appears before the opening <html> tag', () => {
  const commentIdx = lines.findIndex(l => l.includes('<!-- CodeRabbit Review: v1.0 -->'));
  const htmlTagIdx = lines.findIndex(l => /^<html/.test(l.trim()));
  assert.ok(commentIdx !== -1, 'Comment not found');
  assert.ok(htmlTagIdx !== -1, '<html> tag not found');
  assert.ok(
    commentIdx < htmlTagIdx,
    `Comment (line ${commentIdx + 1}) should appear before <html> tag (line ${htmlTagIdx + 1})`
  );
});

// --- Well-formedness ---

test('comment uses correct HTML comment syntax (<!-- ... -->)', () => {
  const commentLine = lines[1].trim();
  assert.ok(commentLine.startsWith('<!--'), 'Comment must start with <!--');
  assert.ok(commentLine.endsWith('-->'), 'Comment must end with -->');
});

test('comment does not contain nested comment sequences (--)', () => {
  // Content between <!-- and --> must not contain '--'
  const commentLine = lines[1].trim();
  const inner = commentLine.slice(4, -3); // strip <!-- and -->
  assert.ok(
    !inner.includes('--'),
    `Comment inner content must not contain "--" (found: "${inner}")`
  );
});

test('exactly one CodeRabbit review comment exists in the file', () => {
  const occurrences = (html.match(/<!--\s*CodeRabbit Review:\s*v[\d.]+\s*-->/g) || []).length;
  assert.strictEqual(occurrences, 1, `Expected exactly 1 CodeRabbit comment, found ${occurrences}`);
});

// --- Regression: document structure remains intact ---

test('DOCTYPE declaration is on line 1', () => {
  assert.ok(
    lines[0].trim().toLowerCase().startsWith('<!doctype'),
    `Expected line 1 to be DOCTYPE declaration, got: "${lines[0]}"`
  );
});

test('<html lang="en"> tag is still present after the comment', () => {
  assert.ok(
    html.includes('<html lang="en">'),
    'Expected <html lang="en"> to be present'
  );
});

test('document still contains a <head> section', () => {
  assert.ok(html.includes('<head>'), 'Expected <head> section to be present');
});

test('document still contains a <body> tag', () => {
  assert.ok(html.includes('<body>'), 'Expected <body> tag to be present');
});

test('comment does not interrupt the DOCTYPE–html–head sequence', () => {
  // Verify order: DOCTYPE on line 1, comment on line 2, <html> on line 3
  assert.ok(lines[0].trim().toLowerCase().startsWith('<!doctype'), 'Line 1 must be DOCTYPE');
  assert.ok(lines[1].trim() === '<!-- CodeRabbit Review: v1.0 -->', 'Line 2 must be the comment');
  assert.ok(lines[2].trim().startsWith('<html'), `Line 3 must start with <html>, got: "${lines[2]}"`);
});

// --- Version string boundary / regression ---

test('version string is exactly "v1.0" (not truncated or altered)', () => {
  const match = html.match(/<!--\s*CodeRabbit Review:\s*(v[\d.]+)\s*-->/);
  assert.ok(match, 'CodeRabbit comment not found');
  assert.strictEqual(match[1], 'v1.0', `Expected version "v1.0", got "${match[1]}"`);
});

// --- Summary ---

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);