import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProject } from '@whitehash/react'
import {
  Artwork,
  Badge,
  Button,
  Card,
  SortToggle,
  Spinner,
  chainLabel,
  editionsLabel,
} from '@whitehash/ui'
import type { ListOrder, WhitehashToken } from '@whitehash/chain-reader'
import { ProjectCover } from '../components/ProjectCover'
import { getProject, type CuratedProject } from '../data/projects'
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

function WorkPageContent({
  projectRef,
  slug,
}: {
  projectRef: CuratedProject
  slug: string
}) {
  const navigate = useNavigate()
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

  // Whitehash name search is case-insensitive; after exact-name filter we may
  // need extra pages (e.g. Collage vs older COLLAGE on genesis).
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

  const onOpenToken = (token: WhitehashToken) => {
    navigate(
      `/token/${token.contract}/${token.tokenId}?from=${encodeURIComponent(slug)}`,
    )
  }

  const title = project?.name ?? projectRef.projectId
  const label = project
    ? editionsLabel(project.minted, project.editions)
    : ''
  const coverUri = project?.displayUri ?? project?.thumbnailUri ?? null

  return (
    <main className="page wide">
      <nav className="crumb">
        <Link to="/">Works</Link>
        <span aria-hidden>/</span>
        <span>{title}</span>
      </nav>

      <header className="work-head">
        <ProjectCover
          uri={coverUri}
          chain={projectRef.chain}
          alt={title}
          className="work-cover"
        />
        <div className="work-head-copy">
          <h1>{title}</h1>
          {project?.description ? <p>{project.description}</p> : null}
          <p className="meta">
            {projectRef.projectId}
            {label ? ` · ${label}` : ''}
          </p>
          {projectRef.sampleToken && (
            <Link className="button" to="/token/chaos-memory-106">
              Sample · #{projectRef.sampleToken.iteration}
            </Link>
          )}
        </div>
      </header>

      <section className="gallery">
        <div className="gallery-toolbar">
          <Button variant="link" onClick={() => navigate('/')}>
            ← All Projects
          </Button>
          <SortToggle order={order} onChange={setOrder} />
        </div>

        {error ? <p className="error">{error}</p> : null}

        {loading && visibleTokens.length === 0 ? (
          <div className="page center">
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
    </main>
  )
}

export function WorkPage() {
  const { slug = '' } = useParams()
  const projectRef = getProject(slug)

  if (!projectRef) {
    return (
      <main className="page">
        <p>Project not found.</p>
        <Link to="/">← Works</Link>
      </main>
    )
  }

  return <WorkPageContent projectRef={projectRef} slug={slug} />
}
