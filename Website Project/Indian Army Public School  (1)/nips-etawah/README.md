# New Indian Public School, Etawah — school website

A working, original front-end for **New Indian Public School, Etawah**, built after reading the live site at [nipsetawah.com](https://nipsetawah.com) and keeping only facts the school itself publishes.

This is not a Bootstrap/Wix clone of the current ASP.NET site. Brand colours come from the official emblem (navy, crimson, gold). Photographs are the school logo, Principal and Director office photos, and stills from the school’s own YouTube channel.

## How to run

From this folder:

```bash
python3 server.py
```

Then open **http://localhost:8000** (in this environment a live preview is bound to `0.0.0.0:8000`).

The server does two jobs:

1. Serves the static HTML/CSS/JS/images.
2. Accepts `POST /api/enquiry` and **appends** the record to `data/enquiries.json` (and a line in `data/enquiries.log`).

There is **no SMTP**. A green “enquiry saved” message appears only after that file write succeeds. The form then asks the parent to also send WhatsApp (`8006000109`) or email (`nipsetawah@gmail.com`). If the API is down, the page does **not** fake success.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Hero, intro, academics, facilities, leadership, notices, gallery, map |
| `about.html` | Leadership messages, what is / is not verified |
| `academics.html` | P.G.–VIII, English conversation, parent guidelines (Hindi) |
| `facilities.html` | Only prospectus-listed amenities |
| `gallery.html` | Official stills + YouTube embeds |
| `admissions.html` | 2026–27 enquiry form |
| `contact.html` | Phones, email, map, form |
| `notices.html` | Unit test + admission circulars |

## Enquiry data

- Saved to `data/enquiries.json`
- Fields: parent name, student name, class, phone, email, address, message, timestamp, id
- Public `GET /api/enquiry` is disabled so the list is not world-readable
- Honeypot field `website` is ignored

## Stack

Plain HTML, CSS and JavaScript plus a standard-library Python 3 server. No React/Vite/Bootstrap. Fonts (Fraunces, Outfit, Noto Sans Devanagari) are self-hosted in `assets/fonts/`.

## Tests run (10 Oct 2026)

| Check | Result |
| --- | --- |
| All 8 pages + CSS/JS/logo/photos/robots/sitemap | HTTP 200 |
| Image paths in HTML | none missing |
| Skip link, viewport, title, description, Open Graph | present |
| Admission POST `/api/enquiry` | 200, written to `data/enquiries.json` |
| Missing fields | 422 |
| Honeypot spam field | ignored |
| Public GET of enquiries | 405 (not listed) |
| Fake “email sent” success | not used |
| “CBSE affiliated” claim | not present (only CBSE pattern) |
| Images from other schools | not used |

Open the live preview on port 8000 to check mobile nav, form, gallery lightbox and map in a browser.

Pending confirmation items are listed in `VERIFICATION.md`.
