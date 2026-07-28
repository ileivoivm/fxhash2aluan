import { Link } from 'react-router-dom'
import { ARTIST, PROJECTS } from '../data/projects'

export function HomePage() {
  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">fxhash → self-hosted</p>
        <h1>{ARTIST.name}</h1>
        <p className="lede">
          自己維護的 fxhash 作品庫。鏈上讀取、IPFS 解析、正確 seed 的 live
          渲染——不依賴 fxhash 平台後端。
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
          <Link
            key={project.slug}
            className="card"
            to={`/works/${project.slug}`}
          >
            <div className="card-top">
              <h2>{project.title}</h2>
              <span className="year">{project.year}</span>
            </div>
            <p>{project.blurb}</p>
            <p className="card-meta">
              {project.editions} editions · {project.projectId}
            </p>
          </Link>
        ))}
      </section>

      <section className="proof">
        <h2>快速驗證 · Chaos Memory #106</h2>
        <p>
          用已知的鏈上 token 測試預覽與 Run live。這是「正確展示」的最小證明。
        </p>
        <Link className="button" to="/token/chaos-memory-106">
          開啟 sample token →
        </Link>
      </section>
    </main>
  )
}
