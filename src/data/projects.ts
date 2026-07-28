import type { ChainId } from '@whitehash/chain-reader'

/** Curated fxhash project refs only. Titles/descriptions come from chain via Whitehash. */
export type CuratedProject = {
  slug: string
  /** Whitehash Tezos project id: `v2:<issuer_id>` */
  projectId: string
  chain: Extract<ChainId, 'tezos:mainnet'>
  /** Hide iterations 1..N (test mints). Applied in the UI only. */
  hideIterationsThrough?: number
  sampleToken?: {
    contract: string
    tokenId: string
    iteration: number
  }
}

export const ARTIST = {
  name: 'Aluan Wang',
  handle: 'ileivoivm',
  tezos: 'tz1cbhmVZuFTKHcACSFpg5ER1bGVGkanhrbW',
  tezosII: 'tz1SLRzGqX9fuKPx1PAkrDxCvaetr524is11',
  site: 'https://aluanwang.com',
} as const

/** GENTK v2 FA2 — Chaos Memory sample */
export const GENTK_V2 = 'KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi'

export const PROJECTS: CuratedProject[] = [
  {
    slug: 'chaos-research',
    projectId: 'v2:5101',
    chain: 'tezos:mainnet',
    /** First five mints are tests — do not show in the gallery. */
    hideIterationsThrough: 5,
  },
  {
    slug: 'chaos-memory',
    projectId: 'v2:11068',
    chain: 'tezos:mainnet',
    sampleToken: {
      contract: GENTK_V2,
      tokenId: '600560',
      iteration: 106,
    },
  },
  {
    slug: 'collage-1',
    projectId: 'v2:11805',
    chain: 'tezos:mainnet',
  },
  {
    slug: 'chaos-culture',
    projectId: 'v2:13447',
    chain: 'tezos:mainnet',
  },
  {
    slug: 'turner-light',
    projectId: 'v2:17146',
    chain: 'tezos:mainnet',
  },
  {
    slug: 'avlab-23',
    projectId: 'v2:19928',
    chain: 'tezos:mainnet',
  },
]

export function getProject(slug: string): CuratedProject | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}
