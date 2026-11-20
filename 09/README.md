# 學習日誌

繁體中文筆記網站，支援新增、編輯、刪除、搜尋與分類篩選。首次開啟有三則可修改的範例。筆記以目前網址和瀏覽器的 localStorage 儲存，本機和正式站各有自己的筆記。

## 本機開發

使用 Node.js 24，在本目錄執行：

```powershell
npm.cmd ci
npm.cmd run dev
```

開啟終端機顯示的網址，預設為 http://localhost:8787。執行 `npm.cmd run check` 檢查 JavaScript 語法和 Wrangler 部署設定。

## 部署到 Cloudflare Workers

```powershell
npx.cmd wrangler login
npm.cmd run deploy
```

在瀏覽器完成 Cloudflare 授權後，部署指令會輸出正式的 `workers.dev` 網址。若帳號尚未設定 Workers 子網域，依 Wrangler 提示設定後重新部署。

`public/` 包含網站靜態檔案。`wrangler.jsonc` 設定 Worker 名稱和資產路徑。

- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [ccc-cloudflare/test-apps](https://github.com/ccc-cloudflare/test-apps/)
- [用 Cloudflare 架設網站](https://github.com/cccbook/cccbook2026/blob/main/電腦/網站設計/用Cloudflare架設網站/README.md)
