export const DEFAULT_TARGET_COUNT = 1000;

export function createEmptyStore(targetCount = DEFAULT_TARGET_COUNT) {
  return {
    schemaVersion: 1,
    targetCount,
    updatedAt: null,
    stoppedAt: null,
    discoveryCursors: {},
    samples: []
  };
}

export function normalizeStore(input, targetCount = DEFAULT_TARGET_COUNT) {
  const store = input && typeof input === 'object' ? input : {};
  return {
    schemaVersion: 1,
    targetCount,
    updatedAt: store.updatedAt ?? null,
    stoppedAt: store.stoppedAt ?? null,
    discoveryCursors: store.discoveryCursors && typeof store.discoveryCursors === 'object' ? store.discoveryCursors : {},
    samples: Array.isArray(store.samples) ? store.samples.slice(0, targetCount) : []
  };
}

export function isTargetReached(store, targetCount = store.targetCount ?? DEFAULT_TARGET_COUNT) {
  return store.samples.length >= targetCount;
}

function roleFromTech(techTerms = []) {
  const values = new Set(techTerms.map((value) => value.toLowerCase()));
  const frontend = ['javascript', 'typescript', 'react', 'next.js', 'astro', 'vue', 'nuxt', 'svelte', 'tailwind'];
  const backend = ['php', 'laravel', 'python', 'ruby', 'rails', 'go', 'hono', 'node.js', 'postgresql', 'mysql', 'supabase'];
  const hasFrontend = frontend.some((value) => values.has(value));
  const hasBackend = backend.some((value) => values.has(value));
  if (hasFrontend && hasBackend) return 'fullstack';
  if (hasFrontend) return 'frontend';
  if (hasBackend) return 'backend';
  return 'other';
}

function careerLevel(experienceYears) {
  if (!Number.isFinite(experienceYears)) return 'unknown';
  if (experienceYears <= 2) return 'junior';
  if (experienceYears <= 5) return 'mid';
  return 'senior';
}

export function toStoredSample(peer, collectedAt = new Date().toISOString()) {
  const { headline: _headline, ...safe } = peer;
  return {
    ...safe,
    cohort: {
      role: roleFromTech(peer.techTerms),
      careerLevel: careerLevel(peer.experienceYears),
      sourceType: peer.sourceType
    },
    firstSeenAt: collectedAt,
    lastSeenAt: collectedAt
  };
}

export function mergeSamples(store, peers, targetCount = store.targetCount ?? DEFAULT_TARGET_COUNT, collectedAt = new Date().toISOString()) {
  const byKey = new Map(store.samples.map((sample) => [sample.sourceKey, sample]));
  let added = 0;
  let refreshed = 0;

  for (const peer of peers) {
    const existing = byKey.get(peer.sourceKey);
    if (existing) {
      byKey.set(peer.sourceKey, {
        ...existing,
        ...toStoredSample(peer, collectedAt),
        firstSeenAt: existing.firstSeenAt ?? collectedAt,
        lastSeenAt: collectedAt
      });
      refreshed += 1;
      continue;
    }
    if (byKey.size >= targetCount) break;
    byKey.set(peer.sourceKey, toStoredSample(peer, collectedAt));
    added += 1;
  }

  const samples = [...byKey.values()].slice(0, targetCount);
  return {
    store: {
      ...store,
      targetCount,
      updatedAt: collectedAt,
      stoppedAt: samples.length >= targetCount ? (store.stoppedAt ?? collectedAt) : null,
      samples
    },
    added,
    refreshed
  };
}

export function selectNewCandidates(candidates, storedSamples, maxSources, qiitaBudget = 10) {
  const existing = new Set(storedSamples.map((sample) => sample.sourceKey));
  const selected = [];
  let qiitaUsed = 0;

  for (const candidate of candidates) {
    if (selected.length >= maxSources) break;
    if (candidate.sourceKeyHint && existing.has(candidate.sourceKeyHint)) continue;
    if (candidate.type === 'qiita') {
      if (qiitaUsed >= qiitaBudget) continue;
      qiitaUsed += 1;
    }
    selected.push(candidate);
  }
  return selected;
}
