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

function getJsonLd(html, type) {
	const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
	return scripts.map((match) => JSON.parse(match[1])).find((item) => item['@type'] === type);
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
const websiteStructuredData = getJsonLd(home, 'WebSite');
assert(websiteStructuredData?.['@context'] === 'https://schema.org', 'home WebSite context is incorrect');
assert(websiteStructuredData?.url === `${site}/`, 'home WebSite URL is incorrect');
assert(websiteStructuredData?.name === 'hiroyuki9614', 'home WebSite name is incorrect');

const postsIndex = read('posts/index.html');
assert(getCanonical(postsIndex) === `${site}/posts/`, 'posts index canonical is incorrect');
assert(getMeta(postsIndex, 'og:type') === 'website', 'posts index og:type is incorrect');

const postWithImage = read('posts/post_260529/index.html');
assert(getMeta(postWithImage, 'og:type') === 'article', 'article og:type is incorrect');
assert(getMeta(postWithImage, 'og:title')?.includes('佐々木尽'), 'article title is not article-specific');
assert(getMeta(postWithImage, 'og:description')?.includes('佐々木尽選手'), 'article description is not article-specific');
assert(getMeta(postWithImage, 'og:image') === `${site}/blog/260529/01.png`, 'article image is incorrect');
const blogPostingWithImage = getJsonLd(postWithImage, 'BlogPosting');
assert(blogPostingWithImage?.headline?.includes('佐々木尽'), 'BlogPosting headline is not article-specific');
assert(blogPostingWithImage?.description?.includes('佐々木尽選手'), 'BlogPosting description is not article-specific');
assert(blogPostingWithImage?.datePublished === '2026-05-28T00:00:00.000Z', 'BlogPosting datePublished is incorrect');
assert(blogPostingWithImage?.author?.['@type'] === 'Person', 'BlogPosting author type is incorrect');
assert(blogPostingWithImage?.author?.name === 'hiroyuki9614', 'BlogPosting author name is incorrect');
assert(blogPostingWithImage?.mainEntityOfPage?.['@id'] === `${site}/posts/post_260529/`, 'BlogPosting mainEntityOfPage is incorrect');
assert(blogPostingWithImage?.url === `${site}/posts/post_260529/`, 'BlogPosting URL is incorrect');
assert(blogPostingWithImage?.image === `${site}/blog/260529/01.png`, 'BlogPosting image is incorrect');

const postWithoutImage = read('posts/post_260530/index.html');
assert(getMeta(postWithoutImage, 'og:type') === 'article', 'second article og:type is incorrect');
assert(getMeta(postWithoutImage, 'og:title')?.includes('Codex'), 'second article title is not article-specific');
assert(getMeta(postWithoutImage, 'og:image')?.includes('/_astro/ogp_image.'), 'default article image is incorrect');
const blogPostingWithoutImage = getJsonLd(postWithoutImage, 'BlogPosting');
assert(blogPostingWithoutImage?.url === `${site}/posts/post_260530/`, 'second BlogPosting URL is incorrect');
assert(!('image' in blogPostingWithoutImage), 'second BlogPosting must omit absent article image');

assert(!statSync(new URL('../dist/posts/post_260517/index.html', import.meta.url), { throwIfNoEntry: false }), 'unpublished post was generated');
assert(!statSync(new URL('../dist/posts/post_260602＿＿＿＿＿/index.html', import.meta.url), { throwIfNoEntry: false }), 'unpublished post was generated');

const sitemap = readdirSync(new URL('../dist/', import.meta.url))
	.filter((file) => file.startsWith('sitemap-') && file.endsWith('.xml'))
	.map((file) => read(file))
	.join('\n');
assert(!sitemap.includes('/posts/post_260517/'), 'unpublished post was added to sitemap');
assert(!/\/posts\/post_260602(?:%EF%BC%BF)+\//.test(sitemap), 'unpublished post was added to sitemap');

console.log(`Verified ${htmlFiles.length} HTML files, canonical/OGP metadata, and published-only post generation.`);
