const urls = [
	'https://hiroyuki9614.com/',
	'https://hiroyuki9614.com/posts/',
	'https://hiroyuki9614.com/posts/post_260811',
	'https://hiroyuki9614.com/posts/categories/%E7%9F%A5%E8%AD%98/',
	'https://hiroyuki9614.com/posts/tags/astro/',
	'https://hiroyuki9614.com/robots.txt',
	'https://hiroyuki9614.com/sitemap-index.xml',
	'https://hiroyuki9614.com/sitemap-0.xml',
	'https://hiroyuki9614.com/this-url-does-not-exist-20260824/',
];

const requestHeaders = {
	'user-agent': 'seo-baseline-measurement/2026-08-24',
};

const decodeHtml = (value) =>
	value
		.replace(/&#39;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/<[^>]+>/g, '')
		.replace(/\s+/g, ' ')
		.trim();

const getAttribute = (tag, name) => {
	const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
	return match ? decodeHtml(match[1]) : null;
};

const getMetadata = (body) => {
	const metaTags = [...body.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
	const getMeta = (key) => {
		const tag = metaTags.find(
			(item) =>
				getAttribute(item, 'name')?.toLowerCase() === key ||
				getAttribute(item, 'property')?.toLowerCase() === key,
		);
		return tag ? getAttribute(tag, 'content') : null;
	};
	const canonicalTag = [...body.matchAll(/<link\b[^>]*>/gi)]
		.map((match) => match[0])
		.find((item) => (getAttribute(item, 'rel') || '').toLowerCase().split(/\s+/).includes('canonical'));
	const h1 = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => decodeHtml(match[1]));
	const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

	return {
		title: titleMatch ? decodeHtml(titleMatch[1]) : null,
		meta_description: getMeta('description'),
		canonical: canonicalTag ? getAttribute(canonicalTag, 'href') : null,
		og_url: getMeta('og:url'),
		og_type: getMeta('og:type'),
		og_image: getMeta('og:image'),
		robots_meta: getMeta('robots'),
		h1,
		h1_count: h1.length,
	};
};

const fetchWithRedirects = async (requestedUrl) => {
	let currentUrl = requestedUrl;
	let redirectCount = 0;

	for (;;) {
		const response = await fetch(currentUrl, {
			headers: requestHeaders,
			redirect: 'manual',
			signal: AbortSignal.timeout(30_000),
		});
		const location = response.headers.get('location');
		if (response.status >= 300 && response.status < 400 && location) {
			currentUrl = new URL(location, currentUrl).href;
			redirectCount += 1;
			continue;
		}

		const body = await response.text();
		const result = {
			requested_url: requestedUrl,
			status: response.status,
			final_url: currentUrl,
			redirect_count: redirectCount,
			content_type: response.headers.get('content-type'),
			...(currentUrl.endsWith('.txt') || currentUrl.endsWith('.xml') ? { body_text: body } : getMetadata(body)),
		};
		if (requestedUrl.endsWith('/sitemap-0.xml')) {
			result.sitemap_includes_post_260811 = body.includes('https://hiroyuki9614.com/posts/post_260811/');
		}
		return result;
	}
};

for (const url of urls) {
	try {
		console.log(JSON.stringify(await fetchWithRedirects(url)));
	} catch (error) {
		console.log(
			JSON.stringify({
				requested_url: url,
				error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
			}),
		);
	}
}