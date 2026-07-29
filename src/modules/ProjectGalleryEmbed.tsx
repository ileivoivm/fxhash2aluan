import { useMemo, useState, type ReactNode } from 'react'
import {
  Artwork,
  Badge,
  Card,
  SortToggle,
  Spinner,
  chainLabel,
} from '@whitehash/ui'
import type { ListOrder, WhitehashToken } from '@whitehash/chain-reader'
import type { CuratedProject } from '../data/projects'
import { useProjectIndex } from '../lib/useProjectIndex'
import { shouldShowToken, tokenIteration } from '../lib/tokens'

function ArtworkCard({
  token,
  onOpen,
}: {
  token: WhitehashToken
  onOpen?: (token: WhitehashToken) => void
}) {
  const iteration = tokenIteration(token)
  const label = iteration != null ? `#${iteration}` : `#${token.tokenId}`

  return (
    <button
      type="button"
      className="token-card"
      onClick={onOpen ? () => onOpen(token) : undefined}
      aria-label={token.name ?? label}
    >
      <Card.Root>
        <Card.Media>
          <Artwork.Root token={token}>
            <Artwork.Image source="thumbnail" />
          </Artwork.Root>
        </Card.Media>
        <Card.Body>
          <Card.Title>{label}</Card.Title>
          <Card.Meta>
            <Badge>{chainLabel(token.chain)}</Badge>
          </Card.Meta>
        </Card.Body>
      </Card.Root>
    </button>
  )
}

export type ProjectGalleryEmbedProps = {
  projectRef: CuratedProject
  onOpenToken?: (token: WhitehashToken) => void
  /** Hide sort / load-more chrome for ultra-minimal embeds. Default false. */
  compact?: boolean
  /** Extra controls before the sort toggle (e.g. “All Projects”). */
  toolbarStart?: ReactNode
  className?: string
}

export function ProjectGalleryEmbed({
  projectRef,
  onOpenToken,
  compact = false,
  toolbarStart,
  className,
}: ProjectGalleryEmbedProps) {
  const [order, setOrder] = useState<ListOrder>('oldest')
  const { data, loading, error } = useProjectIndex(projectRef.slug)

  const visibleTokens = useMemo(() => {
    if (!data) return []
    const filtered = data.tokens.filter((token) =>
      shouldShowToken(token, {
        projectName: data.project.name,
        hideIterationsThrough: projectRef.hideIterationsThrough,
        excludeThumbnailUris: projectRef.excludeThumbnailUris,
      }),
    )
    const sorted = [...filtered].sort((a, b) => {
      const ia = tokenIteration(a) ?? 0
      const ib = tokenIteration(b) ?? 0
      return order === 'oldest' ? ia - ib : ib - ia
    })
    return sorted
  }, [data, order, projectRef.hideIterationsThrough, projectRef.excludeThumbnailUris])

  return (
    <section className={`gallery module ${className ?? ''}`}>
      {!compact && (
        <div className="gallery-toolbar">
          {toolbarStart}
          <SortToggle order={order} onChange={setOrder} />
        </div>
      )}

      {error ? <p className="error">{error}</p> : null}

      {loading && visibleTokens.length === 0 ? (
        <div className="module center">
          <Spinner />
        </div>
      ) : (
        <div className="token-grid">
          {visibleTokens.map((token) => (
            <ArtworkCard
              key={`${token.chain}:${token.contract}:${token.tokenId}`}
              token={token}
              onOpen={onOpenToken}
            />
          ))}
        </div>
      )}

      <div className="gallery-footer">
        {!loading && visibleTokens.length === 0 && !error ? (
          <p className="meta">No minted iterations found.</p>
        ) : null}
        {data && !data.complete ? (
          <p className="meta">Index incomplete — re-run npm run archive:projects.</p>
        ) : null}
      </div>
    </section>
  )
}
