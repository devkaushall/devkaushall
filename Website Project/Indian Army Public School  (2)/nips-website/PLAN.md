# NIPS Etawah – Website Implementation Plan

## Inspection findings (2026-10-10)
- Workspace was empty: no existing project or stack to preserve. Chosen stack: plain HTML5 + CSS + vanilla JS (no build step) with a zero-dependency Node.js server (`server.mjs`) for the admission enquiry API.
- Live site https://nipsetawah.com is reachable (pages: Home, About, Academics, Notice Board, Gallery, Videos, Contact). Its logo, principal and manager photos are usable. Director photo and gallery poster return 404.
- Conflicting data found on third-party listings (flagged, not merged) – see VERIFICATION.md.

## Pages
index (hero, intro, academics, facilities, activities/videos, notices, enquiry, location), about, academics, facilities, gallery, admissions (+ enquiry form), contact (+ map).

## Build steps
1. Assets: official logo, principal/manager photos, YouTube thumbnails from the school's own channel.
2. Design system in styles.css (logo palette: navy #1b2f6e, red #e0202b, yellow #ffc914).
3. Pages with shared header/footer, SEO meta, JSON-LD (only verified fields), reduced-motion-safe animations.
4. server.mjs: serves static files, POST /api/enquiry validates, rate-limits, stores to data/enquiries.jsonl, optionally forwards to ENQUIRY_WEBHOOK_URL. Success is shown only when the server saves the record.
5. Tests: HTML/link/asset checks, API validation & persistence, browser checks (if Chromium available) for layout at mobile/tablet/desktop, console errors, form flow.
