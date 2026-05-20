# HTML Stable Diffusion PNG Info Analyzer

[English](./README.md) | [繁體中文](./README_zh_tw.md)

A browser-based tool for reading Stable Diffusion metadata embedded in PNG images.

Demo: [https://pulipulichen.github.io/HTML-Stable-Diffusion-PNG-Info-Analyzer/](https://pulipulichen.github.io/HTML-Stable-Diffusion-PNG-Info-Analyzer/)

## Overview

This project helps you inspect generation settings stored in PNG `tEXt` metadata (the `parameters` field).  
You can load one or more images, review extracted prompts and parameters, and compare differences across images.

## Features

- Analyze PNG files from local upload, drag-and-drop, clipboard paste, or image URL.
- Extract and display:
  - Prompt
  - Negative Prompt
  - Raw metadata text
  - Parsed parameter key-value pairs (for example: `Steps`, `Sampler`, `Seed`, `CFG scale`, `Model`)
- Compare multiple images and show only different parameter values.
- Copy prompt, raw text, or individual parameter values with one click.
- Preview and zoom images in a lightbox with pan/zoom controls.
- Load built-in demo images for quick testing.

## Tech Stack

- `HTML` + `Vanilla JavaScript`
- `Tailwind CSS` (via CDN)
- `Font Awesome` icons (via CDN)
- Browser APIs: `FileReader`, `DataView`, `TextDecoder`, `Clipboard API`
- Playwright E2E tests running through Docker Compose

## Project Structure

- `index.html`: main UI layout and script includes
- `js/parser.js`: PNG metadata extraction and parsing logic
- `js/app.js`: upload flow, state management, and event handling
- `js/ui.js`: gallery rendering, single view, and compare view
- `js/lightbox.js`: image zoom/pan lightbox interactions
- `css/style.css`: custom styles
- `e2e/`: Playwright end-to-end tests

## Local Usage

This is a static frontend app. You can open `index.html` directly or serve it with any static web server.

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Serve with a local static server

Example with Python:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Run E2E Tests (Docker)

```bash
docker compose up --build --exit-code-from test-runner
```

Or use the existing npm script:

```bash
npm run start
```

## Notes

- The parser currently reads Stable Diffusion metadata from PNG `tEXt` chunks with keyword `parameters`.
- If a remote image URL cannot be fetched due to CORS, download the file and upload it locally instead.
