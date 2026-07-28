import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useToken } from '@whitehash/react'
import { Artwork, Spinner } from '@whitehash/ui'
import { GENTK_V2 } from '../data/projects'

const SAMPLE = {
  chain: 'tezos:mainnet' as const,
  contract: GENTK_V2,
  tokenId: '600560',
  label: 'Chaos Memory #106',
}

export function TokenPage() {
  const { contract, tokenId } = useParams()
  const location = useLocation()
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const from = search.get('from')

  const isSample = location.pathname === '/token/chaos-memory-106'
  const input = isSample
    ? { chain: SAMPLE.chain, contract: SAMPLE.contract, tokenId: SAMPLE.tokenId }
    : contract && tokenId
      ? {
          chain: 'tezos:mainnet' as const,
          contract,
          tokenId,
        }
      : null

  const { token, loading, error } = useToken(input)

  if (!input) {
    return (
      <main className="page">
        <p>缺少 token 參數。</p>
        <Link to="/">← 回列表</Link>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="page center">
        <Spinner />
        <p>從鏈上讀取 token…</p>
      </main>
    )
  }

  if (error || !token) {
    return (
      <main className="page">
        <p className="error">{error ?? 'Token not found'}</p>
        <Link to="/">← 回列表</Link>
      </main>
    )
  }

  const backTo = from ? `/works/${from}` : '/'
  const title = token.name ?? (isSample ? SAMPLE.label : `#${token.tokenId}`)

  return (
    <main className="page wide">
      <nav className="crumb">
        <Link to="/">Works</Link>
        {from && (
          <>
            <span aria-hidden>/</span>
            <Link to={backTo}>{from}</Link>
          </>
        )}
        <span aria-hidden>/</span>
        <span>{title}</span>
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
          <button type="button" className="text-back" onClick={() => navigate(backTo)}>
            ← Back
          </button>
          <h1 className="token-title">{title}</h1>
          {token.description && (
            <p className="token-desc">{token.description}</p>
          )}
          <dl className="token-meta">
            <div>
              <dt>Chain</dt>
              <dd>{token.chain}</dd>
            </div>
            <div>
              <dt>Contract</dt>
              <dd className="mono">{token.contract}</dd>
            </div>
            <div>
              <dt>Token ID</dt>
              <dd>{token.tokenId}</dd>
            </div>
            {token.iterationHash && (
              <div>
                <dt>Hash</dt>
                <dd className="mono">{token.iterationHash}</dd>
              </div>
            )}
          </dl>
          <p className="hint">
            預覽來自 IPFS；按 Run live 會以正確 seed
            在受限 iframe 執行生成程式。
          </p>
        </aside>
      </section>
    </main>
  )
}
