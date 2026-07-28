import { useParams } from 'react-router-dom'
import { getProject } from '../../data/projects'
import { ProjectCoverLive } from '../../modules/ProjectCoverLive'

export function EmbedCoverPage() {
  const { slug = '' } = useParams()
  const projectRef = getProject(slug)

  if (!projectRef) {
    return (
      <main className="embed">
        <p className="error">Project not found.</p>
      </main>
    )
  }

  return (
    <main className="embed">
      <ProjectCoverLive projectRef={projectRef} showMeta={false} />
    </main>
  )
}
