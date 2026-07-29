import type { ChainId } from '@whitehash/chain-reader'

/** Curated fxhash project refs only. Titles/descriptions come from chain via Whitehash. */
export type CuratedProject = {
  slug: string
  /** Whitehash Tezos project id: `v2:<issuer_id>` */
  projectId: string
  chain: Extract<ChainId, 'tezos:mainnet'>
  /** Hide iterations 1..N (test mints). Applied in the UI only. */
  hideIterationsThrough?: number
  /**
   * Drop tokens whose thumbnailUri is in this list (shared placeholders /
   * false duplicates in the project index).
   */
  excludeThumbnailUris?: readonly string[]
  /**
   * Official project cover from generative metadata (`previewHash`), not a
   * minted edition. Used by Cover · Run live.
   */
  cover?: {
    previewHash: string
    generativeUri: string
    displayUri?: string
    thumbnailUri?: string
  }
  /** Optional known edition for sample token index / deep links. */
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

/** GENTK genesis FA2 — Chaos Research */
export const GENTK_GENESIS = 'KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE'

/** GENTK v2 FA2 — Chaos Memory sample */
export const GENTK_V2 = 'KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi'

/**
 * Shared placeholder thumb on ~24 false Chaos Research duplicates in the
 * project index (same CID for many names). Real editions have unique thumbs.
 */
export const CHAOS_RESEARCH_PLACEHOLDER_THUMB =
  'ipfs://Qmc7W7jKsZaWHamgeWQefctSTELAvGrouNwmwXpXMDhicu'

export const PROJECTS: CuratedProject[] = [
  {
    slug: 'chaos-research',
    projectId: 'v2:5101',
    chain: 'tezos:mainnet',
    excludeThumbnailUris: [CHAOS_RESEARCH_PLACEHOLDER_THUMB],
    cover: {
      previewHash: 'ooPAib3CZxnUQNhTEBCa1mSS1mcT8iLVVvgzWzPBbgKhbp4Px8P',
      generativeUri: 'ipfs://QmeALg31LnC9tAQAhFEp6pGvpCMboZUEAM8H5gpZBSsWKz',
      displayUri: 'ipfs://QmWayq38MUGoLxHqFxDJ7yc5aiiho2nXeT2RFb3euXPZtu',
      thumbnailUri: 'ipfs://QmVXp4cdYzKZx8MceXrfdSZ4Ti82gdCJyE58LKKJXbsZqF',
    },
    sampleToken: {
      contract: GENTK_GENESIS,
      tokenId: '269704',
      iteration: 6,
    },
  },
  {
    slug: 'chaos-memory',
    projectId: 'v2:11068',
    chain: 'tezos:mainnet',
    cover: {
      previewHash: 'oo3z1iny2qwZcuQQfc5GadRHLwxwBNekkXm8s6LgsjPtPRYvkhc',
      generativeUri: 'ipfs://QmSsGpDggV6uFUtu6pfR4dy3hZBMU9Rsu1xzTznD9DgMWT',
      displayUri: 'ipfs://QmPeyX8FhugbggUf3yKarmuRs9U1JfxUXWmLaKCzuNkTSw',
      thumbnailUri: 'ipfs://QmRv75XuXnRPJgDJ3T2267gDw7UA966yRkdAw2u3a4rKNy',
    },
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
    cover: {
      previewHash: 'oo4srBZcZGDQvHkJoY1YgHQZweHw4sqZdXpYD3SqvzQ7jpPe7En',
      generativeUri: 'ipfs://Qmc4RPmkfE3AWKPZoJZRJLZ3txihLdkVpLRZJKStPCFXmL',
      displayUri: 'ipfs://QmXh9cF5ST3mWdZXVLLMsp4Wj3VXtjuc4fCyWsEowxMRb8',
      thumbnailUri: 'ipfs://QmbVB5sLzWJRG9vZEZ1nEeUJsAUK8qZDYMaYePVJ67ntkz',
    },
    sampleToken: {
      contract: GENTK_V2,
      tokenId: '642092',
      iteration: 1,
    },
  },
  {
    slug: 'chaos-culture',
    projectId: 'v2:13447',
    chain: 'tezos:mainnet',
    cover: {
      previewHash: 'ooGNWN1yMLaKT8vHUiedVF1taa1Ly1mXDhwBbmaa99x6ZAE4dRp',
      generativeUri: 'ipfs://QmeVQNMEEJZX5sNrh3jw9uShjLKssxtmjLarybnLfAQuJj',
      displayUri: 'ipfs://QmTL22hSXbN633Fpj3WXAki43SFZX1vQPcR22o9HKZ8FS4',
      thumbnailUri: 'ipfs://QmczuwRBaNwR1ZpjXa1SCsUQ96pqRtiUb3jyDKvD2T39C4',
    },
    sampleToken: {
      contract: GENTK_V2,
      tokenId: '740827',
      iteration: 1,
    },
  },
  {
    slug: 'turner-light',
    projectId: 'v2:17146',
    chain: 'tezos:mainnet',
    cover: {
      previewHash: 'oo9TXXP2HyAucu18ehYPKbf7qHdcYfkfp8TMM9fnBrQfqA9b83e',
      generativeUri: 'ipfs://QmYYoEZhhfiN5o7BepGfMNfP8r1NTG8uZ3qPpMWSXzXW6v',
      displayUri: 'ipfs://QmWHEtikW5UQi3r7M66s9zUqc3ZTMkGaXfw6ADbnQHRaAT',
      thumbnailUri: 'ipfs://QmPXr8EuzDUuJFW357C1P3myKF2vd3gLLcmsVMnqFwJj1t',
    },
    sampleToken: {
      contract: GENTK_V2,
      tokenId: '1052759',
      iteration: 1,
    },
  },
  {
    slug: 'avlab-23',
    projectId: 'v2:19928',
    chain: 'tezos:mainnet',
    cover: {
      previewHash: 'ooWnshjg1r4WLHAAjcBvJw3SjJSDYwQc5qJtApsha6swVFaiLRc',
      generativeUri: 'ipfs://QmcAy26jwFxUeivyNXnp19iNJTHhyPsj4xuA5riVqDhyWV',
      displayUri: 'ipfs://QmTMjKALmsPoqVs5rbpPJEQ3bEeuwKYkjkguijT19Ci8RE',
      thumbnailUri: 'ipfs://QmQ9z8nkpHAsCMUKitWudRsyX58S2eY64vzNHsF1MR1n42',
    },
    sampleToken: {
      contract: GENTK_V2,
      tokenId: '1603210',
      iteration: 1,
    },
  },
]

export function getProject(slug: string): CuratedProject | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}
