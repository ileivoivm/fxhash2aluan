import { useEffect, useState } from 'react'
import type { ProjectIndex } from '@whitehash/chain-reader'
import {
  loadProjectIndex,
  projectIndexTokens,
  toLoadedProjectIndex,
  type LoadedProjectIndex,
} from './projectIndex'

export function useProjectIndex(slug: string | null): {
  data: LoadedProjectIndex | null
  index: ProjectIndex | null
  loading: boolean
  error: string | null
} {
  const [data, setData] = useState<LoadedProjectIndex | null>(null)
  const [index, setIndex] = useState<ProjectIndex | null>(null)
  const [loading, setLoading] = useState(Boolean(slug))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setData(null)
      setIndex(null)
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void loadProjectIndex(slug)
      .then((parsed) => {
        if (cancelled) return
        setIndex(parsed)
        setData(toLoadedProjectIndex(parsed))
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setData(null)
        setIndex(null)
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { data, index, loading, error }
}

export { projectIndexTokens }
