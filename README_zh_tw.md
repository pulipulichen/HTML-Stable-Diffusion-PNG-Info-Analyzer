# HTML Stable Diffusion PNG Info Analyzer

[English](./README.md) | [繁體中文](./README_zh_tw.md)

一個在瀏覽器中讀取 Stable Diffusion PNG 中繼資料的工具。

Demo: [https://pulipulichen.github.io/HTML-Stable-Diffusion-PNG-Info-Analyzer/](https://pulipulichen.github.io/HTML-Stable-Diffusion-PNG-Info-Analyzer/)

## 專案簡介

此專案可協助你檢視 PNG `tEXt` 中儲存的生成參數（`parameters` 欄位）。  
你可以一次載入多張圖片，查看抽取出的提示詞與參數，並比對圖片之間的差異。

## 功能重點

- 支援本機上傳、拖曳、貼上剪貼簿、圖片網址載入 PNG。
- 可抽取並顯示：
  - Prompt（正向提示詞）
  - Negative Prompt（反向提示詞）
  - Raw metadata 原始文字
  - 解析後的參數鍵值（例如：`Steps`、`Sampler`、`Seed`、`CFG scale`、`Model`）
- 多圖比較模式只顯示「有差異」的參數。
- 一鍵複製 Prompt、Raw 內容與各參數值。
- 內建燈箱檢視，支援圖片放大與拖曳平移。
- 可快速載入內建示範圖片。

## 技術堆疊

- `HTML` + `Vanilla JavaScript`
- `Tailwind CSS`（CDN）
- `Font Awesome` 圖示（CDN）
- 瀏覽器 API：`FileReader`、`DataView`、`TextDecoder`、`Clipboard API`
- 透過 Docker Compose 執行 Playwright E2E 測試

## 專案結構

- `index.html`：主畫面與腳本載入
- `js/parser.js`：PNG 中繼資料解析邏輯
- `js/app.js`：上傳流程、狀態管理與事件處理
- `js/ui.js`：圖片列表、單圖檢視與差異比較畫面
- `js/lightbox.js`：燈箱放大與拖曳互動
- `css/style.css`：自訂樣式
- `e2e/`：Playwright 端對端測試

## 本機使用方式

這是純前端靜態專案，可直接開啟 `index.html`，或透過任一靜態伺服器提供服務。

### 方式一：直接開啟

使用瀏覽器直接開啟 `index.html`。

### 方式二：使用本機靜態伺服器

以 Python 為例：

```bash
python3 -m http.server 8080
```

然後開啟 `http://localhost:8080`。

## 執行 E2E 測試（Docker）

```bash
docker compose up --build --exit-code-from test-runner
```

或使用既有 npm script：

```bash
npm run start
```

## 備註

- 目前解析器會讀取 PNG `tEXt` 區塊中關鍵字為 `parameters` 的 Stable Diffusion 資料。
- 若圖片網址受 CORS 限制而無法抓取，建議先下載圖片再以本機檔案上傳。
