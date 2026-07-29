import {
  parseTokenIndex,
  type TokenIndex,
  type WhitehashToken,
} from '@whitehash/chain-reader'
import { sampleTokenIndexUrl } from './projectIndex'

export async function loadSampleTokenIndex(
  slug: string,
  iteration: number,
): Promise<TokenIndex> {
  const url = sampleTokenIndexUrl(slug, iteration)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load token index (${response.status}): ${url}`)
  }
  const json: unknown = await response.json()
  return parseTokenIndex(json)
}

export async function loadSampleToken(
  slug: string,
  iteration: number,
): Promise<WhitehashToken> {
  const index = await loadSampleTokenIndex(slug, iteration)
  return index.token
}
