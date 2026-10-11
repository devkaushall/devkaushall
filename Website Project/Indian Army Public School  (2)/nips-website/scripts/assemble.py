#!/usr/bin/env python3
"""Regenerates the inner pages (about, academics, facilities, gallery, admissions, contact)
from src/<page>.body.html + src/_header.html + src/_footer.html.
Run:  python3 scripts/assemble.py      (index.html is maintained directly)"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'

PAGES = {
    'about':      dict(nav='about',      title='About Us | New Indian Public School, Etawah',
                       desc='About New Indian Public School, Etawah: our values, leadership messages and approach to CBSE-pattern education from Play Group to Class VIII.'),
    'academics':  dict(nav='academics',  title='Academics | Play Group to Class VIII | NIPS Etawah',
                       desc='Academic programmes at New Indian Public School, Etawah: Pre-Primary, Primary and Upper Primary classes on the CBSE pattern with English conversation and smart classes.'),
    'facilities': dict(nav='facilities', title='Facilities | Smart Classes, Computer Labs, Transport | NIPS Etawah',
                       desc='Facilities at New Indian Public School, Etawah: CCTV-monitored campus, computer labs, smart classes, yoga and music, pick and drop transport and drinking water.'),
    'gallery':    dict(nav='gallery',    title='Photo & Video Gallery | NIPS Etawah',
                       desc='Videos and photos from New Indian Public School, Etawah: annual day, Vidhyaarambh, smart classes and school celebrations.'),
    'admissions': dict(nav='admissions', title='Admissions 2026-27 | Play Group to Class VIII | NIPS Etawah',
                       desc='Admissions open for 2026-27 at New Indian Public School, Etawah from Play Group to Class VIII. Send an enquiry online or call 8006000109.'),
    'contact':    dict(nav='contact',    title='Contact & Location | New Indian Public School, Etawah',
                       desc='Contact New Indian Public School, Etawah: 809, Tulsi Nagar, Etawah – 206001. Phone 8006000109 / 9720085999, email nipsetawah@gmail.com.'),
}

HEAD = '''<!doctype html>
<html lang="en-IN" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://nipsetawah.com/{page}.html">
  <meta name="theme-color" content="#1b2f6e">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="New Indian Public School, Etawah">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="https://nipsetawah.com/{page}.html">
  <meta property="og:image" content="https://nipsetawah.com/assets/img/logo.jpg">
  <link rel="icon" href="assets/img/logo.jpg" type="image/jpeg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
'''

def main():
    header = (SRC / '_header.html').read_text(encoding='utf-8')
    footer = (SRC / '_footer.html').read_text(encoding='utf-8')
    for page, meta in PAGES.items():
        body = (SRC / f'{page}.body.html').read_text(encoding='utf-8')
        h = header.replace(f'<a href="{page}.html">', f'<a href="{page}.html" aria-current="page">')
        # Remove aria-current from Home and any other link, then mark the active one.
        h = h.replace(' aria-current="page"', '')
        h = h.replace('href="#enquiry"', 'href="admissions.html#enquiry"')
        h = h.replace(f'<a href="{page}.html">', f'<a href="{page}.html" aria-current="page">')
        out = HEAD.format(page=page, title=meta['title'], desc=meta['desc']) + h + body + footer + \
              '\n<div class="modal" id="video-modal" role="dialog" aria-modal="true" aria-label="School video" aria-hidden="true">\n  <div class="modal-box">\n    <button class="modal-close" type="button" aria-label="Close video">×</button>\n    <div class="ratio"></div>\n  </div>\n</div>\n\n<script src="assets/js/main.js" defer></script>\n</body>\n</html>\n'
        (ROOT / f'{page}.html').write_text(out, encoding='utf-8')
        print('wrote', f'{page}.html')

if __name__ == '__main__':
    main()
