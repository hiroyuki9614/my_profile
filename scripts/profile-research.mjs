import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectSource, discoverSources } from './profile-research/adapters.mjs';
import {
  compareWithPeers,
  extractFeatures,
  markupToDocument,
  recommendationsFromComparison,
  renderReport
} from './profile-research/lib.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const configPath = resolve(root, process.env.PROFILE_RESEARCH_CONFIG ?? 'profile-research/sources.json');
const targetPath = resolve(root, process.env.PROFILE_RESEARCH_TARGET ?? 'src/pages/index.astro');
const outputDir = resolve(root, process.env.PROFILE_RESEARCH_OUTPUT ?? 'artifacts/profile-research');
const maxSources = Math.max(1, Number.parseInt(process.env.PROFILE_RESEARCH_MAX_SOURCES ?? '30', 10));

async function loadJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

function sourceIdentity(source) {
  if (source.type === 'github' || source.type === 'qiita' || source.type === 'zenn') return `${source.type}:${source.user}`;
  if (source.type === 'portfolio') return `${source.type}:${source.url}`;
  return JSON.stringify(source);
}

function dedupeSources(sources) {
  const seen = new Set();
  return sources.filter((source) => {
    const key = sourceIdentity(source);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function privacySafePeer(peer) {
  const { headline: _headline, ...safe } = peer;
  return safe;
}

async function main() {
  const [config, targetMarkup] = await Promise.all([loadJson(configPath), readFile(targetPath, 'utf8')]);
  const target = extractFeatures(markupToDocument(targetMarkup), { sourceType: 'my_profile' });

  const discovered = await discoverSources(config.discovery ?? {});
  const manual = (config.manual ?? []).filter((source) => source.enabled !== false);
  const candidates = dedupeSources([...manual, ...discovered]).slice(0, maxSources);

  const collectedPeers = [];
  const errors = [];
  for (const source of candidates) {
    try {
      collectedPeers.push(await collectSource(source));
    } catch (error) {
      const type = source.type ?? 'unknown';
      errors.push(`${type}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (!collectedPeers.length) {
    throw new Error('比較対象を1件も収集できませんでした。設定またはネットワークを確認してください。');
  }

  const peers = collectedPeers.map(privacySafePeer);
  const comparison = compareWithPeers(target, peers);
  const recommendations = recommendationsFromComparison(target, comparison);
  const generatedAt = new Date().toISOString();
  const payload = {
    schemaVersion: 1,
    generatedAt,
    target,
    peers,
    comparison,
    recommendations,
    errors
  };

  await mkdir(outputDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(outputDir, 'latest.json'), `${JSON.stringify(payload, null, 2)}\n`, 'utf8'),
    writeFile(resolve(outputDir, 'latest.md'), renderReport(payload), 'utf8')
  ]);

  console.log(`profile research complete: peers=${peers.length}, errors=${errors.length}`);
  console.log(`report: ${resolve(outputDir, 'latest.md')}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
