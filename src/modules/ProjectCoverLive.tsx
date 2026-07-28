import { Artwork, Spinner } from '@whitehash/ui'
import { useProject } from '@whitehash/react'
import type { CuratedProject } from '../data/projects'
import { projectCoverPreview, projectCoverToken } from '../lib/projectCover'

type ProjectCoverLiveProps = {
  projectRef: CuratedProject
  /** Show hash / generator meta beside the stage. Embed mode usually hides this. */
  showMeta?: boolean
  className?: string
}

export function ProjectCoverLive({
  projectRef,
  showMeta = true,
  className,
}: ProjectCoverLiveProps) {
  const { project, loading, error } = useProject({
    chain: projectRef.chain,
    id: projectRef.projectId,
  })

  if (loading) {
    return (
      <div className={`module center ${className ?? ''}`}>
        <Spinner />
        <p>Reading project from chain…</p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className={`module ${className ?? ''}`}>
        <p className="error">{error ?? 'Project not found'}</p>
      </div>
    )
  }

  const token = projectCoverToken(project)
  const preview = projectCoverPreview(project)
  const title = project.name ?? projectRef.projectId

  if (!token || !preview) {
    return (
      <div className={`module ${className ?? ''}`}>
        <p className="error">No previewHash / generativeUri on this project.</p>
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
      )}
    </section>
  )
}
