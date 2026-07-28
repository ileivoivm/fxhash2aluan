import { useParams } from 'react-router-dom'
import type { WhitehashToken } from '@whitehash/chain-reader'
import { getProject } from '../../data/projects'
import { absoluteAppUrl } from '../../lib/paths'
import { ProjectGalleryEmbed } from '../../modules/ProjectGalleryEmbed'

export function EmbedGalleryPage() {
  const { slug = '' } = useParams()
  const projectRef = getProject(slug)

  if (!projectRef) {
    return (
      <main className="embed">
        <p className="error">Project not found.</p>
      </main>
    )
  }

  const onOpenToken = (token: WhitehashToken) => {
    const path = `/token/${token.contract}/${token.tokenId}?from=${encodeURIComponent(slug)}`
    window.open(absoluteAppUrl(path), '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="embed">
      <ProjectGalleryEmbed projectRef={projectRef} onOpenToken={onOpenToken} />
    </main>
  )
}
