# Opensplice DDS Static Website

This repository contains a simple static website for Opensplice DDS. It uses plain
HTML, CSS, and JavaScript only. No backend, build step, package manager, or
framework is required.

## Project Structure

- `index.html` - main entry point for the website
- `product-offering.html` - product offering page
- `white-papers.html` - white papers page
- `download-product.html` - download product page
- `support.html` - support page
- `webcasts.html` - webcasts page
- `styles.css` - shared styles
- `script.js` - browser-only interactions
- `assets/` - shared images and diagrams
- `customerlogos/` - customer logo images used by the home page
- `.nojekyll` - tells GitHub Pages to serve files directly

## Test Locally

From the repository root, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

You can also open `index.html` directly in a browser, but using a local server
is closer to how GitHub Pages serves the site.

## GitHub Pages Setup

After pushing this project to GitHub, enable GitHub Pages:

1. Open the repository on GitHub.
2. Go to `Settings`.
3. Open `Pages`.
4. Under `Build and deployment`, set `Source` to `Deploy from a branch`.
5. Set `Branch` to `main`.
6. Set the folder to `/ (root)`.
7. Save.

GitHub Pages should publish the site at:

```text
https://RamziKaroui.github.io/html-pages-site/
```

If you use a different repository name, replace `html-pages-site` in the URL
with that repository name.
