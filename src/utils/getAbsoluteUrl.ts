export function getAbsoluteUrl(value: string | URL | undefined, site: URL | undefined, fallback = '/'): string {
	const rawValue = value instanceof URL ? value.href : value?.trim() || fallback;

	if (/^[a-z][a-z\d+.-]*:/i.test(rawValue)) {
		return rawValue;
	}
	if (rawValue.startsWith('//')) {
		return site ? new URL(rawValue, site).href : rawValue;
	}

	const path = rawValue.startsWith('/') ? rawValue : `/${rawValue}`;
	return site ? new URL(path, site).href : path;
}
