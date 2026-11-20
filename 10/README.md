# 學習日誌 · edge-study-notes

把第 9 週的 Cloudflare 學習日誌打包成 Node.js 命令列套件。網站支援新增、編輯、刪除、搜尋與分類篩選，首次啟動會看到三則範例。

## 啟動

需要 Node.js 22 以上。直接執行：

```powershell
npx.cmd edge-study-notes --port 8790
```

也可以安裝後使用：

```powershell
npm.cmd install -g edge-study-notes
edge-study-notes.cmd --port 8790
```

開啟終端機印出的網址。省略 `--port` 時使用 8787，按 Ctrl+C 關閉伺服器。服務只監聽本機。瀏覽器會依網址及連接埠分開儲存筆記，更換網址或連接埠時會看到另一份筆記。

## 本機打包及驗證

```powershell
npm.cmd pack
npx.cmd --yes --package .\edge-study-notes-1.0.0.tgz edge-study-notes --port 8790
```

## 發布到 npm

使用有發布權限的 npm 帳號登入，並完成 npm 提示的兩步驟驗證。

```powershell
npm.cmd login
npm.cmd publish --access public
npm.cmd view edge-study-notes@1.0.0 version
```

## Cloudflare Workers

原始的靜態網站在 `public/`，搭配 `wrangler.jsonc` 可從此目錄部署。

```powershell
npx.cmd wrangler login
npx.cmd wrangler deploy
```


## JSR 備案（Deno 2.8 以上）

在本目錄啟動 Deno 版：

```powershell
npx.cmd --yes deno@2.9.6 run --allow-net=127.0.0.1 --config jsr.json mod.ts --port 8790
```

JSR 套件名稱為 `@peter-dev/edge-study-notes`。發布時需使用有此套件發布權限的帳號。

```powershell
npx.cmd --yes deno@2.9.6 publish --config jsr.json --dry-run --allow-dirty
npx.cmd --yes deno@2.9.6 publish --config jsr.json --allow-dirty
```

完成瀏覽器授權後，即可用 `deno run --allow-net=127.0.0.1 jsr:@peter-dev/edge-study-notes@1.0.0` 啟動。
