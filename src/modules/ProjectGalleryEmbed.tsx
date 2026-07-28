import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useProject } from '@whitehash/react'
import {
  Artwork,
  Badge,
  Button,
  Card,
  SortToggle,
  Spinner,
  chainLabel,
} from '@whitehash/ui'
import type { ListOrder, WhitehashToken } from '@whitehash/chain-reader'
import type { CuratedProject } from '../data/projects'
import { shouldShowToken } from '../lib/tokens'

function ArtworkCard({
  token,
  onOpen,
}: {
  token: WhitehashToken
  onOpen?: (token: WhitehashToken) => void
}) {
  return (
    <button
      type="button"
      className="token-card"
      onClick={onOpen ? () => onOpen(token) : undefined}
    >
      <Card.Root>
        <Card.Media>
          <Artwork.Root token={token}>
            <Artwork.Image source="thumbnail" />
          </Artwork.Root>
        </Card.Media>
        <Card.Body>
          <Card.Title>{token.name ?? `#${token.tokenId}`}</Card.Title>
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

  const { project, tokens, loading, error, hasMore, loadMore } = useProject(
    { chain: projectRef.chain, id: projectRef.projectId },
    { order },
  )

  const visibleTokens = useMemo(
    () =>
      tokens.filter((token) =>
        shouldShowToken(token, {
          projectName: project?.name,
          hideIterationsThrough: projectRef.hideIterationsThrough,
        }),
      ),
    [tokens, project?.name, projectRef.hideIterationsThrough],
  )

  useEffect(() => {
    if (!project?.name) return
    if (loading || !hasMore) return
    if (tokens.length === 0) return
    if (visibleTokens.length >= 12) return
    void loadMore()
  }, [
    project?.name,
    loading,
    hasMore,
    tokens.length,
    visibleTokens.length,
    loadMore,
  ])

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
        {loading && visibleTokens.length > 0 ? (
          <p className="meta">Loading more…</p>
        ) : null}
        {!loading && hasMore ? (
          <Button variant="link" onClick={() => void loadMore()}>
            Load More
          </Button>
        ) : null}
        {!loading && visibleTokens.length === 0 && !error ? (
          <p className="meta">No minted iterations found.</p>
        ) : null}
      </div>
    </section>
  )
}
