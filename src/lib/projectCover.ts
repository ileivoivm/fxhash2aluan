import type { WhitehashProject, WhitehashToken } from '@whitehash/chain-reader'

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

/** Synthetic token so Whitehash Artwork can Run live with the cover hash. */
export function projectCoverToken(project: WhitehashProject): WhitehashToken | null {
  const preview = projectCoverPreview(project)
  if (!preview) return null

  return {
    chain: project.chain,
    contract: 'project-cover',
    tokenId: project.id,
    name: project.name ? `${project.name} · cover` : 'Project cover',
    description: null,
    iterationHash: preview.previewHash,
    artifactUri: preview.generativeUri,
    displayUri: preview.displayUri,
    thumbnailUri: preview.thumbnailUri,
    generatorUri: preview.generativeUri,
    attributes: [],
    assigned: true,
    metadataUri: null,
    raw: project.raw,
  }
}
