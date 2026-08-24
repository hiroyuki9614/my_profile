import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(readFileSync(new URL('../.agents/shared-assets.json', import.meta.url), 'utf8'));

function gitBlobSha(content) {
  const bytes = Buffer.from(content);
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

let failed = false;

for (const asset of manifest.assets) {
  const content = readFileSync(new URL(`../${asset.target}`, import.meta.url));
  const actual = gitBlobSha(content);
  const ok = actual === asset.source_blob_sha;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${asset.target} ${actual}`);
  if (!ok) {
    console.error(`  expected upstream blob: ${asset.source_blob_sha}`);
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log(`Verified ${manifest.assets.length} Personal Vault shared agent assets.`);
}
