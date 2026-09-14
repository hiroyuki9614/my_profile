import { createHash } from 'node:crypto';

const TECH_TERMS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Astro', 'Vue', 'Nuxt', 'Svelte',
  'PHP', 'Laravel', 'WordPress', 'Python', 'Ruby', 'Rails', 'Go', 'Hono', 'Node.js',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Supabase', 'PostgreSQL', 'MySQL',
  'Playwright', 'Vitest', 'Jest', 'CI/CD', 'GitHub Actions', 'Tailwind', 'Figma'
];

const OWNERSHIP_TERMS = [
  '担当', '設計', '実装', '主導', '提案', '導入', '改善', '構築', '運用', '保守', '見積',
  'リード', 'リーダー', '要件定義', 'レビュー', '教育', 'メンター',
  'owned', 'led', 'designed', 'implemented', 'built', 'launched', 'maintained'
];

const OUTCOME_TERMS = [
  '改善', '削減', '短縮', '向上', '増加', '高速化', '自動化', '効率化', '安定化', '解消',
  'improved', 'reduced', 'increased', 'automated', 'optimized', 'saved'
];

const PROJECT_TERMS = [
  '案件', 'プロジェクト', '個人開発', '業務', 'チーム', 'ユーザー', '顧客', 'サービス',
  'project', 'product', 'team', 'client', 'customer', 'service'
];

const EVIDENCE_TERMS = [
  'GitHub', 'デモ', '公開', 'リポジトリ', 'ポートフォリオ', '記事', '登壇', 'OSS',
  'demo', 'repository', 'portfolio', 'article', 'speaker', 'open source'
];

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)));
}

function stripTags(value) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export function markupToDocument(markup) {
  const withoutFrontmatter = markup.replace(/^---[\s\S]*?---\s*/m, '');
  const withoutNoise = withoutFrontmatter
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/\{[^{}]{0,300}\}/g, ' ');

  const headings = [...withoutNoise.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
  const links = [...withoutNoise.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1]);
  const listItemCount = [...withoutNoise.matchAll(/<li\b/gi)].length;
  const text = stripTags(withoutNoise);

  return { text, headings, links, listItemCount };
}

function countTerms(text, terms) {
  const lower = text.toLowerCase();
  return terms.reduce((sum, term) => sum + (lower.includes(term.toLowerCase()) ? 1 : 0), 0);
}

function uniqueTechTerms(text) {
  const lower = text.toLowerCase();
  return TECH_TERMS.filter((term) => lower.includes(term.toLowerCase()));
}

function countMetrics(text) {
  const patterns = [
    /\d+(?:\.\d+)?\s*%/g,
    /\d+(?:\.\d+)?\s*(?:倍|x)\b/gi,
    /\d[\d,]*(?:\.\d+)?\s*(?:件|人|名|社|PV|UU|ms|秒|分|時間|日|週間|週|ヶ月|か月|年|万円|円|台|GB|MB)/gi
  ];
  return patterns.reduce((sum, pattern) => sum + (text.match(pattern)?.length ?? 0), 0);
}

function countImpactMetrics(text) {
  const patterns = [
    /\d+(?:\.\d+)?\s*%/g,
    /\d+(?:\.\d+)?\s*(?:倍|x)\b/gi,
    /(?:削減|短縮|向上|増加|改善|高速化)[^。\n]{0,24}\d+/g,
    /\d+[^。\n]{0,24}(?:削減|短縮|向上|増加|改善|高速化)/g
  ];
  return patterns.reduce((sum, pattern) => sum + (text.match(pattern)?.length ?? 0), 0);
}

function scoreFeatures(features) {
  const clarity = Math.min(25,
    Math.min(features.headingCount, 5) * 2 +
    Math.min(features.techCount, 6) * 2 +
    (features.textLength >= 180 ? 5 : 1)
  );
  const evidence = Math.min(25,
    features.metricCount * 2 +
    Math.min(features.externalLinkCount, 4) * 3 +
    features.evidenceTermCount * 2
  );
  const ownership = Math.min(25,
    features.ownershipTermCount * 3 + Math.min(features.projectTermCount, 5) * 2
  );
  const outcomes = Math.min(25,
    features.outcomeTermCount * 3 + features.impactMetricCount * 4
  );
  return { clarity, evidence, ownership, outcomes, total: clarity + evidence + ownership + outcomes };
}

export function extractFeatures(document, metadata = {}) {
  const text = (document.text ?? '').replace(/\s+/g, ' ').trim();
  const links = document.links ?? [];
  const externalLinkCount = links.filter((link) => /^https?:\/\//i.test(link)).length;
  const techTerms = uniqueTechTerms(text);
  const features = {
    headline: (document.headings?.[0] ?? text.slice(0, 100)).trim(),
    textLength: text.length,
    headingCount: document.headings?.length ?? 0,
    listItemCount: document.listItemCount ?? 0,
    externalLinkCount,
    techCount: techTerms.length,
    techTerms,
    metricCount: countMetrics(text),
    impactMetricCount: countImpactMetrics(text),
    ownershipTermCount: countTerms(text, OWNERSHIP_TERMS),
    outcomeTermCount: countTerms(text, OUTCOME_TERMS),
    projectTermCount: countTerms(text, PROJECT_TERMS),
    evidenceTermCount: countTerms(text, EVIDENCE_TERMS),
    hasPortfolioLink: links.some((link) => /portfolio|works|projects|github\.com/i.test(link)),
    sourceType: metadata.sourceType ?? 'unknown'
  };
  return { ...features, score: scoreFeatures(features) };
}

export function sourceKey(type, stableValue) {
  return createHash('sha256').update(`${type}:${stableValue}`).digest('hex').slice(0, 12);
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function compareWithPeers(target, peers) {
  const fields = [
    'headingCount', 'externalLinkCount', 'techCount', 'metricCount', 'impactMetricCount',
    'ownershipTermCount', 'outcomeTermCount', 'evidenceTermCount'
  ];
  const averages = Object.fromEntries(fields.map((field) => [field, average(peers.map((peer) => peer[field] ?? 0))]));
  const scoreAverages = Object.fromEntries(
    ['clarity', 'evidence', 'ownership', 'outcomes', 'total'].map((field) => [field, average(peers.map((peer) => peer.score?.[field] ?? 0))])
  );
  const gaps = Object.fromEntries(fields.map((field) => [field, (target[field] ?? 0) - averages[field]]));
  return { peerCount: peers.length, averages, scoreAverages, gaps };
}

export function recommendationsFromComparison(target, comparison) {
  const recommendations = [];
  if (target.metricCount < Math.max(2, comparison.averages.metricCount)) {
    recommendations.push('案件説明に規模・件数・時間・改善率などの数値を追加する。');
  }
  if (target.impactMetricCount < Math.max(1, comparison.averages.impactMetricCount)) {
    recommendations.push('「何をしたか」だけでなく、Before→After の効果を数値で示す。');
  }
  if (target.externalLinkCount < comparison.averages.externalLinkCount) {
    recommendations.push('GitHub・公開成果物・技術記事への証拠リンクをプロフィール本文から直接たどれるようにする。');
  }
  if (target.ownershipTermCount < comparison.averages.ownershipTermCount) {
    recommendations.push('「参加」より「設計した・導入した・改善した・主導した」のように自分の責任範囲を明記する。');
  }
  if (target.outcomeTermCount < comparison.averages.outcomeTermCount) {
    recommendations.push('実装内容とセットで、保守性・速度・工数・品質など何が改善したかを書く。');
  }
  if (target.headingCount < 4) {
    recommendations.push('採用担当が短時間で読めるよう、役割・実績・得意領域・主要案件を見出しで分離する。');
  }
  return recommendations;
}

export function renderReport({ generatedAt, target, peers, errors, comparison, recommendations }) {
  const rows = [
    ['総合スコア', target.score.total, comparison.scoreAverages.total],
    ['明瞭さ', target.score.clarity, comparison.scoreAverages.clarity],
    ['証拠', target.score.evidence, comparison.scoreAverages.evidence],
    ['責任範囲', target.score.ownership, comparison.scoreAverages.ownership],
    ['成果', target.score.outcomes, comparison.scoreAverages.outcomes],
    ['数値表現', target.metricCount, comparison.averages.metricCount],
    ['成果数値', target.impactMetricCount, comparison.averages.impactMetricCount],
    ['外部リンク', target.externalLinkCount, comparison.averages.externalLinkCount]
  ];
  const sourceCounts = peers.reduce((acc, peer) => {
    acc[peer.sourceType] = (acc[peer.sourceType] ?? 0) + 1;
    return acc;
  }, {});

  return [
    '# Profile Research Benchmark',
    '',
    `生成日時: ${generatedAt}`,
    `比較対象: ${peers.length}件`,
    '',
    '## 収集内訳',
    '',
    ...Object.entries(sourceCounts).map(([type, count]) => `- ${type}: ${count}件`),
    '',
    '## my_profile と比較対象の平均',
    '',
    '| 指標 | my_profile | 比較平均 |',
    '| --- | ---: | ---: |',
    ...rows.map(([label, own, peer]) => `| ${label} | ${Number(own).toFixed(1)} | ${Number(peer).toFixed(1)} |`),
    '',
    '## 改善候補',
    '',
    ...(recommendations.length ? recommendations.map((item) => `- ${item}`) : ['- 現時点では大きな不足は検出されませんでした。']),
    '',
    '## 注意',
    '',
    '- このスコアは採用通過率ではなく、プロフィール上の「見せ方・証拠・責任範囲・成果表現」の豊富さを比較するための指標です。',
    '- 外部ページ本文は保存せず、特徴量のみ保存します。',
    '- LinkedIn / Wantedly は自動収集対象にしません。',
    ...(errors.length ? ['', '## 収集エラー', '', ...errors.map((error) => `- ${error}`)] : []),
    ''
  ].join('\n');
}
