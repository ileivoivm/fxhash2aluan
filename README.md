# fxhash2aluan

Self-hosted gallery of [Aluan Wang](https://aluanwang.com) (ileivoivm) fxhash works, built with [Whitehash](https://whitehash.m3000.io/).

**Live:** https://ileivoivm.github.io/fxhash2aluan/  
**Repo:** https://github.com/ileivoivm/fxhash2aluan

Durable data is **hosted Whitehash Archive JSON** (`whitehash-project-index@1` / `whitehash-token-index@1`). The UI loads indexes with `parseProjectIndex` / `parseTokenIndex`, then renders with `Artwork` (IPFS preview + sandboxed Run live). No fxhash platform backend.

```text
@whitehash/archive CLI  →  public/indexes/*.json  →  Pages
                              ↓
                    parseProjectIndex / parseTokenIndex
                              ↓
                         Artwork.* (live)
```

## Features

- Hosted project indexes under `/indexes/<slug>.json`
- Gallery / home / work pages read indexes (no live TzKT discovery for lists)
- Cover · Run live uses on-chain `previewHash` (official project cover), not a minted edition
- Sample token indexes for deep links / archive samples
- Token page: preview + **Run live** + [objkt](https://objkt.com) link
- Chaos Research: drop shared placeholder thumbs (keep real `#1`–`#n`)
- Collage: exact-name filter vs older genesis `COLLAGE`

## Preserve (Whitehash Archive)

Official tooling: [`@whitehash/archive`](https://www.npmjs.com/package/@whitehash/archive) · [CLI guide](https://whitehash.m3000.io/guide/cli/)

```bash
# Both project + sample token indexes (committed; served on Pages)
npm run archive

# Or separately:
npm run archive:projects
npm run archive:samples

# Cold offline folders (gitignored under archives/)
# Uses official `wallet` + `verify` (CLI 0.0.1)
npm run archive:cold
npm run archive:verify
```

| Path | Format | On Pages? |
|------|--------|-----------|
| `public/indexes/<slug>.json` | `whitehash-project-index@1` | Yes |
| `public/indexes/tokens/<slug>-N.json` | `whitehash-token-index@1` | Yes |
| `archives/*` | offline wallet gallery + integrity | No (local cold storage) |

Hosted indexes:

- https://ileivoivm.github.io/fxhash2aluan/indexes/chaos-research.json
- https://ileivoivm.github.io/fxhash2aluan/indexes/chaos-memory.json
- https://ileivoivm.github.io/fxhash2aluan/indexes/collage-1.json
- https://ileivoivm.github.io/fxhash2aluan/indexes/chaos-culture.json
- https://ileivoivm.github.io/fxhash2aluan/indexes/turner-light.json
- https://ileivoivm.github.io/fxhash2aluan/indexes/avlab-23.json

After curation changes: run `npm run archive`, commit the JSON, push. Or run GitHub Action **Archive refresh** (`workflow_dispatch`) to open a PR with regenerated indexes.

## Embed (WordPress / iframe modules)

Serve interactive bits from Pages under `/embed/…`. Keep essay copy and nav on WordPress.

Optional query: `?theme=dark` (default) or `?theme=light`.

### Chaos Research ([long-form](https://aluanwang.com/long-form/chaosresearch/))

```html
<!-- Cover live (curated sample edition from archive index) -->
<iframe
  src="https://ileivoivm.github.io/fxhash2aluan/embed/chaos-research/cover"
  title="Chaos Research — cover live"
  style="width:100%;aspect-ratio:1;border:0;background:#0c0b0a"
  loading="lazy"
  allow="fullscreen"
></iframe>

<!-- Editions (placeholder-thumb duplicates filtered; click opens token page) -->
<iframe
  src="https://ileivoivm.github.io/fxhash2aluan/embed/chaos-research/gallery"
  title="Chaos Research — editions"
  style="width:100%;min-height:720px;border:0;background:#0c0b0a"
  loading="lazy"
  allow="fullscreen"
></iframe>
```

Optional single-token embed:

```html
<iframe
  src="https://ileivoivm.github.io/fxhash2aluan/embed/token/KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE/269704"
  title="Chaos Research edition — live"
  style="width:100%;aspect-ratio:1;border:0;background:#0c0b0a"
  loading="lazy"
  allow="fullscreen"
></iframe>
```

Same pattern for other slugs: `/embed/<slug>/cover` and `/embed/<slug>/gallery`.

Full-app iframe:

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

## Develop

```bash
git clone git@github.com:ileivoivm/fxhash2aluan.git
cd fxhash2aluan
npm install
npm run dev
```

Open the Local URL Vite prints (base path is `/fxhash2aluan/`).

Root-path local dev:

```bash
VITE_BASE_PATH=/ npm run dev
```

> `@whitehash/*` must come from the official npm registry (see `.npmrc`).

## Deploy

Push to `main` → **Deploy GitHub Pages** builds `dist` (includes `public/indexes/**`).

Settings → Pages → Source: **GitHub Actions**.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Project grid from hosted indexes |
| `/works/:slug` | Cover + iteration gallery |
| `/works/:slug/live` | Cover live (sample edition from index) |
| `/token/chaos-memory-106` | Chaos Memory #106 via token index |
| `/token/:contract/:tokenId` | Any GENTK token (chain read + live + objkt) |
| `/indexes/<slug>.json` | `whitehash-project-index@1` |
| `/indexes/tokens/*.json` | `whitehash-token-index@1` |
| `/embed/:slug/cover` | Embed: cover live |
| `/embed/:slug/gallery` | Embed: edition grid |
| `/embed/token/:contract/:tokenId` | Embed: single token |

## Curated projects

Refs in [`src/data/projects.ts`](src/data/projects.ts) (slug ↔ `v2:<issuer_id>`). Display copy and iterations come from hosted indexes.

| slug | projectId | notes |
|------|-----------|--------|
| `chaos-research` | `v2:5101` | filter placeholder thumbs; sample `#6` |
| `chaos-memory` | `v2:11068` | sample `#106` |
| `collage-1` | `v2:11805` | exact-name filter; sample `#1` |
| `chaos-culture` | `v2:13447` | sample `#1` |
| `turner-light` | `v2:17146` | ileivoivm II; sample `#1` |
| `avlab-23` | `v2:19928` | ileivoivm II; sample `#1` |

### Objkt links

| GENTK contract | objkt path |
|----------------|------------|
| `KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE` | `fxhashgenesis` |
| `KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi` | `fxhash` |

Example: [Chaos Research #231](https://objkt.com/tokens/fxhashgenesis/269937)

## Stack

- Vite 5 + React 19 + TypeScript
- `@whitehash/archive` · `@whitehash/chain-reader` · `@whitehash/react` · `@whitehash/ui`
- React Router · GitHub Pages (Actions)
