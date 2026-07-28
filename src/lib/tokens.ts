import type { WhitehashToken } from '@whitehash/chain-reader'

/** Parse edition number from on-chain token name (`… #12`). */
export function tokenIteration(token: WhitehashToken): number | null {
  const match = token.name?.match(/#(\d+)\s*$/)
  if (match) return Number(match[1])
  return null
}

export function shouldShowToken(
  token: WhitehashToken,
  hideIterationsThrough?: number,
): boolean {
  if (hideIterationsThrough == null) return true
  const iteration = tokenIteration(token)
  if (iteration == null) return true
  return iteration > hideIterationsThrough
}
