import { Link } from 'react-router-dom'
import { Spinner, editionsLabel } from '@whitehash/ui'
import { ProjectCover } from '../components/ProjectCover'
import { ARTIST, PROJECTS, type CuratedProject } from '../data/projects'
import { useProjectIndex } from '../lib/useProjectIndex'

function ProjectCard({ project }: { project: CuratedProject }) {
  const { data, loading, error } = useProjectIndex(project.slug)

  const title = data?.project.name ?? project.projectId
  const description = data?.project.description
  const editions = editionsLabel(
    data?.project.minted ?? null,
    data?.project.editions ?? null,
  )
  const coverUri =
    data?.project.displayUri ?? data?.project.thumbnailUri ?? null

  return (
    <Link className="card" to={`/works/${project.slug}`}>
      <ProjectCover
        uri={coverUri}
        chain={project.chain}
        alt={title}
        className="card-cover"
      />
      <div className="card-body">
        <div className="card-top">
          <h2>{loading ? '…' : title}</h2>
          <span className="year">{project.projectId}</span>
        </div>
        {error ? (
          <p className="error">{error}</p>
        ) : description ? (
          <p className="card-desc">{description}</p>
        ) : loading ? (
          <p>
            <Spinner />
          </p>
        ) : null}
        {editions ? <p className="card-meta">{editions}</p> : null}
      </div>
    </Link>
  )
}

export function HomePage() {
  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">fxhash → self-hosted</p>
        <h1>{ARTIST.name}</h1>
        <p className="lede">
          On-chain fxhash projects via Whitehash. Previews and live renders resolve
          from Tezos + IPFS — no fxhash platform backend.
        </p>
        <p className="meta">
          <span>{ARTIST.handle}</span>
          <span aria-hidden>·</span>
          <a href={ARTIST.site} target="_blank" rel="noreferrer">
            aluanwang.com
          </a>
        </p>
      </header>

      <section className="grid" aria-label="Works">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </section>

      <section className="proof">
        <h2>Live check · Chaos Memory #106</h2>
        <p>Open a known token to verify preview + Run live.</p>
        <Link className="button" to="/token/chaos-memory-106">
          Open sample token →
        </Link>
      </section>
    </main>
  )
}
