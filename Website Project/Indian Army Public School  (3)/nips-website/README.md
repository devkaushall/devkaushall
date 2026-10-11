# New Indian Public School, Etawah — Website

Professional, responsive school website (redesign project) for **New Indian Public School, Etawah**.
All published facts are sourced from the school's official website (nipsetawah.com) and its official
YouTube channel, verified on **10 Oct 2026**. Unverified items are flagged — see `VERIFICATION.md`.

## Run the website

Requires Node.js 18+ (uses built-in `fetch` for optional webhook forwarding). **No npm packages needed.**

```bash
cd nips-website
node server.js            # default port 3000
# or
PORT=8080 node server.js
```

Then open `http://localhost:3000` (or the live preview URL).

## Where enquiry-form data goes

The admission enquiry form submits to `POST /api/enquiry` handled by `server.js`:

1. **Always** — appended to `data/enquiries.jsonl` on the server (one JSON record per line, with a
   reference id like `NIPS-1A2B3C`).
2. **Optionally** — if the environment variable `ENQUIRY_WEBHOOK_URL` is set (e.g. a Zapier/Make hook,
   Google Apps Script, or any endpoint that emails `nipsetawah@gmail.com` / writes to a sheet), each
   enquiry is also forwarded there.

```bash
ENQUIRY_WEBHOOK_URL=https://hooks.example.com/nips node server.js
```

The front-end **never fakes success**: it only shows a confirmation when the API returns `ok:true`,
and on any failure it tells the parent to call 80060 00109 / 97200 85999 or use WhatsApp instead.
Check `GET /api/health` to see whether the webhook is configured.

To read enquiries on the server: `cat data/enquiries.jsonl`.

## Pages

| File               | Purpose                                                            |
| ------------------ | ------------------------------------------------------------------ |
| `public/index.html`    | Home — hero, stats, why-choose, leadership, notices, videos, map |
| `public/about.html`    | Mission, vision, values, full leadership messages               |
| `public/academics.html`| P.G.–VIII stages, teaching approach, exam circular              |
| `public/facilities.html`| The 9 facilities published by the school (verified)              |
| `public/gallery.html`  | Official YouTube videos (Annual Day, Vidhyaarambh, reels)        |
| `public/admissions.html`| 4-step process, documents, offer, working enquiry form          |
| `public/contact.html`  | Address/phones/email/WhatsApp, Google Map, quick enquiry form    |
| `public/404.html`      | Friendly not-found page                                           |

## Editing content

- Notices / announcements: edit the `.notice` blocks and the `.ticker-group` spans.
- Leadership photos: replace `public/assets/manager.jpg`, `principal.jpg`; add `director.jpg` once
  the school provides it (a monogram placeholder is shown until then).
- Videos: swap YouTube embed ids in `gallery.html` / `index.html`.
- Colours / fonts: `public/css/styles.css` `:root` tokens.

## Verified sources (10 Oct 2026)

- https://nipsetawah.com (Home, About, Notices, Gallery, Videos)
- Official YouTube channel: https://www.youtube.com/channel/UCFdjiPtdn0xaixuuodBdGsg
- Justdial listing (used only to note address-landmark variance; **not merged**)

## Deployment notes

The site is plain static HTML/CSS/JS plus one tiny Node server. It can be hosted anywhere Node runs
(VPS, Render, Railway) — or the `public/` folder alone can be hosted statically if the enquiry form
is pointed at an external webhook endpoint instead of `/api/enquiry`. SEO metadata, Open Graph tags,
JSON-LD `School` schema, semantic HTML, alt text and reduced-motion support are included.
