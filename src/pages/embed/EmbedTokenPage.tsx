import { useParams } from 'react-router-dom'
import { TokenViewer } from '../../modules/TokenViewer'

export function EmbedTokenPage() {
  const { contract, tokenId } = useParams()

  if (!contract || !tokenId) {
    return (
      <main className="embed">
        <p className="error">Missing token.</p>
      </main>
    )
  }

  return (
    <main className="embed">
      <TokenViewer
        input={{
          chain: 'tezos:mainnet',
          contract,
          tokenId,
        }}
        showMeta={false}
        showObjkt
      />
    </main>
  )
}
