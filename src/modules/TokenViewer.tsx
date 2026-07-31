import { useEffect, useState } from 'react'
import { Artwork, Spinner } from '@whitehash/ui'
import { useToken } from '@whitehash/react'
import type { TokenInput, WhitehashToken } from '@whitehash/chain-reader'
import { objktTokenUrl } from '../lib/objkt'
import { loadSampleToken } from '../lib/tokenIndex'

export type TokenViewerProps = {
  input: TokenInput
  /** Optional title override (e.g. sample label). */
  titleFallback?: string
  showMeta?: boolean
  showObjkt?: boolean
  className?: string
  /** Prefer hosted whitehash-token-index@1 when set. */
  archiveSample?: { slug: string; iteration: number }
}

export function TokenViewer({
  input,
  titleFallback,
  showMeta = true,
  showObjkt = true,
  className,
  archiveSample,
}: TokenViewerProps) {
  const chainResult = useToken(archiveSample ? null : input)
  const [archiveToken, setArchiveToken] = useState<WhitehashToken | null>(null)
  const [archiveLoading, setArchiveLoading] = useState(Boolean(archiveSample))
  const [archiveError, setArchiveError] = useState<string | null>(null)

  useEffect(() => {
    if (!archiveSample) {
      setArchiveToken(null)
      setArchiveLoading(false)
      setArchiveError(null)
      return
    }
    let cancelled = false
    setArchiveLoading(true)
    setArchiveError(null)
    void loadSampleToken(archiveSample.slug, archiveSample.iteration)
      .then((token) => {
        if (cancelled) return
        setArchiveToken(token)
        setArchiveLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setArchiveToken(null)
        setArchiveError(err instanceof Error ? err.message : String(err))
        setArchiveLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [archiveSample?.slug, archiveSample?.iteration])

  const loading = archiveSample ? archiveLoading : chainResult.loading
  const error = archiveSample
    ? archiveError
    : chainResult.error
  const token = archiveSample ? archiveToken : chainResult.token

  if (loading) {
    return (
      <div className={`module center ${className ?? ''}`}>
        <Spinner />
        <p>
          {archiveSample
            ? 'Loading token from archive index…'
            : 'Reading token from chain…'}
        </p>
      </div>
    )
  }

  if (error || !token) {
    return (
      <div className={`module ${className ?? ''}`}>
        <p className="error">{error ?? 'Token not found'}</p>
      </div>
    )
  }

  const title = token.name ?? titleFallback ?? `#${token.tokenId}`
  const objktUrl = objktTokenUrl(token.contract, token.tokenId)

  return (
    <section className={`viewer module ${className ?? ''}`}>
      <div className="stage">
        <Artwork.Root token={token} className="artwork-stage">
          <Artwork.Image />
          <Artwork.Live />
          <Artwork.PlayButton playLabel="Run live" stopLabel="Stop" />
          <Artwork.StatusBadge />
        </Artwork.Root>
        {showObjkt && (
          <div className="stage-controls">
            <a
              className="objkt-link"
              href={objktUrl}
              target="_blank"
              rel="noreferrer"
            >
              View on objkt ↗
            </a>
          </div>
        )}
      </div>

      {showMeta && (
        <aside className="aside">
          <h1 className="token-title">{title}</h1>
          <dl className="token-meta">
            <div>
              <dt>Chain</dt>
              <dd>{token.chain}</dd>
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
            {showObjkt && (
              <div>
                <dt>Marketplace</dt>
                <dd>
                  <a href={objktUrl} target="_blank" rel="noreferrer">
                    objkt.com
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <p className="hint">
            {archiveSample
              ? 'Loaded via parseTokenIndex from a hosted whitehash-token-index@1.'
              : 'Preview from IPFS. Run live executes the generator with the correct seed in a sandboxed iframe.'}
          </p>
        </aside>
      )}
    </section>
  )
}
