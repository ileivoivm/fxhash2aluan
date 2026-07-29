import type { WhitehashToken } from '@whitehash/chain-reader'

/** Parse edition number from on-chain token name (`… #12`). */
export function tokenIteration(token: WhitehashToken): number | null {
  const match = token.name?.match(/#(\d+)\s*$/)
  if (match) return Number(match[1])
  return null
}

/**
 * Whitehash lists Tezos iterations with TzKT `metadata.name.as={name} #*`,
 * which is case-insensitive — so "Collage" also matches an older "COLLAGE".
 * Keep only the exact on-chain project name prefix.
 */
export function tokenBelongsToProject(
  token: WhitehashToken,
  projectName: string | null | undefined,
): boolean {
  if (!projectName || !token.name) return false
  return token.name.startsWith(`${projectName} #`)
}

export function shouldShowToken(
  token: WhitehashToken,
  options: {
    projectName?: string | null
    hideIterationsThrough?: number
    excludeThumbnailUris?: readonly string[]
  } = {},
): boolean {
  if (
    options.projectName &&
    !tokenBelongsToProject(token, options.projectName)
  ) {
    return false
  }
  if (
    options.excludeThumbnailUris?.length &&
    token.thumbnailUri &&
    options.excludeThumbnailUris.includes(token.thumbnailUri)
  ) {
    return false
  }
  if (options.hideIterationsThrough == null) return true
  const iteration = tokenIteration(token)
  if (iteration == null) return true
  return iteration > options.hideIterationsThrough
}
