## 0.0.1

### Added
- Introduced a modular frontend structure by splitting logic into dedicated files such as `js/app.js`, `js/ui.js`, `js/lightbox.js`, `js/parser.js`, and `js/utils.js`.
- Added PWA baseline assets and configuration, including `manifest.json`, generated favicon assets, and related HTML metadata integration.
- Added end-to-end testing scaffolding with Playwright (`e2e/basic.spec.js`, `e2e/upload.spec.js`) and container-based test setup files (`Dockerfile.test`, `docker-compose.yml`, `playwright.config.js`).
- Added CI automation for E2E validation via `.github/workflows/e2e.yml`.
- Added a centralized i18n module (`js/i18n.js`) with English and Traditional Chinese dictionaries, browser-language detection, and `localStorage` persistence.
- Added a project-level `.jslintrc` to align JSHint with ES11 browser-side JavaScript usage.
- Added a thumbnail grid browsing mode with a dedicated top-bar view toggle, image cards, quick zoom action, and direct jump-to-analysis action.
- Added adjustable grid thumbnail sizing controls (`small`, `medium`, `large`) for faster visual scanning across different gallery densities.
- Added a dedicated Playwright E2E scenario (`e2e/grid-mode.spec.js`) to cover grid view switching, keyboard shortcut toggling (`g`), and thumbnail size changes.
- Added keyboard navigation support for gallery browsing using `PageUp`/`PageDown` to switch images without clicking thumbnails.
- Added a shortcut-help modal opened from a dedicated top-bar button to keep shortcut documentation scalable as new bindings are introduced.
- Added modularized runtime entry points under `js/app/` and `js/ui/` to separate state, data loading, image actions, and view rendering responsibilities.
- Added a project-level `.jshintrc` to ensure JSHint reads ES11 browser settings consistently.

### Changed
- Updated image loading flow to support default demo image loading and improved upload behavior.
- Switched demo loading to a manifest-driven flow (`demo/demo-images.json`) and added a top-bar quick action to load all demo images in one click.
- Expanded the demo manifest list to include multiple sample PNG files and improved demo fetch handling for reliable batch loading in one action.
- Refined lightbox and preview interaction behavior for zoom and drag operations.
- Updated internal agent skill documents for E2E test generation and GitHub Actions E2E setup.
- Updated `index.html` and runtime UI flows to use translation keys, including language switching controls and localized static/dynamic messages.
- Updated parser, toast, compare view, and copy interactions to render locale-aware fallback text and prompts.
- Refactored i18n dictionaries into separate locale files and standardized global namespace loading via `window.I18N_TRANSLATIONS.<lang>` with locale scripts loaded before `js/i18n.js`.
- Updated runtime keyboard handling to support one-key view switching between single analysis and grid mode when images are available.
- Updated `e2e/upload.spec.js` selectors to target the current demo-loading control (`[data-action="load-demo-images"]`) and made the assertion resilient to manifest image-count changes.
- Moved the single-analysis and difference-compare view toggles from the top bar into the left sidebar to keep all view navigation entry points in one consistent location.
- Replaced the always-visible shortcut text block with a cleaner button-and-modal interaction pattern in the top bar.
- Moved the `Thumbnail Grid` toggle into the top section of the left sidebar and aligned its styling with sidebar navigation behavior.
- Reduced `js/app.js` and `js/ui.js` to lightweight entry files while shifting business logic into dedicated submodules.

### Fixed
- Corrected image preview aspect ratio rendering issues.
- Fixed zoom direction behavior in the image viewer interaction.
- Reduced excessive top/bottom whitespace in single-view image previews by replacing the forced square preview container with responsive height constraints.
- Disabled the thumbnail grid mode button when no images are loaded and guarded view switching to prevent entering grid mode without data.

### Documentation
- Updated `README.md` to reflect recent UI and interaction updates.
- Updated the global i18n skill guidance to explicitly require `window.I18N_TRANSLATIONS.<lang>` for locale file registration and initialization order consistency.
- Updated global JS/CSS separation skill guidance to use `.jshintrc` with `esversion: 11` for modern JavaScript compatibility.
