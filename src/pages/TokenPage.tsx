import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { GENTK_V2 } from '../data/projects'
import { TokenViewer } from '../modules/TokenViewer'

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

  if (!input) {
    return (
      <main className="page">
        <p>Missing token.</p>
        <Link to="/">← Works</Link>
      </main>
    )
  }

  const backTo = from ? `/works/${from}` : '/'

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
        <span>{isSample ? SAMPLE.label : 'token'}</span>
      </nav>

      <button
        type="button"
        className="text-back"
        onClick={() => navigate(backTo)}
      >
        ← Back
      </button>

      <TokenViewer
        input={input}
        titleFallback={isSample ? SAMPLE.label : undefined}
        showMeta
        showObjkt
      />
    </main>
  )
}
