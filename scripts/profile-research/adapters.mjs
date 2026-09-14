import { Buffer } from 'node:buffer';
import { extractFeatures, markupToDocument, sourceKey } from './lib.mjs';

const USER_AGENT = 'my-profile-research/0.1 (+https://github.com/hiroyuki9614/my_profile)';

function headers(extra = {}) {
  const value = { 'User-Agent': USER_AGENT, ...extra };
  if (process.env.GITHUB_TOKEN) value.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return value;
}

async function requestJson(url, extraHeaders = {}) {
  const response = await fetch(url, { headers: headers({ Accept: 'application/json', ...extraHeaders }) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function requestText(url, extraHeaders = {}) {
  const response = await fetch(url, { headers: headers(extraHeaders) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

function sanitizePeer(type, stableValue, document, originHost) {
  const features = extractFeatures(document, { sourceType: type });
  return {
    sourceKey: sourceKey(type, stableValue),
    sourceType: type,
    originHost,
    ...features
  };
}

function plainDocument(text, links = [], headings = []) {
  return { text: text ?? '', links: links.filter(Boolean), headings, listItemCount: 0 };
}

async function githubProfileReadme(login) {
  const url = `https://api.github.com/repos/${encodeURIComponent(login)}/${encodeURIComponent(login)}/readme`;
  const response = await fetch(url, { headers: headers({ Accept: 'application/vnd.github+json' }) });
  if (response.status === 404) return '';
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const body = await response.json();
  if (body.encoding !== 'base64' || !body.content) return '';
  return Buffer.from(body.content.replace(/\n/g, ''), 'base64').toString('utf8');
}

async function githubRepositoryReadme(owner, repo) {
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
  const response = await fetch(url, { headers: headers({ Accept: 'application/vnd.github+json' }) });
  if (response.status === 404) return '';
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const body = await response.json();
  if (body.encoding !== 'base64' || !body.content) return '';
  return Buffer.from(body.content.replace(/\n/g, ''), 'base64').toString('utf8');
}

export async function collectGithubUser(source) {
  const login = source.user;
  const user = await requestJson(`https://api.github.com/users/${encodeURIComponent(login)}`, {
    Accept: 'application/vnd.github+json'
  });
  const [profileReadme, portfolioReadme] = await Promise.all([
    githubProfileReadme(login),
    source.repository ? githubRepositoryReadme(login, source.repository) : Promise.resolve('')
  ]);
  const text = [user.bio, user.company, profileReadme, portfolioReadme].filter(Boolean).join('\n');
  const links = [user.html_url, user.blog].filter(Boolean);
  const headings = [...profileReadme.matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => match[1]);
  return sanitizePeer('github', `https://github.com/${login}`, plainDocument(text, links, headings), 'github.com');
}

export async function discoverGithub(config) {
  if (!config.enabled) return [];
  const limit = Math.max(1, Math.min(config.limit ?? 12, 50));
  const query = encodeURIComponent(config.query ?? 'portfolio in:name language:TypeScript stars:1..200');
  const result = await requestJson(`https://api.github.com/search/repositories?q=${query}&sort=updated&order=desc&per_page=${limit}`, {
    Accept: 'application/vnd.github+json'
  });
  const seen = new Set();
  const sources = [];
  for (const repo of result.items ?? []) {
    const login = repo.owner?.login;
    if (!login || seen.has(login) || repo.owner?.type !== 'User') continue;
    seen.add(login);
    sources.push({ type: 'github', user: login, repository: repo.name, discovered: true });
  }
  return sources;
}

export async function collectQiitaUser(source) {
  const id = source.user;
  const [user, items] = await Promise.all([
    requestJson(`https://qiita.com/api/v2/users/${encodeURIComponent(id)}`),
    requestJson(`https://qiita.com/api/v2/users/${encodeURIComponent(id)}/items?page=1&per_page=20`)
  ]);
  const titles = items.map((item) => item.title).filter(Boolean);
  const text = [user.description, ...titles].filter(Boolean).join('\n');
  const links = [user.website_url, user.github_login_name ? `https://github.com/${user.github_login_name}` : null].filter(Boolean);
  return sanitizePeer('qiita', `https://qiita.com/${id}`, plainDocument(text, links, titles.slice(0, 8)), 'qiita.com');
}

export async function discoverQiita(config) {
  if (!config.enabled) return [];
  const limit = Math.max(1, Math.min(config.limit ?? 10, 50));
  const query = encodeURIComponent(config.query ?? 'tag:React');
  const items = await requestJson(`https://qiita.com/api/v2/items?page=1&per_page=${limit}&query=${query}`);
  const seen = new Set();
  const sources = [];
  for (const item of items) {
    const id = item.user?.id;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    sources.push({ type: 'qiita', user: id, discovered: true });
  }
  return sources;
}

function feedText(xml) {
  const items = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  const titles = items.map((item) => item.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '').filter(Boolean);
  const descriptions = items.map((item) => item.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ?? '').filter(Boolean);
  return {
    titles,
    text: [...titles, ...descriptions].join('\n')
  };
}

export async function collectZennUser(source) {
  const user = source.user;
  const xml = await requestText(`https://zenn.dev/${encodeURIComponent(user)}/feed?all=1`, { Accept: 'application/rss+xml,text/xml' });
  const feed = feedText(xml);
  return sanitizePeer(
    'zenn',
    `https://zenn.dev/${user}`,
    plainDocument(feed.text, [`https://zenn.dev/${user}`], feed.titles.slice(0, 8)),
    'zenn.dev'
  );
}

function robotsAllows(robotsText, pathname) {
  const lines = robotsText.split(/\r?\n/).map((line) => line.replace(/#.*/, '').trim()).filter(Boolean);
  let applies = false;
  const disallows = [];
  for (const line of lines) {
    const [rawKey, ...rest] = line.split(':');
    const key = rawKey.toLowerCase();
    const value = rest.join(':').trim();
    if (key === 'user-agent') {
      applies = value === '*';
      continue;
    }
    if (applies && key === 'disallow' && value) disallows.push(value);
  }
  return !disallows.some((path) => pathname.startsWith(path));
}

async function genericRobotsAllowed(url) {
  const target = new URL(url);
  const robotsUrl = `${target.origin}/robots.txt`;
  const response = await fetch(robotsUrl, { headers: headers({ Accept: 'text/plain' }) });
  if (response.status === 404) return true;
  if (!response.ok) return false;
  return robotsAllows(await response.text(), target.pathname || '/');
}

export async function collectPortfolio(source) {
  if (!source.termsConfirmed) {
    throw new Error('generic portfolio requires termsConfirmed=true');
  }
  if (!(await genericRobotsAllowed(source.url))) {
    throw new Error(`robots.txt disallows or could not confirm access: ${source.url}`);
  }
  const html = await requestText(source.url, { Accept: 'text/html,application/xhtml+xml' });
  const url = new URL(source.url);
  return sanitizePeer('portfolio', source.url, markupToDocument(html), url.hostname);
}

export async function collectSource(source) {
  if (source.type === 'github') return collectGithubUser(source);
  if (source.type === 'qiita') return collectQiitaUser(source);
  if (source.type === 'zenn') return collectZennUser(source);
  if (source.type === 'portfolio') return collectPortfolio(source);
  throw new Error(`unsupported source type: ${source.type}`);
}

export async function discoverSources(discovery = {}) {
  const groups = await Promise.all([
    ...(discovery.github ?? []).map(discoverGithub),
    ...(discovery.qiita ?? []).map(discoverQiita)
  ]);
  return groups.flat();
}
