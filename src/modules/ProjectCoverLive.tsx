import { useEffect, useState } from 'react'
import { Artwork, Spinner } from '@whitehash/ui'
import type { WhitehashToken } from '@whitehash/chain-reader'
import type { CuratedProject } from '../data/projects'
import { curatedCoverToken } from '../lib/projectCover'
import { findTokenInIndex } from '../lib/projectIndex'
import { useProjectIndex } from '../lib/useProjectIndex'
import { loadSampleToken } from '../lib/tokenIndex'
import { shouldShowToken, tokenIteration } from '../lib/tokens'

type ProjectCoverLiveProps = {
  projectRef: CuratedProject
  /** Show hash / generator meta beside the stage. Embed mode usually hides this. */
  showMeta?: boolean
  className?: string
}

/** Fallback: curated sample, else lowest visible iteration from the project index. */
function pickEditionToken(
  projectRef: CuratedProject,
  tokens: WhitehashToken[],
  projectName: string | null | undefined,
): WhitehashToken | undefined {
  const sample = projectRef.sampleToken
  if (sample) {
    const curated = findTokenInIndex(tokens, sample.contract, sample.tokenId)
    if (curated) return curated
  }

  const visible = tokens.filter((token) =>
    shouldShowToken(token, {
      projectName,
      hideIterationsThrough: projectRef.hideIterationsThrough,
      excludeThumbnailUris: projectRef.excludeThumbnailUris,
    }),
  )
  if (visible.length === 0) return undefined

  return [...visible].sort((a, b) => {
    const ia = tokenIteration(a) ?? Number.POSITIVE_INFINITY
    const ib = tokenIteration(b) ?? Number.POSITIVE_INFINITY
    return ia - ib
  })[0]
}

/**
 * Cover · Run live uses the official project previewHash cover first.
 * Falls back to a sample / index edition only when cover metadata is missing.
 */
export function ProjectCoverLive({
  projectRef,
  showMeta = true,
  className,
}: ProjectCoverLiveProps) {
  const { data, loading: indexLoading, error: indexError } = useProjectIndex(
    projectRef.slug,
  )
  const [token, setToken] = useState<WhitehashToken | null>(null)
  const [loadingToken, setLoadingToken] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [isOfficialCover, setIsOfficialCover] = useState(false)

  const sample = projectRef.sampleToken

  useEffect(() => {
    const cover = curatedCoverToken(projectRef, data?.project.name)
    if (cover) {
      setToken(cover)
      setIsOfficialCover(true)
      setTokenError(null)
      setLoadingToken(false)
      return
    }

    setIsOfficialCover(false)

    if (data) {
      const fromProject = pickEditionToken(
        projectRef,
        data.tokens,
        data.project.name,
      )
      if (fromProject) {
        setToken(fromProject)
        setTokenError(null)
        setLoadingToken(false)
        return
      }
    }

    if (indexLoading) return

    if (!sample) {
      setToken(null)
      setTokenError(
        data
          ? 'No cover edition found in project index.'
          : 'No cover / sampleToken configured and project index unavailable.',
      )
      return
    }

    let cancelled = false
    setLoadingToken(true)
    setTokenError(null)
    void loadSampleToken(projectRef.slug, sample.iteration)
      .then((t) => {
        if (cancelled) return
        setToken(t)
        setLoadingToken(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setToken(null)
        setTokenError(err instanceof Error ? err.message : String(err))
        setLoadingToken(false)
      })

    return () => {
      cancelled = true
    }
  }, [data, indexLoading, projectRef, sample])

  const loading = (!projectRef.cover && indexLoading) || loadingToken
  const error = tokenError ?? indexError
  const title = data?.project.name ?? projectRef.projectId

  if (loading) {
    return (
      <div className={`module center ${className ?? ''}`}>
        <Spinner />
        <p>Loading cover…</p>
      </div>
    )
  }

  if (error || !token) {
    return (
      <div className={`module ${className ?? ''}`}>
        <p className="error">{error ?? 'Cover token not found'}</p>
      </div>
    )
  }

  return (
    <section className={`viewer module ${className ?? ''}`}>
      <div className="stage">
        <Artwork.Root token={token} className="artwork-stage">
          <Artwork.Image />
          <Artwork.Live />
          <div className="stage-controls">
            <Artwork.PlayButton playLabel="Run live" stopLabel="Stop" />
            <Artwork.StatusBadge />
          </div>
        </Artwork.Root>
      </div>

      {showMeta && (
        <aside className="aside">
          <h1 className="token-title">{title}</h1>
          <p className="meta">
            {isOfficialCover
              ? 'Cover live · official previewHash'
              : `Cover live · ${token.name ?? `#${token.tokenId}`}`}
          </p>
          <dl className="token-meta">
            <div>
              <dt>Project</dt>
              <dd>{projectRef.projectId}</dd>
            </div>
            {!isOfficialCover && (
              <>
                <div>
                  <dt>Contract</dt>
                  <dd className="mono">{token.contract}</dd>
                </div>
                <div>
                  <dt>Token ID</dt>
                  <dd>{token.tokenId}</dd>
                </div>
              </>
            )}
            {token.iterationHash && (
              <div>
                <dt>Hash</dt>
                <dd className="mono">{token.iterationHash}</dd>
              </div>
            )}
          </dl>
          <p className="hint">
            {isOfficialCover
              ? 'Live view uses the on-chain project cover (previewHash), not a minted edition.'
              : 'Live view falls back to a curated sample edition from the archive index.'}
          </p>
        </aside>
      )}
    </section>
  )
}
