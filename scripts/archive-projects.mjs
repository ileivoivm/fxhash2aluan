#!/usr/bin/env node
/**
 * Generate whitehash-project-index@1 JSON for curated projects.
 * Uses the official CLI: npx / local whitehash-archive project <id>
 */
import { mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'indexes')

/** Keep in sync with src/data/projects.ts */
const PROJECTS = [
  { slug: 'chaos-research', projectId: 'v2:5101' },
  { slug: 'chaos-memory', projectId: 'v2:11068' },
  { slug: 'collage-1', projectId: 'v2:11805' },
  { slug: 'chaos-culture', projectId: 'v2:13447' },
  { slug: 'turner-light', projectId: 'v2:17146' },
  { slug: 'avlab-23', projectId: 'v2:19928' },
]

const bin = join(root, 'node_modules', '@whitehash', 'archive', 'dist', 'index.js')

mkdirSync(outDir, { recursive: true })

let failed = 0
for (const { slug, projectId } of PROJECTS) {
  const out = join(outDir, `${slug}.json`)
  console.log(`\n→ project ${projectId} → ${out}`)
  const result = spawnSync(
    process.execPath,
    [bin, 'project', projectId, '--out', out],
    { cwd: root, stdio: 'inherit' },
  )
  if (result.status !== 0) {
    console.error(`FAILED ${slug} (${projectId})`)
    failed += 1
  }
}

if (failed > 0) {
  console.error(`\n${failed} project index(es) failed.`)
  process.exit(1)
}
console.log('\nAll project indexes written to public/indexes/')
