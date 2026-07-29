import type { WhitehashProject, WhitehashToken } from '@whitehash/chain-reader'
import type { CuratedProject } from '../data/projects'

type ProjectRaw = {
  previewHash?: unknown
  generativeUri?: unknown
  artifactUri?: unknown
  displayUri?: unknown
  thumbnailUri?: unknown
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function hashFromArtifactUri(artifactUri: string | null): string | null {
  if (!artifactUri) return null
  try {
    const url = new URL(artifactUri.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/'))
    return url.searchParams.get('fxhash')
  } catch {
    const match = artifactUri.match(/[?&]fxhash=([^&]+)/)
    return match ? decodeURIComponent(match[1]) : null
  }
}

/** Cover / project-page live seed from on-chain generative metadata. */
export function projectCoverPreview(project: WhitehashProject): {
  previewHash: string
  generativeUri: string
  displayUri: string | null
  thumbnailUri: string | null
} | null {
  const raw = (project.raw ?? null) as ProjectRaw | null
  const generativeUri =
    asString(raw?.generativeUri) ??
    asString(raw?.artifactUri)?.split('?')[0] ??
    null
  const artifactUri = asString(raw?.artifactUri)
  const previewHash =
    asString(raw?.previewHash) ?? hashFromArtifactUri(artifactUri)

  if (!previewHash || !generativeUri) return null

  return {
    previewHash,
    generativeUri,
    displayUri: project.displayUri ?? asString(raw?.displayUri),
    thumbnailUri: project.thumbnailUri ?? asString(raw?.thumbnailUri),
  }
}

function coverTokenFromParts(input: {
  chain: WhitehashToken['chain']
  projectId: string
  name: string | null | undefined
  previewHash: string
  generativeUri: string
  displayUri?: string | null
  thumbnailUri?: string | null
  raw?: unknown
}): WhitehashToken {
  return {
    chain: input.chain,
    contract: 'project-cover',
    tokenId: input.projectId,
    name: input.name ? `${input.name} · cover` : 'Project cover',
    description: null,
    iterationHash: input.previewHash,
    artifactUri: input.generativeUri,
    displayUri: input.displayUri ?? null,
    thumbnailUri: input.thumbnailUri ?? null,
    generatorUri: input.generativeUri,
    attributes: [],
    assigned: true,
    metadataUri: null,
    raw: input.raw ?? null,
  }
}

/** Synthetic token so Whitehash Artwork can Run live with the cover hash. */
export function projectCoverToken(project: WhitehashProject): WhitehashToken | null {
  const preview = projectCoverPreview(project)
  if (!preview) return null

  return coverTokenFromParts({
    chain: project.chain,
    projectId: project.id,
    name: project.name,
    previewHash: preview.previewHash,
    generativeUri: preview.generativeUri,
    displayUri: preview.displayUri,
    thumbnailUri: preview.thumbnailUri,
    raw: project.raw,
  })
}

/**
 * Cover live from curated on-chain previewHash (official project cover),
 * not a minted edition.
 */
export function curatedCoverToken(
  projectRef: CuratedProject,
  projectName?: string | null,
): WhitehashToken | null {
  const cover = projectRef.cover
  if (!cover) return null

  return coverTokenFromParts({
    chain: projectRef.chain,
    projectId: projectRef.projectId,
    name: projectName,
    previewHash: cover.previewHash,
    generativeUri: cover.generativeUri,
    displayUri: cover.displayUri,
    thumbnailUri: cover.thumbnailUri,
  })
}
