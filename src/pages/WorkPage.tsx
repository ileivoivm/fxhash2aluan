import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProjectGallery } from '@whitehash/ui'
import type { WhitehashToken } from '@whitehash/chain-reader'
import { getProject } from '../data/projects'

export function WorkPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const project = getProject(slug)

  if (!project) {
    return (
      <main className="page">
        <p>找不到作品。</p>
        <Link to="/">← 回列表</Link>
      </main>
    )
  }

  const onOpenToken = (token: WhitehashToken) => {
    navigate(
      `/token/${token.contract}/${token.tokenId}?from=${encodeURIComponent(slug)}`,
    )
  }

  return (
    <main className="page wide">
      <nav className="crumb">
        <Link to="/">Works</Link>
        <span aria-hidden>/</span>
        <span>{project.title}</span>
      </nav>

      <header className="work-head">
        <h1>{project.title}</h1>
        <p>{project.blurb}</p>
        <p className="meta">
          {project.year} · {project.editions} editions · {project.projectId}
        </p>
        {project.sampleToken && (
          <Link className="button" to="/token/chaos-memory-106">
            試跑 sample · #{project.sampleToken.iteration}
          </Link>
        )}
      </header>

      <ProjectGallery
        project={{ chain: project.chain, id: project.projectId }}
        onOpenToken={onOpenToken}
        onBack={() => navigate('/')}
      />
    </main>
  )
}
