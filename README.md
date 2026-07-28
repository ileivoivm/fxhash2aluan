# fxhash2aluan

Aluan Wang（ileivoivm）自管的 fxhash 作品展示，基於 [Whitehash](https://whitehash.m3000.io/)。

線上：**https://ileivoivm.github.io/fxhash2aluan/**

不依賴 fxhash 平台後端：從 Tezos 讀取專案／token，經 IPFS 解析預覽，並以正確 seed 在受限 iframe 中 Run live。

## 個人網站 iframe

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

指定作品頁：

```html
<iframe
  src="https://ileivoivm.github.io/fxhash2aluan/works/chaos-memory"
  title="Chaos Memory"
  style="width:100%;min-height:80vh;border:0"
  loading="lazy"
  allow="fullscreen"
></iframe>
```

## 開發

```bash
cd fxhash2aluan
npm install
npm run dev
```

本機預設 `base` 仍是 `/fxhash2aluan/`（與 GitHub Pages 一致）。若要根路徑開發：

```bash
VITE_BASE_PATH=/ npm run dev
```

## 部署

push 到 `main` 後，GitHub Actions 會建置並發佈到 GitHub Pages。

手動：Repository → Settings → Pages → Source: **GitHub Actions**。

## 路由

| 路徑 | 說明 |
|------|------|
| `/` | 策展作品列表 |
| `/works/:slug` | 專案 gallery |
| `/token/chaos-memory-106` | Chaos Memory #106 預覽 + Run live |
| `/token/:contract/:tokenId` | 任意 GENTK token |

## 資料

策展清單：`src/data/projects.ts`（自己維護）。

目前：Chaos Research · Chaos Memory · Chaos Culture

## Stack

- Vite + React + TypeScript
- `@whitehash/react` · `@whitehash/ui`
- GitHub Pages
