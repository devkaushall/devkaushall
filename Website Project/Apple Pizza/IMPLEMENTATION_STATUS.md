# Apple's Pizza, Etawah — Implementation Status

**Date:** 2026-10-10 · **Site root:** `/home/user/site` · **Run:** `python3 /home/user/server.py` → http://localhost:8000 (see README.md)

## What was built
A complete, responsive, multi-page website (vanilla HTML/CSS/JS, no build step, stdlib-only server):

| Page | Status | Notes |
|---|---|---|
| `index.html` | ✅ Done | Hero, category rail, 8 signature items, live offers, pure-veg band, story + stats, outlets, gallery teaser, sourced public ratings, CTA |
| `menu.html` | ✅ Done | All 63 verified items, 10 categories, search, sort, category filter, deep links (`#cat-…`), product modal with size/crust/cheese/topping customisation & per-size pricing |
| `cart.html` | ✅ Done | localStorage cart, qty/remove, bill summary with savings, validated checkout (delivery/pickup, outlet, address), honest no-payment flow → WhatsApp/call/Zomato/official site |
| `offers.html` | ✅ Done | 5 brand-published promos with terms + 4 Pizza Mania combos |
| `outlets.html` | ✅ Done | Both outlets (never merged), addresses, plus code, ratings, services, maps, copy-address, "order from here" outlet switcher |
| `about.html` | ✅ Done | Verified-only story, timeline, brand photos with captions |
| `gallery.html` | ✅ Done | 22 photos, category filters, accessible lightbox (Esc/backdrop close) |
| `contact.html` | ✅ Done | Verified phone/email/FB, validated mailto-based form with honeypot + honest status messaging |
| `faq.html` | ✅ Done | 12 factual FAQs; unverified answers flagged as such |
| `privacy.html` / `terms.html` | ✅ Done | Truthful: no server storage, no trackers, no payments |
| `404.html` | ✅ Done | Custom 404 served by `server.py` for any bad URL |
| SEO | ✅ Done | Unique titles/descriptions, canonicals, OG tags, JSON-LD Restaurant (both outlets), `sitemap.xml`, `robots.txt`, semantic headings, alt text |

## Data provenance (no invented facts)
- **Menu (63 items, sizes, crust/cheese/topping add-on pricing, 40% discount flag):** fetched live from the brand's own public API `api.applespizza.com/api/menu-items?limit=500` + `/api/categories` + `/api/banners` on 2026-10-10; snapshots in `/home/user/research/*.json`; compiled into `site/assets/js/data.js` by `research/build_assets.py`.
- **Imagery:** 33 official product photos, category art, promo banners (optimised from 2 MB PNGs to ~300 KB JPGs), logo, plus photos from the brand's own claimed Justdial listings. Items whose official image was actually the logo file are shown with category-photo fallback or a typographic tile — never a fake photo.
- **Outlets/contacts/hours/ratings:** cross-checked Justdial (both listings), Zomato, restaurant-guru, indiapl, Facebook page. Conflicts (closing 9 vs 10 PM; two phone numbers) are surfaced honestly on-page, not silently merged.
- Full evidence sheet: `/home/user/research/RESEARCH.md`.

## Testing (all reproducible)
- `node /home/user/.tests/test.js` — **46/46 PASS** (jsdom executes every page): renders, search/filter/sort, modal price math (medium+Cheese Burst = ₹280 ✔), cart add/qty/remove/totals, checkout validation, WhatsApp link, empty states, zero console errors on all 12 pages.
- `node /home/user/.tests/shot.js` — real-Chrome screenshots at 1280/768/390 px of home, menu, cart, outlets: layouts verified visually, **zero console/page errors**; scroll-reveal verified.
- HTTP smoke test: every route 200, clean URLs (`/menu`) work, unknown URL → styled 404.
- `node --check` on all JS. Link/asset audit: no broken references.

## Known limitations (by design / honesty)
- No backend: orders are handed to the outlet via WhatsApp/call or the brand's existing channels (official site, Android app, Zomato). No payments are simulated.
- No live delivery-area/fee data — presented as "confirmed by outlet".
- Menu is a verified snapshot (10 Oct 2026); regeneration = re-run `research/build_assets.py`.
- Emojis used decoratively; on systems without emoji fonts they degrade to boxes but all meaning is carried by text/SVG.

## Requires management confirmation (see RESEARCH.md §10)
Exact closing hours per outlet; which phone number per outlet; delivery radius/fees/minimums; payment methods; Instagram/YouTube handles; applespizza.in redirect.
