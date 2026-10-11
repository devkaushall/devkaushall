# New Indian Public School, Etawah — Website

Plain HTML/CSS/JS front end with a zero-dependency Node.js server for the admission enquiry API.

## Run locally
Requirements: Node.js 18+ (no `npm install` needed).

```bash
cd nips-website
PORT=3000 node server.mjs
# open http://localhost:3000
```

To send enquiries to the office, set a webhook (optional but recommended):

```bash
ENQUIRY_WEBHOOK_URL="https://script.google.com/macros/s/XXXX/exec" PORT=3000 node server.mjs
```

Enquiries are always saved to `data/enquiries.jsonl` (one JSON object per line). The API returns `saved` and `notified` separately, and the form only shows success when the record is saved.

## Pages
`index.html` (home: hero, leadership, academics, facilities, videos, notices, enquiry, location), `about.html`, `academics.html`, `facilities.html`, `gallery.html`, `admissions.html` (with enquiry form), `contact.html`, `404.html`.

## Editing content
- Home page: edit `index.html` directly.
- Inner pages: edit the `src/*.body.html` files and run `python3 scripts/assemble.py` to regenerate the pages (header/footer come from `src/_header.html` and `src/_footer.html`). If you edit the generated HTML directly, do not re-run the script, or your changes will be overwritten.
- Styles: `assets/css/styles.css` (colours are CSS variables at the top, taken from the logo).
- Photos: add to `assets/img/` (gallery placeholders in `gallery.html` can be swapped for `<img>` tags).
- Open items: see `VERIFICATION.md`.

## Tests
```bash
node scripts/test.mjs                 # static checks, links, SEO, validation, API (213 checks)
python3 -m pip install playwright && python3 -m playwright install chromium
python3 scripts/browser_test.py http://127.0.0.1:3000   # needs the server running (129 browser checks)
```

## Deployment notes
- Static files can be served by any host, but the enquiry form needs `server.mjs` (or an equivalent `POST /api/enquiry` endpoint that accepts the same JSON).
- Put the site behind HTTPS. Update the domain in canonical/OG tags, `sitemap.xml` and `robots.txt` if it is not `nipsetawah.com`.
- Google Maps embed uses the public `output=embed` URL; no API key is needed.
