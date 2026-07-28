import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from 'react-router-dom'
import { WhitehashProvider } from '@whitehash/ui'
import '@whitehash/ui/styles.css'
import { HomePage } from './pages/HomePage'
import { WorkPage } from './pages/WorkPage'
import { ProjectLivePage } from './pages/ProjectLivePage'
import { TokenPage } from './pages/TokenPage'
import { EmbedCoverPage } from './pages/embed/EmbedCoverPage'
import { EmbedGalleryPage } from './pages/embed/EmbedGalleryPage'
import { EmbedTokenPage } from './pages/embed/EmbedTokenPage'
import './App.css'

/** Must match Vite `base` (no trailing slash for react-router). */
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || ''

function useEmbedTheme() {
  const { pathname } = useLocation()
  const [search] = useSearchParams()
  const isEmbed = pathname.startsWith('/embed')
  const theme = search.get('theme')

  useEffect(() => {
    if (!isEmbed) {
      document.documentElement.removeAttribute('data-embed-theme')
      return
    }
    document.documentElement.dataset.embedTheme =
      theme === 'light' ? 'light' : 'dark'
  }, [isEmbed, theme])

  return isEmbed
}

function AppShell() {
  const isEmbed = useEmbedTheme()

  return (
    <div className={isEmbed ? 'shell embed-shell' : 'shell'}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/works/:slug" element={<WorkPage />} />
        <Route path="/works/:slug/live" element={<ProjectLivePage />} />
        <Route path="/token/chaos-memory-106" element={<TokenPage />} />
        <Route path="/token/:contract/:tokenId" element={<TokenPage />} />
        <Route path="/embed/:slug/cover" element={<EmbedCoverPage />} />
        <Route path="/embed/:slug/gallery" element={<EmbedGalleryPage />} />
        <Route
          path="/embed/token/:contract/:tokenId"
          element={<EmbedTokenPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <WhitehashProvider>
      <BrowserRouter basename={BASENAME}>
        <AppShell />
      </BrowserRouter>
    </WhitehashProvider>
  )
}
