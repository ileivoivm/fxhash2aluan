import { useEffect, useState } from 'react'
import { Artwork, Spinner } from '@whitehash/ui'
import type { WhitehashToken } from '@whitehash/chain-reader'
import type { CuratedProject } from '../data/projects'
import { findTokenInIndex } from '../lib/projectIndex'
import { useProjectIndex } from '../lib/useProjectIndex'
import { loadSampleToken } from '../lib/tokenIndex'

type ProjectCoverLiveProps = {
  projectRef: CuratedProject
  /** Show hash / generator meta beside the stage. Embed mode usually hides this. */
  showMeta?: boolean
  className?: string
}

/**
 * Cover live prefers the curated sample token from the hosted project/token
 * indexes (Whitehash Archive). Falls back to loading the sample token index.
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

  const sample = projectRef.sampleToken

  useEffect(() => {
    if (!sample) {
      setToken(null)
      setTokenError('No sampleToken configured for this project.')
      return
    }

    const fromProject = data
      ? findTokenInIndex(data.tokens, sample.contract, sample.tokenId)
      : undefined

    if (fromProject) {
      setToken(fromProject)
      setTokenError(null)
      setLoadingToken(false)
      return
    }

    if (indexLoading) return

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
  }, [data, indexLoading, projectRef.slug, sample])

  const loading = indexLoading || loadingToken
  const error = tokenError ?? indexError
  const title = data?.project.name ?? projectRef.projectId

  if (loading) {
    return (
      <div className={`module center ${className ?? ''}`}>
        <Spinner />
        <p>Loading cover from archive index…</p>
      </div>
    )
  }

  if (error || !token) {
    return (
      <div className={`module ${className ?? ''}`}>
        <p className="error">{error ?? 'Cover token not found in index'}</p>
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
            Cover live · {token.name ?? `#${token.tokenId}`}
          </p>
          <dl className="token-meta">
            <div>
              <dt>Project</dt>
              <dd>{projectRef.projectId}</dd>
            </div>
            <div>
              <dt>Contract</dt>
              <dd className="mono">{token.contract}</dd>
            </div>
            <div>
              <dt>Token ID</dt>
              <dd>{token.tokenId}</dd>
            </div>
            {token.iterationHash && (
              <div>
                <dt>Hash</dt>
                <dd className="mono">{token.iterationHash}</dd>
              </div>
            )}
          </dl>
          <p className="hint">
            Live view uses the curated sample edition from the Whitehash project
            / token index — not a synthetic previewHash cover.
          </p>
        </aside>
      )}
    </section>
  )
}
