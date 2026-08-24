import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = 'https://hiroyuki9614.com';
const dist = new URL('../dist/', import.meta.url);
const distPath = fileURLToPath(dist);

function read(relativePath) {
	return readFileSync(new URL(relativePath, dist), 'utf8');
}

function getMeta(html, property) {
	const match = html.match(new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]*)"`));
	return match?.[1];
}

function getCanonical(html) {
	return html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
}

function assert(condition, message) {
	if (!condition) throw new Error(message);
}

function collectHtml(directory) {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		return entry.isDirectory() ? collectHtml(path) : entry.name.endsWith('.html') ? [path] : [];
	});
}

const htmlFiles = collectHtml(distPath);
for (const file of htmlFiles) {
	const html = readFileSync(file, 'utf8');
	assert((html.match(/<link rel="canonical"/g) ?? []).length === 1, `${file} must have one canonical link`);
	assert(getCanonical(html)?.startsWith(site), `${file} canonical must be absolute`);
	assert(getMeta(html, 'og:url') === getCanonical(html), `${file} og:url must match canonical`);
	assert(getMeta(html, 'og:image')?.startsWith(site), `${file} og:image must be absolute`);
}

const home = read('index.html');
assert(getCanonical(home) === `${site}/`, 'home canonical is incorrect');
assert(getMeta(home, 'og:type') === 'website', 'home og:type is incorrect');

const postsIndex = read('posts/index.html');
assert(getCanonical(postsIndex) === `${site}/posts/`, 'posts index canonical is incorrect');
assert(getMeta(postsIndex, 'og:type') === 'website', 'posts index og:type is incorrect');

const postWithImage = read('posts/post_260529/index.html');
assert(getMeta(postWithImage, 'og:type') === 'article', 'article og:type is incorrect');
assert(getMeta(postWithImage, 'og:title')?.includes('佐々木尽'), 'article title is not article-specific');
assert(getMeta(postWithImage, 'og:description')?.includes('佐々木尽選手'), 'article description is not article-specific');
assert(getMeta(postWithImage, 'og:image') === `${site}/blog/260529/01.png`, 'article image is incorrect');

const postWithoutImage = read('posts/post_260530/index.html');
assert(getMeta(postWithoutImage, 'og:type') === 'article', 'second article og:type is incorrect');
assert(getMeta(postWithoutImage, 'og:title')?.includes('Codex'), 'second article title is not article-specific');
assert(getMeta(postWithoutImage, 'og:image')?.includes('/_astro/ogp_image.'), 'default article image is incorrect');

assert(!statSync(new URL('../dist/posts/post_260517/index.html', import.meta.url), { throwIfNoEntry: false }), 'unpublished post was generated');
assert(!statSync(new URL('../dist/posts/post_260602＿＿＿＿＿/index.html', import.meta.url), { throwIfNoEntry: false }), 'unpublished post was generated');

const sitemap = readdirSync(new URL('../dist/', import.meta.url))
	.filter((file) => file.startsWith('sitemap-') && file.endsWith('.xml'))
	.map((file) => read(file))
	.join('\n');
assert(!sitemap.includes('/posts/post_260517/'), 'unpublished post was added to sitemap');
assert(!/\/posts\/post_260602(?:%EF%BC%BF)+\//.test(sitemap), 'unpublished post was added to sitemap');

console.log(`Verified ${htmlFiles.length} HTML files, canonical/OGP metadata, and published-only post generation.`);
