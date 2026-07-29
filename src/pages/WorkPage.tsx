import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, editionsLabel } from '@whitehash/ui'
import type { WhitehashToken } from '@whitehash/chain-reader'
import { ProjectCover } from '../components/ProjectCover'
import { getProject, type CuratedProject } from '../data/projects'
import { useProjectIndex } from '../lib/useProjectIndex'
import { findTokenInIndex } from '../lib/projectIndex'
import { ProjectGalleryEmbed } from '../modules/ProjectGalleryEmbed'

function WorkPageContent({
  projectRef,
  slug,
}: {
  projectRef: CuratedProject
  slug: string
}) {
  const navigate = useNavigate()
  const { data, loading, error } = useProjectIndex(slug)

  const onOpenToken = (token: WhitehashToken) => {
    navigate(
      `/token/${token.contract}/${token.tokenId}?from=${encodeURIComponent(slug)}`,
    )
  }

  const project = data?.project
  const title = project?.name ?? projectRef.projectId
  const label = project
    ? editionsLabel(project.minted, project.editions)
    : ''
  const coverUri = project?.displayUri ?? project?.thumbnailUri ?? null

  const sample = projectRef.sampleToken
  const sampleToken =
    sample && data
      ? findTokenInIndex(data.tokens, sample.contract, sample.tokenId)
      : undefined
  const coverHref =
    sampleToken || sample ? `/works/${slug}/live` : null

  return (
    <main className="page wide">
      <nav className="crumb">
        <Link to="/">Works</Link>
        <span aria-hidden>/</span>
        <span>{title}</span>
      </nav>

      <header className="work-head">
        {coverHref ? (
          <Link
            to={coverHref}
            className="work-cover-link"
            aria-label={`Open cover live view · ${title}`}
          >
            <ProjectCover
              uri={coverUri}
              chain={projectRef.chain}
              alt={loading ? '…' : title}
              className="work-cover"
            />
            <span className="work-cover-cta">Run live →</span>
          </Link>
        ) : (
          <div className="work-cover-link disabled">
            <ProjectCover
              uri={coverUri}
              chain={projectRef.chain}
              alt={loading ? '…' : title}
              className="work-cover"
            />
          </div>
        )}
        <div className="work-head-copy">
          <h1>{title}</h1>
          {error ? <p className="error">{error}</p> : null}
          {project?.description ? <p>{project.description}</p> : null}
          <p className="meta">
            {projectRef.projectId}
            {label ? ` · ${label}` : ''}
          </p>
          {coverHref && (
            <Link className="button" to={coverHref}>
              Open cover live
            </Link>
          )}
        </div>
      </header>

      <ProjectGalleryEmbed
        projectRef={projectRef}
        onOpenToken={onOpenToken}
        toolbarStart={
          <Button variant="link" onClick={() => navigate('/')}>
            ← All Projects
          </Button>
        }
      />
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
