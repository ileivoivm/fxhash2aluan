#!/usr/bin/env node
/**
 * Generate whitehash-token-index@1 JSON for curated sample tokens.
 */
import { mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'indexes', 'tokens')

/** Keep in sync with sampleToken entries in src/data/projects.ts */
const SAMPLES = [
  {
    slug: 'chaos-research',
    iteration: 6,
    contract: 'KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE',
    tokenId: '269704',
  },
  {
    slug: 'chaos-memory',
    iteration: 106,
    contract: 'KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi',
    tokenId: '600560',
  },
]

const bin = join(root, 'node_modules', '@whitehash', 'archive', 'dist', 'index.js')

mkdirSync(outDir, { recursive: true })

let failed = 0
for (const sample of SAMPLES) {
  const out = join(outDir, `${sample.slug}-${sample.iteration}.json`)
  console.log(`\n→ token ${sample.contract} ${sample.tokenId} → ${out}`)
  const result = spawnSync(
    process.execPath,
    [bin, 'token', sample.contract, sample.tokenId, '--out', out],
    { cwd: root, stdio: 'inherit' },
  )
  if (result.status !== 0) {
    console.error(`FAILED ${sample.slug} #${sample.iteration}`)
    failed += 1
  }
}

if (failed > 0) {
  console.error(`\n${failed} token index(es) failed.`)
  process.exit(1)
}
console.log('\nAll sample token indexes written to public/indexes/tokens/')
