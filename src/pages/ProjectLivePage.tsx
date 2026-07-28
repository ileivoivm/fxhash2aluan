import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProject } from '@whitehash/react'
import { getProject, type CuratedProject } from '../data/projects'
import { ProjectCoverLive } from '../modules/ProjectCoverLive'

function ProjectLiveContent({
  projectRef,
  slug,
}: {
  projectRef: CuratedProject
  slug: string
}) {
  const navigate = useNavigate()
  const { project } = useProject({
    chain: projectRef.chain,
    id: projectRef.projectId,
  })
  const title = project?.name ?? projectRef.projectId
  const backTo = `/works/${slug}`

  return (
    <main className="page wide">
      <nav className="crumb">
        <Link to="/">Works</Link>
        <span aria-hidden>/</span>
        <Link to={backTo}>{title}</Link>
        <span aria-hidden>/</span>
        <span>cover</span>
      </nav>

      <button
        type="button"
        className="text-back"
        onClick={() => navigate(backTo)}
      >
        ← Back
      </button>

      <ProjectCoverLive projectRef={projectRef} showMeta />
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
