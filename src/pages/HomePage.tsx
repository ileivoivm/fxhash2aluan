import { Link } from 'react-router-dom'
import { useGatewayImage, useProject } from '@whitehash/react'
import { Spinner, editionsLabel } from '@whitehash/ui'
import { ARTIST, PROJECTS, type CuratedProject } from '../data/projects'

function ProjectCover({
  uri,
  chain,
  alt,
}: {
  uri: string | null
  chain: CuratedProject['chain']
  alt: string
}) {
  const { src, onError, failed } = useGatewayImage(uri, chain)

  return (
    <div className="card-cover">
      {src && !failed ? (
        <img src={src} alt={alt} onError={onError} loading="lazy" />
      ) : (
        <div className="card-cover-fallback" aria-hidden />
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: CuratedProject }) {
  const { project: onChain, loading, error } = useProject({
    chain: project.chain,
    id: project.projectId,
  })

  const title = onChain?.name ?? project.projectId
  const description = onChain?.description
  const editions = editionsLabel(onChain?.minted ?? null, onChain?.editions ?? null)
  const coverUri = onChain?.displayUri ?? onChain?.thumbnailUri ?? null

  return (
    <Link className="card" to={`/works/${project.slug}`}>
      <ProjectCover uri={coverUri} chain={project.chain} alt={title} />
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
