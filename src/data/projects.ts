/** Curated fxhash projects by Aluan Wang (ileivoivm). Self-maintained — no fxhash API. */
export type CuratedProject = {
  slug: string
  title: string
  year: number
  editions: number
  /** Whitehash Tezos project id: `v2:<issuer_id>` */
  projectId: string
  chain: 'tezos:mainnet'
  blurb: string
  /** Known sample edition for quick live proof */
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
  site: 'https://aluanwang.com',
} as const

/** GENTK v2 FA2 contract used by Chaos Memory sample */
export const GENTK_V2 = 'KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi'

export const PROJECTS: CuratedProject[] = [
  {
    slug: 'chaos-research',
    title: 'Chaos Research',
    year: 2021,
    editions: 256,
    projectId: 'v2:5101',
    chain: 'tezos:mainnet',
    blurb: '第一部：無特徵、相信所見。混沌系列的起點。',
  },
  {
    slug: 'chaos-memory',
    title: 'Chaos Memory',
    year: 2022,
    editions: 300,
    projectId: 'v2:11068',
    chain: 'tezos:mainnet',
    blurb: '記憶的扭曲本質——破碎再重組，Perlin 與 Turner 質地。',
    sampleToken: {
      contract: GENTK_V2,
      tokenId: '600560',
      iteration: 106,
    },
  },
  {
    slug: 'chaos-culture',
    title: 'Chaos Culture',
    year: 2022,
    editions: 1024,
    projectId: 'v2:13447',
    chain: 'tezos:mainnet',
    blurb: '系列終章：Research → Memory → Culture 的遞迴 generational 關係。',
  },
]

export function getProject(slug: string): CuratedProject | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}
