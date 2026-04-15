/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly DB_PASSWORD: string;
	readonly PUBLIC_POKEAPI: string;
	readonly PUBLIC_API_KEY: string;
	readonly ROOT_PATH: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
