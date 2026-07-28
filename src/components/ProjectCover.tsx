import { useGatewayImage } from '@whitehash/react'
import type { ChainId } from '@whitehash/chain-reader'

export function ProjectCover({
  uri,
  chain,
  alt,
  className = 'project-cover',
}: {
  uri: string | null
  chain: ChainId
  alt: string
  className?: string
}) {
  const { src, onError, failed } = useGatewayImage(uri, chain)

  return (
    <div className={className}>
      {src && !failed ? (
        <img src={src} alt={alt} onError={onError} loading="lazy" />
      ) : (
        <div className="project-cover-fallback" aria-hidden />
      )}
    </div>
  )
}
