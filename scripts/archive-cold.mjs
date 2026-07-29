#!/usr/bin/env node
/**
 * Cold offline folders via the published CLI wallet command.
 *
 * @whitehash/archive@0.0.1 cold path is `wallet` + `verify` (URL paste falls
 * through to wallet mode and is not a dedicated single-token archiver yet).
 *
 * We archive ileivoivm II with a small limit. Some genesis tokens currently
 * trip a verify path-parsing bug in 0.0.1 (comma-separated attrs in HTML);
 * ileivoivm II samples verify cleanly.
 */
import { mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outRoot = join(root, 'archives')
const bin = join(root, 'node_modules', '@whitehash', 'archive', 'dist', 'index.js')

const WALLETS = [
  {
    label: 'ileivoivm-ii',
    address: 'tz1SLRzGqX9fuKPx1PAkrDxCvaetr524is11',
    limit: 1,
  },
]

mkdirSync(outRoot, { recursive: true })

let failed = 0
for (const wallet of WALLETS) {
  const out = join(outRoot, wallet.label)
  console.log(`\n→ cold wallet ${wallet.address} (limit ${wallet.limit}) → ${out}`)
  const result = spawnSync(
    process.execPath,
    [
      bin,
      'wallet',
      wallet.address,
      '--chains',
      'tezos',
      '--limit',
      String(wallet.limit),
      '--out',
      out,
    ],
    { cwd: root, stdio: 'inherit' },
  )
  if (result.status !== 0) {
    console.error(`FAILED cold archive ${wallet.label}`)
    failed += 1
  }
}

if (failed > 0) {
  console.error(`\n${failed} cold archive(s) failed.`)
  process.exit(1)
}
console.log('\nCold archives written under archives/')
console.log('Next: npm run archive:verify')
