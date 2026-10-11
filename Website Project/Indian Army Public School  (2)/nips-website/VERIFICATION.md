# Verification Register — New Indian Public School, Etawah website

Status key: **CONFLICT** = sources disagree (not merged, flagged) · **CONFIRM** = info published on the school's own site/brief but needs management sign-off · **MISSING** = not found anywhere; placeholder on the site.

## A. Conflicting data (flagged, NOT merged)

| Item | Sources | What the site shows | Action |
|---|---|---|---|
| Address | Brief: "809, Tulsi Nagar, Yashoda Nagar, Etawah – 206001"<br>nipsetawah.com: "Tulsi Nagar, Bharthana Road, Etawah – 206001"<br>Justdial: "809, Tulsi Nagar, Etawah-206001" (listing name says "Near Army Canteen") | `809, Tulsi Nagar, Etawah – 206001, Uttar Pradesh` (only the part common to all sources) | **CONFLICT** — management to confirm locality (Yashoda Nagar vs Bharthana Road) and landmark. Update in `index.html`, `contact.html`, footer, JSON-LD, map query. |
| Phone numbers | Brief + school site: 8006000109, 9720085999<br>SchoolDekho listing: 9988851756 (listing location shown as "NA") | 8006000109, 9720085999 | **CONFLICT** for 9988851756 — not published. Confirm the two numbers are the official office lines. |
| Board | School site: "CBSE Pattern". No CBSE affiliation record for this school was found in our search. | "CBSE pattern" wording only; no affiliation claim or number | **MISSING** — affiliation status and number from management. |
| Students / staff | Justdial: 26 boys, 20 girls, 2 male + 3 female teachers, "Primary" level, 4 classrooms | Not published | **CONFLICT** — third-party data looks outdated versus P.G.–VIII offering; not used. Confirm current figures before publishing any counts. |
| Mission text | nipsetawah.com About page: text about making sport accessible "in emerging economies" and to children with disabilities | Not used. Public page shows a placeholder mission for approval, plus a vision drafted from the leadership messages | **CONFIRM** — looks like generic/borrowed text; management to provide the official mission. |
| Photos | Justdial listing photo is a 3D architectural rendering of the building, not a photograph | Not used | **MISSING** — actual campus photos needed. |
| Director photo | nipsetawah.com `director.jpg` returns 404 | Initials placeholder "VK" | **MISSING** — director photo. |
| Gallery | nipsetawah.com gallery image `poster.jpg` returns 404 | Placeholder tiles with categories | **MISSING** — 6–12 original photos. |

## B. Published on the school website / brief — needs sign-off

- Leadership names and designations: Manager Mr. Radhey Shayam Shakya (site also shows "SHYAM"), Principal Mrs. Jaybharti Kushwaha (site also shows "JAY BHARTI KUSHWAHA"), Director Mr. Vikram Kushwaha. **Confirm spellings.**
- "No admission fee" for limited seats (announced 30 Sep 2026). **Confirm terms, validity and seat count.**
- Session 2026-27 admissions open for P.G. to VIII.
- 2nd Unit Test 12–17 Oct 2026 (notice dated 01 Oct 2026).
- Facilities from the school prospectus flyer: CCTV ("100% CCTV" on home page), computer labs, smart classes, English-to-English conversation, yoga/music/dance, cold & RO water, routine medical checkup, 20:1 teaching ratio, pick & drop, 24/7 power backup, indoor/outdoor games. **Confirm CCTV coverage, 20:1 ratio, routes, power backup and medical checkup arrangements.**
- Manager's message programmes (women's safety, SPC, health testing, science exhibition). **Confirm dates/details.**
- Parent expectations (75% attendance, mobile/gadget ban, homework diary) — taken from the school site.
- Video links and channel "NEW INDIAN PUBLIC SCHOOL ETAWAH" (YouTube).

## C. Missing — placeholders on the website

- Year of establishment
- CBSE affiliation status and number
- Official mission statement
- Fee structure (tuition and other fees) — not published
- Age criteria per class — shown as "[To be confirmed by school]"
- Admission documents list and process steps — indicative steps only
- Seat availability per class
- School office hours
- Google Maps exact pin (map is driven by the address query)
- Campus, classroom and activity photographs; Director photograph
- Student and teacher counts (intentionally not published)
- Official domain: the code assumes `https://nipsetawah.com` for canonical URLs, sitemap and Open Graph. Update if the new site is hosted elsewhere.

## D. Technical / operations items to configure

- **Enquiry destination:** every enquiry is saved to `data/enquiries.jsonl` on the server. To notify the office, set `ENQUIRY_WEBHOOK_URL` (e.g. a Google Apps Script web app that emails the office, or a CRM/Zapier webhook). Without it, the success message says the office will review the enquiry, and the office does not get an automatic notification.
- Parent Login links to the existing portal `https://nipsetawah.com/Parent/Login` — this new site does not replace the portal.
- Confirm the school's social profiles (only the YouTube channel was found).
