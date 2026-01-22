---
name: pwa-setup
description: Set up or update Progressive Web App (PWA) configuration for a project.
---

# PWA Setup Skill

This skill provides instructions for setting up or updating PWA configuration, including `manifest.json` and `<link>`/`<meta>` tags in `index.html`.

## Instructions

### 1. Analyze Project Metadata
- **Name**: Extract the application name from the `<title>` tag in `index.html` or the first `#` header in `README.md`.
- **Description**: Extract a brief description from `README.md` or the `package.json` description field.
- **Theme Color**: Identify the dominant theme of the application (Dark/Light) by checking `index.css` or the class name of the `<body>` tag. Use a color that matches this theme.

### 2. Generate/Update `manifest.json`
- **name**: Use the extracted Name.
- **short_name**: A shorter version of the name (max 12 characters).
- **description**: Use the extracted Description.
- **start_url**: Use `.` or `/`.
- **display**: Usually `standalone`.
- **theme_color**: Use the identified Theme Color.
- **background_color**: A color consistent with the theme (e.g., `#0f172a` for slate-950).
- **icons**: Ensure paths to icons (favicon, apple-touch-icon, etc.) are correct. Default to `assets/favicon/` if available.

### 3. Update `index.html`
- Add `<link rel="manifest" href="manifest.json">`.
- Add `<meta name="theme-color" content="...">` matching the manifest.
- Add PWA-related apple-touch-icons and favicons.
- For MS applications:
    - Add `<meta name="msapplication-TileColor" content="...">`.
    - Add `<meta name="msapplication-TileImage" content="...">`.

## Example `manifest.json`
```json
{
  "name": "Project Name",
  "short_name": "Short Name",
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#0f172a",
  "background_color": "#0f172a",
  "description": "Project description goes here.",
  "icons": [
    {
      "src": "assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```
