#!/usr/bin/env node
/**
 * Verify cold offline archives under ./archives
 */
import { readdirSync, existsSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const archivesRoot = join(root, 'archives')
const bin = join(root, 'node_modules', '@whitehash', 'archive', 'dist', 'index.js')

if (!existsSync(archivesRoot)) {
  console.error('No archives/ directory. Run npm run archive:cold first.')
  process.exit(1)
}

const entries = readdirSync(archivesRoot).filter((name) => {
  if (name.startsWith('.')) return false
  return statSync(join(archivesRoot, name)).isDirectory()
})

if (entries.length === 0) {
  console.error('archives/ is empty. Run npm run archive:cold first.')
  process.exit(1)
}

let failed = 0
for (const name of entries) {
  const dir = join(archivesRoot, name)
  console.log(`\n→ verify ${dir}`)
  const result = spawnSync(process.execPath, [bin, 'verify', dir], {
    cwd: root,
    stdio: 'inherit',
  })
  if (result.status !== 0) {
    console.error(`FAILED verify ${name}`)
    failed += 1
  }
}

if (failed > 0) {
  console.error(`\n${failed} verification(s) failed.`)
  process.exit(1)
}
console.log('\nAll cold archives verified.')
