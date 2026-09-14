import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareWithPeers,
  extractFeatures,
  markupToDocument,
  recommendationsFromComparison,
  sourceKey
} from '../scripts/profile-research/lib.mjs';

test('markupToDocument extracts visible structure', () => {
  const document = markupToDocument(`
    <h1>Frontend Engineer</h1>
    <p>React / TypeScript を使い、5人チームで表示速度を30%改善しました。</p>
    <ul><li>設計</li><li>実装</li></ul>
    <a href="https://github.com/example/project">GitHub</a>
  `);

  assert.deepEqual(document.headings, ['Frontend Engineer']);
  assert.equal(document.listItemCount, 2);
  assert.equal(document.links.length, 1);
  assert.match(document.text, /30%改善/);
});

test('extractFeatures counts evidence, ownership and outcomes', () => {
  const features = extractFeatures({
    text: 'React TypeScript を用いて設計から実装まで担当。5人チームで処理時間を30%改善し、自動化した。GitHubで公開。',
    headings: ['Frontend Engineer', 'Projects'],
    links: ['https://github.com/example/project'],
    listItemCount: 2
  }, { sourceType: 'fixture' });

  assert.ok(features.techCount >= 2);
  assert.ok(features.metricCount >= 2);
  assert.ok(features.impactMetricCount >= 1);
  assert.ok(features.ownershipTermCount >= 2);
  assert.ok(features.outcomeTermCount >= 2);
  assert.ok(features.score.total > 0);
});

test('comparison produces actionable recommendations for a weak target', () => {
  const target = extractFeatures({ text: 'Webエンジニアです。', headings: ['Profile'], links: [], listItemCount: 0 });
  const peer = extractFeatures({
    text: 'React TypeScript の案件を設計・実装。10人チームで工数を40%削減しGitHubで公開。',
    headings: ['Profile', 'Projects', 'Results', 'Skills'],
    links: ['https://github.com/example/project'],
    listItemCount: 4
  });
  const comparison = compareWithPeers(target, [peer]);
  const recommendations = recommendationsFromComparison(target, comparison);

  assert.equal(comparison.peerCount, 1);
  assert.ok(recommendations.length >= 3);
});

test('sourceKey is stable and pseudonymous', () => {
  const first = sourceKey('github', 'https://github.com/example');
  const second = sourceKey('github', 'https://github.com/example');
  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{12}$/);
});
