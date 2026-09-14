# Live SEO Baseline: 2026-08-24

## Scope

This is a measurement-only baseline for Issue #22. No SEO implementation, metadata, routing, sitemap, robots, or heading behavior was changed.

Live HTTP evidence, repository-derived observations, lab data, and field data are kept separate below.

## Repository Snapshot

- Repository: `hiroyuki9614/my_profile`
- Branch observed: `feat/post-table-of-contents`
- Current remote `main` SHA: `a794291a7aa01629a0ec0335e1c9651533579edc`
- SHA lookup: `git rev-parse origin/main`; `git ls-remote origin refs/heads/main`
- Deployment provenance: the production response did not expose a deployment commit, so the live response is not independently proven to be served from this SHA.
- Measurement time: 2026-08-24 14:55:54 UTC / 2026-08-24 23:55:54 JST

## Environment and Commands

- Environment: Linux, Node.js project, production requests made from the local agent environment.
- User-Agent: `seo-baseline-measurement/2026-08-24`
- HTTP probe: `curl -sS -L --max-time 30 -A 'seo-baseline-measurement/2026-08-24' -D <headers> -o <body> -w 'http_status=%{http_code} final_url=%{url_effective} redirects=%{num_redirects} content_type=%{content_type} size_download=%{size_download}' <URL>`
- Reproduction script: `node scripts/seo-live-baseline.mjs`
- Initial connectivity probe: `curl -I -L --max-time 20 https://hiroyuki9614.com/`

All requested production URLs were reachable. No Copilot firewall block was observed, so there are no `UNVERIFIED_FIREWALL_BLOCKED` items in this run.

## Live HTTP Measurements

The following values are from production HTTP responses, not repository inference.

| Requested URL | HTTP | Final URL | Redirects | Content-Type | Title | Meta description | Canonical | `og:url` | `og:type` | `og:image` | Robots meta | H1 |
| --- | ---: | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `https://hiroyuki9614.com/` | 200 | same | 0 | `text/html; charset=utf-8` | `プロフィール \| hiroyuki9614` | `hiroyuki9614のプロフィールページです。 経歴やスキル、趣味などを紹介しています。` | `https://hiroyuki9614.com/` | same | `website` | `https://hiroyuki9614.com/_astro/ogp_image.BZMzESih.png` | absent | `profile` |
| `https://hiroyuki9614.com/posts/` | 200 | same | 0 | `text/html; charset=utf-8` | `投稿一覧 \| hiroyuki9614` | `hiroyuki9614のブログ記事一覧ページです。　日記や知識、仕事の内容などを投稿しています。` | `https://hiroyuki9614.com/posts/` | same | `website` | `https://hiroyuki9614.com/_astro/ogp_image.BZMzESih.png` | absent | `blog` |
| `https://hiroyuki9614.com/posts/post_260811` | 200 | `https://hiroyuki9614.com/posts/post_260811/` | 1 | `text/html; charset=utf-8` | `【AI活用】Vaultで知識基盤を作成してみた \| hiroyuki9614` | `ObsidianのVaultを使って個人の知識基盤を作り始めた経験と、終わりのない整理の過程を紹介します。` | final URL | final URL | `article` | `https://hiroyuki9614.com/_astro/ogp_image.BZMzESih.png` | absent | `【AI活用】Vaultで知識基盤を作成してみた` |
| `https://hiroyuki9614.com/posts/categories/%E7%9F%A5%E8%AD%98/` | 200 | same | 0 | `text/html; charset=utf-8` | `知識 \| hiroyuki9614` | `知識のカテゴリが付いた記事一覧` | `https://hiroyuki9614.com/posts/categories/%E7%9F%A5%E8%AD%98/` | same | `website` | `https://hiroyuki9614.com/_astro/ogp_image.BZMzESih.png` | absent | `blog` |
| `https://hiroyuki9614.com/posts/tags/astro/` | 200 | same | 0 | `text/html; charset=utf-8` | `astro \| hiroyuki9614` | `astroのタグが付いた記事一覧` | `https://hiroyuki9614.com/posts/tags/astro/` | same | `website` | `https://hiroyuki9614.com/_astro/ogp_image.BZMzESih.png` | absent | `blog` |
| `https://hiroyuki9614.com/this-url-does-not-exist-20260824/` | 404 | same | 0 | `text/html; charset=utf-8` | `ページが見つかりません \| hiroyuki9614` | `お探しのページは見つかりませんでした。URLが正しいかどうかご確認ください。` | `https://hiroyuki9614.com/404/` | `https://hiroyuki9614.com/404/` | `website` | `https://hiroyuki9614.com/_astro/ogp_image.BZMzESih.png` | absent | `404 Not Found` |

`absent` means no `<meta name="robots">` or equivalent robots meta was found in the live HTML.

## Robots and Sitemap

### `robots.txt`

- URL: `https://hiroyuki9614.com/robots.txt`
- HTTP status: 200
- Final URL: same; redirects: 0
- Content-Type: `text/plain; charset=utf-8`
- Live directives observed:

```text
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CloudflareBrowserRenderingCrawler
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: meta-externalagent
Disallow: /

User-agent: *
Allow: /

Sitemap: https://hiroyuki9614.com/sitemap-index.xml
```

The sitemap declaration matches the requested production sitemap index URL.

### Sitemap index and child sitemap

- `https://hiroyuki9614.com/sitemap-index.xml`: HTTP 200, final URL same, `application/xml`.
- The live index contains `https://hiroyuki9614.com/sitemap-0.xml`.
- `https://hiroyuki9614.com/sitemap-0.xml`: HTTP 200, final URL same, `application/xml`.
- The live child sitemap contains the representative published URL `https://hiroyuki9614.com/posts/post_260811/`.

## Lighthouse and Performance Lab Data

Lighthouse was attempted but could not run in the available environment:

```text
command -v lighthouse || true
npx --no-install lighthouse --version
```

Result: `lighthouse` was not on `PATH`, and `npx --no-install` reported the missing package `lighthouse@13.4.1`. No Lighthouse lab score or LCP, CLS, TBT, or INP-equivalent value is reported. This is an unavailable tool, not a production network failure. No package was installed.

## Field Data

Search Console and CrUX were not accessed. No authenticated primary field data was available in this measurement. Search Console, CrUX, and real-user Core Web Vitals therefore remain `UNVERIFIED` and must not be inferred from the HTTP or repository results above.

## Repository-Derived Observations

These are not live measurements:

- The `origin/main` snapshot contains published content for the representative article `post_260811`, category `知識`, and tag `astro`.
- The repository-level existing SEO score is `86/100`, as stated in Issue #22. It is a separate repository/code and generated-output contract metric, not a live HTTP, Lighthouse, or field-data score.
- The current worktree had unrelated pre-existing modifications in `src/layouts/PostLayout.astro`, `src/pages/posts/[slug].astro`, and `.playwright-mcp/`; they were preserved and are outside this baseline.

## Build Verification

The requested command was first run in the pre-existing worktree:

```text
npm run verify:build
```

That worktree is eight commits behind `origin/main`, and its older `package.json` has no `verify:build` script (`Missing script: "verify:build"`). The existing build command was run there as an additional check:

```text
npm run build
```

Result: PASS (`astro build`, exit status 0).

The required command was then run against the exact `origin/main` SHA `a794291a7aa01629a0ec0335e1c9651533579edc` in a temporary worktree after `npm ci`:

```text
npm run verify:build
```

Result: PASS (exit status 0). The temporary dependency installation and worktree were removed afterward. This baseline change adds only a documentation file and a read-only measurement script; it does not change SEO behavior.

## Verification Status

- Current remote `main` exact SHA fixed: verified.
- Production connection attempted: verified.
- HTML pages, `robots.txt`, sitemap index, sitemap child, and 404 URL measured live: verified.
- `npm run verify:build` on exact current `main`: verified PASS.
- Lighthouse: unavailable because the package is not installed.
- Search Console / CrUX: unverified.
- Firewall block: none observed.
- SEO behavior change in this Issue: none made.
