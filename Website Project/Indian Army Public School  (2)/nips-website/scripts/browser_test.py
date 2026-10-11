#!/usr/bin/env python3
"""Browser checks (Chromium via Playwright). Usage: python3 scripts/browser_test.py [base_url]
Checks: no horizontal overflow at 375/768/1280 px, console errors, broken local images,
mobile navigation, client-side form validation, and a real end-to-end enquiry submission."""
import sys, json, re
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3000'
PAGES = ['index.html', 'about.html', 'academics.html', 'facilities.html', 'gallery.html', 'admissions.html', 'contact.html']
WIDTHS = {'mobile': 375, 'tablet': 768, 'desktop': 1280}
results = []

def check(name, cond, detail=''):
    results.append((name, bool(cond), detail))
    print(('  ✓ ' if cond else '  ✗ ') + name + (f'  [{detail}]' if detail and not cond else ''))

with sync_playwright() as p:
    browser = p.chromium.launch()
    for page_name in PAGES:
        print(f'\n[{page_name}]')
        for label, w in WIDTHS.items():
            ctx = browser.new_context(viewport={'width': w, 'height': 900}, device_scale_factor=1)
            pg = ctx.new_page()
            errors, failed_local = [], []
            pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            pg.on('pageerror', lambda e: errors.append(str(e)))
            pg.on('response', lambda r: failed_local.append(f'{r.status} {r.url}') if r.status >= 400 and BASE in r.url else None)
            pg.goto(f'{BASE}/{page_name}', wait_until='domcontentloaded', timeout=30000)
            pg.wait_for_timeout(400)
            # Force reveal animations to finish for screenshots/overflow checks.
            pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
            overflow = pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
            check(f'{label} {w}px: no horizontal overflow', overflow <= 1, f'overflow={overflow}px')
            broken = pg.evaluate("[...document.images].filter(i => i.complete && i.naturalWidth === 0 && !i.closest('[hidden]')).map(i=>i.getAttribute('src'))")
            check(f'{label} {w}px: no broken local images', not broken, str(broken))
            check(f'{label} {w}px: no JS console errors', not errors, '; '.join(errors)[:300])
            check(f'{label} {w}px: no 4xx/5xx for local assets', not failed_local, '; '.join(failed_local)[:300])
            if label == 'mobile':
                # Mobile nav opens and closes
                toggle = pg.locator('.nav-toggle')
                check('mobile: nav toggle visible', toggle.is_visible())
                toggle.click()
                pg.wait_for_timeout(450)
                check('mobile: nav opens (aria-expanded=true)', toggle.get_attribute('aria-expanded') == 'true')
                check('mobile: nav links visible when open', pg.locator('#site-nav a', has_text='Gallery').is_visible())
                pg.screenshot(path=f'/tmp/shots/{page_name[:-5]}-mobile-nav.png')
                pg.keyboard.press('Escape')
                pg.wait_for_timeout(400)
                check('mobile: Escape closes nav', toggle.get_attribute('aria-expanded') == 'false')
            if label in ('mobile', 'desktop'):
                pg.screenshot(path=f'/tmp/shots/{page_name[:-5]}-{label}.png', full_page=True)
            ctx.close()

    # ---- Form behaviour (admissions page) ----
    print('\n[enquiry form]')
    ctx = browser.new_context(viewport={'width': 1280, 'height': 900})
    pg = ctx.new_page()
    api_calls = []
    pg.on('request', lambda r: api_calls.append(r.url) if '/api/enquiry' in r.url else None)
    pg.goto(f'{BASE}/admissions.html#enquiry', wait_until='domcontentloaded')
    pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
    form = pg.locator('form[data-enquiry]')
    form.locator('button[type=submit]').click()
    pg.wait_for_timeout(300)
    check('empty submit: shows validation status', 'correct the highlighted' in form.locator('.form-status').inner_text().lower())
    check('empty submit: no API call made', len(api_calls) == 0)
    check('empty submit: parent name error shown', 'parent' in form.locator('[name=parentName]').evaluate("e=>e.closest('.field').querySelector('.err').textContent").lower())
    check('empty submit: focus moved to first invalid field', pg.evaluate("document.activeElement && document.activeElement.name") in ('parentName', 'studentName', 'classApplying', 'mobile'))
    form.locator('[name=parentName]').fill('Test Parent')
    form.locator('[name=studentName]').fill('Test Child')
    form.locator('[name=classApplying]').select_option('Nursery (N.C.)')
    form.locator('[name=mobile]').fill('12345')
    form.locator('[name=consent]').check()
    form.locator('button[type=submit]').click()
    pg.wait_for_timeout(300)
    mob_err = form.locator('[name=mobile]').evaluate("e=>e.closest('.field').querySelector('.err').textContent")
    check('invalid mobile: inline error shown', 'valid' in mob_err.lower(), mob_err)
    check('invalid mobile: no API call', len(api_calls) == 0)
    form.locator('[name=mobile]').fill('9876500011')
    pg.screenshot(path='/tmp/shots/form-filled.png', full_page=False)
    form.locator('button[type=submit]').click()
    pg.wait_for_selector('.form-status.ok', timeout=10000)
    status_text = form.locator('.form-status').inner_text()
    check('valid submit: success message with reference ID', 'Reference ID' in status_text and 'NIPS-' in status_text, status_text[:200])
    check('valid submit: API called exactly once', len(api_calls) == 1, str(len(api_calls)))
    check('valid submit: form cleared', form.locator('[name=studentName]').input_value() == '')
    pg.screenshot(path='/tmp/shots/form-success.png', full_page=False)
    ctx.close()

    # Contact page: map + links present
    ctx = browser.new_context(viewport={'width': 1280, 'height': 900})
    pg = ctx.new_page()
    pg.goto(f'{BASE}/contact.html', wait_until='domcontentloaded')
    check('contact: tel links present', pg.locator('a[href="tel:+918006000109"]').count() >= 1)
    check('contact: WhatsApp link present', pg.locator('a[href*="wa.me/918006000109"]').count() >= 1)
    check('contact: map iframe present', pg.locator('iframe.map-frame').count() == 1)
    ctx.close()

    # Video modal opens and closes (no network needed for modal itself)
    ctx = browser.new_context(viewport={'width': 1280, 'height': 900})
    pg = ctx.new_page()
    pg.goto(f'{BASE}/gallery.html', wait_until='domcontentloaded')
    pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
    pg.locator('[data-video-id="U73X8cAJSjg"]').first.click()
    pg.wait_for_timeout(300)
    check('video modal opens', 'open' in (pg.locator('#video-modal').get_attribute('class') or ''))
    check('video iframe uses youtube-nocookie', pg.locator('#video-modal iframe').count() == 1 and 'youtube-nocookie' in pg.locator('#video-modal iframe').get_attribute('src'))
    pg.keyboard.press('Escape')
    pg.wait_for_timeout(200)
    check('video modal closes on Escape and removes iframe', 'open' not in (pg.locator('#video-modal').get_attribute('class') or '') and pg.locator('#video-modal iframe').count() == 0)
    # Gallery filter
    pg.locator('.filter-btn', has_text='Sports').click()
    visible = pg.evaluate("[...document.querySelectorAll('[data-cat]')].filter(e=>!e.hidden).length")
    check('gallery filter shows matching tiles only', visible == 1, f'visible={visible}')
    ctx.close()

    # Reduced motion: reveal content should still be visible without scroll
    ctx = browser.new_context(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
    pg = ctx.new_page()
    pg.goto(f'{BASE}/index.html', wait_until='domcontentloaded')
    op = pg.evaluate("getComputedStyle(document.querySelector('.strip')).opacity")
    check('reduced motion: reveal elements visible without animation', float(op) == 1.0, op)
    ctx.close()
    browser.close()

passed = sum(1 for _, ok, _ in results if ok)
print(f'\nBrowser result: {passed} passed, {len(results) - passed} failed')
if passed != len(results):
    print('Failed:'); [print(' -', n, d) for n, ok, d in results if not ok]
    sys.exit(1)
