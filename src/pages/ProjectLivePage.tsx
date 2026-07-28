import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProject } from '@whitehash/react'
import { Artwork, Spinner } from '@whitehash/ui'
import { getProject, type CuratedProject } from '../data/projects'
import { projectCoverPreview, projectCoverToken } from '../lib/projectCover'

function ProjectLiveContent({
  projectRef,
  slug,
}: {
  projectRef: CuratedProject
  slug: string
}) {
  const navigate = useNavigate()
  const { project, loading, error } = useProject({
    chain: projectRef.chain,
    id: projectRef.projectId,
  })

  const backTo = `/works/${slug}`

  if (loading) {
    return (
      <main className="page center">
        <Spinner />
        <p>Reading project from chain…</p>
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className="page">
        <p className="error">{error ?? 'Project not found'}</p>
        <Link to={backTo}>← Back</Link>
      </main>
    )
  }

  const token = projectCoverToken(project)
  const preview = projectCoverPreview(project)
  const title = project.name ?? projectRef.projectId

  if (!token || !preview) {
    return (
      <main className="page">
        <p className="error">No previewHash / generativeUri on this project.</p>
        <Link to={backTo}>← Back</Link>
      </main>
    )
  }

  return (
    <main className="page wide">
      <nav className="crumb">
        <Link to="/">Works</Link>
        <span aria-hidden>/</span>
        <Link to={backTo}>{title}</Link>
        <span aria-hidden>/</span>
        <span>cover</span>
      </nav>

      <section className="viewer">
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

        <aside className="aside">
          <button
            type="button"
            className="text-back"
            onClick={() => navigate(backTo)}
          >
            ← Back
          </button>
          <h1 className="token-title">{title}</h1>
          <p className="meta">Project cover · previewHash</p>
          <dl className="token-meta">
            <div>
              <dt>Project</dt>
              <dd>{project.id}</dd>
            </div>
            <div>
              <dt>previewHash</dt>
              <dd className="mono">{preview.previewHash}</dd>
            </div>
            <div>
              <dt>generator</dt>
              <dd className="mono">{preview.generativeUri}</dd>
            </div>
          </dl>
          <p className="hint">
            Live view uses the project metadata previewHash — the same seed as
            the cover capture — not a minted edition.
          </p>
        </aside>
      </section>
    </main>
  )
}

export function ProjectLivePage() {
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

  return <ProjectLiveContent projectRef={projectRef} slug={slug} />
}
