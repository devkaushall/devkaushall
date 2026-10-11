# Apple's Pizza, Etawah — Website

A complete, evidence-based redesign & rebuild of the Apple's Pizza (Etawah) website.

## Run it
```bash
python3 /home/user/server.py
# → http://localhost:8000  (binds 0.0.0.0; custom 404; clean URLs like /menu)
```
No dependencies, no build step. Any static host works too (`site/` is plain HTML/CSS/JS).

## Layout
- `site/` — the website (12 pages, `assets/css`, `assets/js`, `assets/img`, `sitemap.xml`, `robots.txt`)
- `site/assets/js/data.js` — single source of truth for menu/outlets/offers (generated)
- `research/` — evidence sheet (`RESEARCH.md`), API snapshots (`*.json`), asset generator (`build_assets.py`)
- `server.py` — stdlib static server with clean URLs + styled 404
- `.tests/` — jsdom functional suite (`test.js`, 46 assertions) + Chrome screenshot suite (`shot.js`)
- `IMPLEMENTATION_STATUS.md` — feature/test/limitation report

## Refresh the menu from the live official API
```bash
cd research && python3 build_assets.py   # downloads brand assets + regenerates data.js
```

## Tests
```bash
node .tests/test.js   # 46/46 functional assertions
node .tests/shot.js   # desktop/tablet/mobile screenshots in .tests/shots/
```
