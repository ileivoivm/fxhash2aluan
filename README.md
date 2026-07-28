# fxhash2aluan

Self-hosted fxhash works for Aluan Wang (ileivoivm), powered by [Whitehash](https://whitehash.m3000.io/).

Live: **https://ileivoivm.github.io/fxhash2aluan/**

Reads projects and tokens from Tezos, resolves IPFS previews, and runs correctly seeded live artwork in a sandboxed iframe — no fxhash platform backend.

## Embed on a personal site

```html
<iframe
  src="https://ileivoivm.github.io/fxhash2aluan/"
  title="Aluan Wang — fxhash works"
  style="width:100%;min-height:80vh;border:0;background:#0c0b0a"
  loading="lazy"
  allow="fullscreen"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>
```

Project page:

```html
<iframe
  src="https://ileivoivm.github.io/fxhash2aluan/works/chaos-memory"
  title="Chaos Memory"
  style="width:100%;min-height:80vh;border:0"
  loading="lazy"
  allow="fullscreen"
></iframe>
```

## Develop

```bash
cd fxhash2aluan
npm install
npm run dev
```

Default Vite `base` is `/fxhash2aluan/` (same as GitHub Pages). For root-path local dev:

```bash
VITE_BASE_PATH=/ npm run dev
```

## Deploy

Push to `main` → GitHub Actions builds and publishes Pages.

Settings → Pages → Source: **GitHub Actions**.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Curated project list (titles/descriptions from chain) |
| `/works/:slug` | Project gallery |
| `/token/chaos-memory-106` | Chaos Memory #106 preview + Run live |
| `/token/:contract/:tokenId` | Any GENTK token |

## Data

Curated refs only in `src/data/projects.ts` (slug ↔ on-chain `v2:<id>`). Display copy comes from Whitehash / chain metadata.

| slug | projectId |
|------|-----------|
| chaos-research | `v2:5101` (hide iterations 1–5) |
| chaos-memory | `v2:11068` |
| collage-1 | `v2:11805` |
| chaos-culture | `v2:13447` |
| turner-light | `v2:17146` |
| avlab-23 | `v2:19928` |

## Stack

- Vite + React + TypeScript
- `@whitehash/react` · `@whitehash/ui`
- GitHub Pages
