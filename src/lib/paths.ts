/** Absolute URL helper for opening full-site pages from embeds. */
export function appPath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export function absoluteAppUrl(path: string): string {
  if (typeof window === 'undefined') return appPath(path)
  return new URL(appPath(path), window.location.origin).toString()
}
