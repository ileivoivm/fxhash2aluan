import { Artwork, Spinner } from '@whitehash/ui'
import { useToken } from '@whitehash/react'
import type { TokenInput } from '@whitehash/chain-reader'
import { objktTokenUrl } from '../lib/objkt'

export type TokenViewerProps = {
  input: TokenInput
  /** Optional title override (e.g. sample label). */
  titleFallback?: string
  showMeta?: boolean
  showObjkt?: boolean
  className?: string
}

export function TokenViewer({
  input,
  titleFallback,
  showMeta = true,
  showObjkt = true,
  className,
}: TokenViewerProps) {
  const { token, loading, error } = useToken(input)

  if (loading) {
    return (
      <div className={`module center ${className ?? ''}`}>
        <Spinner />
        <p>Reading token from chain…</p>
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
          <div className="stage-controls">
            <Artwork.PlayButton playLabel="Run live" stopLabel="Stop" />
            <Artwork.StatusBadge />
            {showObjkt && (
              <a
                className="objkt-link"
                href={objktUrl}
                target="_blank"
                rel="noreferrer"
              >
                View on objkt ↗
              </a>
            )}
          </div>
        </Artwork.Root>
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
            Preview from IPFS. Run live executes the generator with the correct
            seed in a sandboxed iframe.
          </p>
        </aside>
      )}
    </section>
  )
}
