# fxhash2aluan

Self-hosted gallery of [Aluan Wang](https://aluanwang.com) (ileivoivm) fxhash works, built with [Whitehash](https://whitehash.m3000.io/).

**Live:** https://ileivoivm.github.io/fxhash2aluan/  
**Repo:** https://github.com/ileivoivm/fxhash2aluan

Reads projects and tokens from Tezos, resolves IPFS covers/previews, and runs correctly seeded live artwork in a sandboxed iframe — without the fxhash platform backend.

## Features

- Curated project list with on-chain covers (`displayUri` / `thumbnailUri`)
- Project pages with cover, chain metadata, and iteration grid
- Token page: static preview + **Run live** + link to [objkt](https://objkt.com)
- Chaos Research: hide test mints `#1`–`#5`
- Collage: exact name filter so older genesis `COLLAGE` tokens are not mixed in

## Embed (WordPress / iframe modules)

Interactive bits are served from GitHub Pages as **minimal chrome** routes under `/embed/…`. Keep essay copy, dates, and site nav on WordPress; iframe only the cover live / edition gallery / token viewer.

Optional query: `?theme=dark` (default) or `?theme=light`.

### Chaos Research (pilot for [aluanwang.com long-form](https://aluanwang.com/long-form/chaosresearch/))

Suggested page structure on WordPress:

1. Existing English essay (unchanged)
2. Cover live iframe (replaces / complements static hero image)
3. Editions gallery iframe (replaces static image gallery)
4. Meta row as needed; fxhash links can point to objkt or self-hosted live

```html
<!-- Cover live (previewHash) -->
<iframe
  src="https://ileivoivm.github.io/fxhash2aluan/embed/chaos-research/cover"
  title="Chaos Research — cover live"
  style="width:100%;aspect-ratio:1;border:0;background:#0c0b0a"
  loading="lazy"
  allow="fullscreen"
></iframe>

<!-- Edition gallery (hides #1–#5; click opens full token page in a new tab) -->
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

Other curated projects use the same pattern: `/embed/<slug>/cover` and `/embed/<slug>/gallery`.

Full-app iframe (entire works UI) is still available:

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

> `@whitehash/*` must come from the official npm registry. This repo includes `.npmrc` with `registry=https://registry.npmjs.org/`.

## Deploy

Push to `main` → GitHub Actions builds and publishes GitHub Pages.

Manual check: **Settings → Pages → Source: GitHub Actions**.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Project grid (covers + titles from chain) |
| `/works/:slug` | Project cover + iteration gallery |
| `/works/:slug/live` | Cover live (`previewHash`) |
| `/token/chaos-memory-106` | Sample: Chaos Memory #106 |
| `/token/:contract/:tokenId` | Any GENTK token (preview, live, objkt) |
| `/embed/:slug/cover` | Embed: cover live only |
| `/embed/:slug/gallery` | Embed: edition grid (opens token in new tab) |
| `/embed/token/:contract/:tokenId` | Embed: single token viewer |

## Curated projects

Refs live in `src/data/projects.ts` (slug ↔ `v2:<issuer_id>`). Titles, descriptions, and covers come from chain metadata via Whitehash.

| slug | projectId | notes |
|------|-----------|--------|
| `chaos-research` | `v2:5101` | hide iterations 1–5 |
| `chaos-memory` | `v2:11068` | sample token #106 |
| `collage-1` | `v2:11805` | exact-name filter vs genesis `COLLAGE` |
| `chaos-culture` | `v2:13447` | |
| `turner-light` | `v2:17146` | ileivoivm II |
| `avlab-23` | `v2:19928` | ileivoivm II |

### Objkt links

| GENTK contract | objkt path |
|----------------|------------|
| `KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE` | `fxhashgenesis` |
| `KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi` | `fxhash` |

Example: [Chaos Research #231](https://objkt.com/tokens/fxhashgenesis/269937) → `https://objkt.com/tokens/fxhashgenesis/269937`

## Stack

- Vite 5 + React 19 + TypeScript
- `@whitehash/react` · `@whitehash/ui` · `@whitehash/chain-reader`
- React Router · GitHub Pages (Actions)
