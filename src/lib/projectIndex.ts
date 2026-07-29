import {
  parseProjectIndex,
  type IndexedProject,
  type ProjectIndex,
  type WhitehashToken,
} from '@whitehash/chain-reader'

function indexesBase(): string {
  const base = import.meta.env.BASE_URL || '/'
  return base.endsWith('/') ? base : `${base}/`
}

export function projectIndexUrl(slug: string): string {
  return `${indexesBase()}indexes/${slug}.json`
}

export function sampleTokenIndexUrl(slug: string, iteration: number): string {
  return `${indexesBase()}indexes/tokens/${slug}-${iteration}.json`
}

export async function loadProjectIndex(slug: string): Promise<ProjectIndex> {
  const url = projectIndexUrl(slug)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load project index (${response.status}): ${url}`)
  }
  const json: unknown = await response.json()
  return parseProjectIndex(json)
}

export type LoadedProjectIndex = {
  project: IndexedProject
  tokens: WhitehashToken[]
  generatedAt: string
  complete: boolean
  order: ProjectIndex['order']
}

export function projectIndexTokens(index: ProjectIndex): WhitehashToken[] {
  return index.iterations.map((entry) => entry.token)
}

export function toLoadedProjectIndex(index: ProjectIndex): LoadedProjectIndex {
  return {
    project: index.project,
    tokens: projectIndexTokens(index),
    generatedAt: index.generatedAt,
    complete: index.complete,
    order: index.order,
  }
}

export function findTokenInIndex(
  tokens: WhitehashToken[],
  contract: string,
  tokenId: string,
): WhitehashToken | undefined {
  return tokens.find((t) => t.contract === contract && t.tokenId === tokenId)
}
