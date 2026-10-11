// Static + API test suite. Run with:  node scripts/test.mjs
// Starts the server on a free port, then checks pages, links, assets, SEO basics,
// accessibility basics, and the enquiry API (validation, persistence, honeypot, errors).
import { readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, validateEnquiry } from '../server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', 'about.html', 'academics.html', 'facilities.html', 'gallery.html', 'admissions.html', 'contact.html'];
let pass = 0, fail = 0;
const failures = [];
const ok = (cond, name) => { if (cond) { pass++; console.log('  ✓', name); } else { fail++; failures.push(name); console.log('  ✗', name); } };

// ---------- Static checks ----------
console.log('\n[static] pages');
const htmlFiles = PAGES.concat(['404.html']);
const texts = {};
for (const f of htmlFiles) {
  texts[f] = await readFile(path.join(ROOT, f), 'utf8');
  const t = texts[f];
  ok(/<!doctype html>/i.test(t) && /<html lang="en-IN"/.test(t), `${f}: doctype + lang`);
  ok(/<meta name="viewport" content="width=device-width/.test(t), `${f}: viewport meta`);
  const title = (t.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  ok(title.length >= 20 && title.length <= 80, `${f}: title length ${title.length} (20–80)`);
  const desc = (t.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok(desc.length >= 70 && desc.length <= 170, `${f}: meta description length ${desc.length} (70–170)`);
  ok((t.match(/<h1[\s>]/g) || []).length === 1, `${f}: exactly one <h1>`);
  ok(/<main[\s>]/.test(t) && /id="main"/.test(t), `${f}: <main id="main"> landmark`);
  ok(/class="skip-link" href="#main"/.test(t), `${f}: skip link`);
  const imgs = [...t.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((i) => !/\salt="/.test(i));
  ok(noAlt.length === 0, `${f}: all ${imgs.length} <img> have alt attributes`);
  const noDim = imgs.filter((i) => !/width="\d+"/.test(i) || !/height="\d+"/.test(i));
  ok(noDim.length === 0, `${f}: images declare width/height (CLS)`);
  const inputs = [...t.matchAll(/<(input|select|textarea)\b[^>]*>/g)].map((m) => m[0])
    .filter((i) => !/type="(hidden|checkbox)"/.test(i) && !/name="website"/.test(i));
  const unlabeled = inputs.filter((i) => { const id = (i.match(/id="([^"]+)"/) || [])[1]; return !id || !t.includes(`for="${id}"`); });
  ok(unlabeled.length === 0, `${f}: every form control has a <label for>`);
  ok(!/https?:\/\/(localhost|127\.0\.0\.1)/.test(t), `${f}: no localhost URLs`);
  ok(!/\bLorem\b|TODO_REMOVE|undefined|NaN/.test(t), `${f}: no placeholder junk (Lorem/undefined)`);
}

console.log('\n[static] internal links & assets');
const idsByFile = {};
for (const f of htmlFiles) idsByFile[f] = new Set([...texts[f].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const f of PAGES) {
  const hrefs = [...texts[f].matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const h of hrefs) {
    if (/^(https?:|mailto:|tel:|#$)/.test(h)) continue;
    const [file, hash] = h.split('#');
    if (!file) { // same-page anchor
      ok(idsByFile[f].has(hash), `${f}: anchor #${hash} exists`);
      continue;
    }
    if (file.startsWith('assets/') || file.endsWith('.html') || file === 'robots.txt' || file === 'sitemap.xml') {
      const exists = existsSync(path.join(ROOT, file));
      if (!exists) ok(false, `${f}: link target exists → ${h}`);
      else if (hash) ok(idsByFile[file]?.has(hash), `${f}: anchor target #${hash} in ${file}`);
    }
  }
  const srcs = [...texts[f].matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map((m) => m[1]);
  for (const s of srcs) ok(existsSync(path.join(ROOT, s)), `${f}: asset exists → ${s}`);
}

console.log('\n[static] nav consistency');
const navOf = (t) => [...t.matchAll(/<nav id="site-nav"[\s\S]*?<\/nav>/g)][0]?.[0] || '';
const navRef = navOf(texts['index.html']).replace(/ aria-current="page"/, '');
for (const f of PAGES) {
  const n = navOf(texts[f]).replace(/ aria-current="page"/g, '').replace(/href="#enquiry"|href="admissions.html#enquiry"/, 'ENQ');
  ok(n.replace(/href="#enquiry"/, 'ENQ') === navRef.replace(/href="#enquiry"/, 'ENQ'), `${f}: same navigation as home`);
  const current = [...texts[f].matchAll(/<a href="([^"]+)" aria-current="page">/g)].map((m) => m[1]);
  ok(current.length === 1 && current[0] === f, `${f}: exactly one aria-current nav item (${current.join(',')})`);
}

console.log('\n[static] SEO & structured data');
ok(texts['index.html'].includes('"@type": "School"'), 'index: School JSON-LD present');
ok(!/founder|foundingDate|numberOfStudents|aggregateRating/i.test(texts['index.html']), 'index: no unverified structured-data fields');
const sm = await readFile(path.join(ROOT, 'sitemap.xml'), 'utf8');
ok(PAGES.filter((p) => p !== 'index.html').every((p) => sm.includes(p)) && sm.includes('https://nipsetawah.com/<'.slice(0, -1)) , 'sitemap lists all pages');

console.log('\n[static] unverified claims guard');
const allPublic = PAGES.map((f) => texts[f]).join('\n');
ok(!/CBSE[- ]affiliated|affiliation no|affiliation number\s*[:\-]?\s*\d/i.test(allPublic), 'no unverified CBSE affiliation claim');
ok(!/Yashoda Nagar/.test(allPublic), 'conflicting locality (Yashoda Nagar) not merged into public address');
ok(!/9988851756/.test(allPublic), 'conflicting third-party phone number not published');
ok(!/Developed by|MS Digital Consultant/i.test(allPublic), 'no third-party vendor credit copied');

// ---------- Validation unit tests ----------
console.log('\n[unit] enquiry validation');
const good = { parentName: 'Ramesh Kumar', studentName: 'Aarav', classApplying: 'K.G.', mobile: '+91 98765-43210', consent: true };
let v = validateEnquiry(good);
ok(Object.keys(v.errors).length === 0 && v.data.mobile === '9876543210', 'valid input normalises mobile (+91, spaces removed)');
v = validateEnquiry({ ...good, mobile: '12345' });
ok(!!v.errors.mobile, 'rejects invalid mobile');
v = validateEnquiry({ ...good, classApplying: 'Class XII' });
ok(!!v.errors.classApplying, 'rejects class not offered');
v = validateEnquiry({ ...good, consent: false });
ok(!!v.errors.consent, 'requires consent');
v = validateEnquiry({ ...good, email: 'bad@', });
ok(!!v.errors.email, 'rejects bad email');
v = validateEnquiry({ ...good, message: '<script>alert(1)</script>'.repeat(100) });
ok(v.data.message.length <= 1000, 'message length capped');

// ---------- API & server tests ----------
console.log('\n[api] running server');
const dataFile = path.join(ROOT, 'data', 'enquiries.jsonl');
const backup = existsSync(dataFile) ? await readFile(dataFile, 'utf8') : null;
const server = createServer();
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const post = (body, raw = false) => fetch(`${base}/api/enquiry`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: raw ? body : JSON.stringify(body),
}).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }));

try {
  const pageRes = await fetch(`${base}/`);
  ok(pageRes.status === 200 && (await pageRes.text()).includes('New Indian Public School'), 'GET / serves index.html');
  const nf = await fetch(`${base}/nope-page`);
  ok(nf.status === 404, 'unknown path → 404');
  const trav = await fetch(`${base}/..%2Fpackage.json`);
  ok(trav.status === 404, 'path traversal blocked');
  const priv = await fetch(`${base}/data/enquiries.jsonl`);
  ok(priv.status === 404, 'data/ folder not served');
  const srv = await fetch(`${base}/server.mjs`);
  ok(srv.status === 404, 'server source not served');
  const css = await fetch(`${base}/assets/css/styles.css`);
  ok(css.status === 200 && (css.headers.get('content-type') || '').includes('text/css'), 'CSS served with correct MIME');

  const bad = await post({ parentName: '', studentName: '', classApplying: '', mobile: '', consent: false });
  ok(bad.status === 422 && bad.body.errors && Object.keys(bad.body.errors).length === 5, 'empty submission → 422 with field errors');
  const badJson = await post('{not json', true);
  ok(badJson.status === 400, 'malformed JSON → 400 (no fake success)');
  const hp = await post({ ...good, website: 'spam' });
  ok(hp.status === 400, 'honeypot filled → rejected');

  const res = await post({ ...good, source: 'admissions.html' });
  ok(res.status === 201 && res.body.ok === true && res.body.saved === true, 'valid enquiry → 201 saved');
  ok(/^NIPS-\d{8}-[A-Z0-9]{6}$/.test(res.body.id || ''), `reference id format (${res.body.id})`);
  ok(res.body.notified === false && res.body.webhookConfigured === false, 'no webhook → notified=false (honest status)');
  const saved = (await readFile(dataFile, 'utf8')).trim().split('\n').map((l) => JSON.parse(l));
  const rec = saved.find((r) => r.id === res.body.id);
  ok(!!rec && rec.mobile === '9876543210' && rec.studentName === 'Aarav' && rec.source === 'admissions.html', 'record persisted to data/enquiries.jsonl');

  // Rate limit: 5 per 15 min per IP (one already used above, plus the three failed ones count too).
  let limited = null;
  for (let i = 0; i < 10 && !limited; i++) { const r = await post(good); if (r.status === 429) limited = r; }
  ok(!!limited, 'rate limit kicks in (429) after repeated submissions');
} finally {
  server.close();
  // restore data file to its previous state so tests don't leave junk behind
  if (backup === null) await rm(dataFile, { force: true }); else await writeFile(dataFile, backup);
}

console.log(`\nResult: ${pass} passed, ${fail} failed`);
if (fail) { console.log('Failed:\n - ' + failures.join('\n - ')); process.exit(1); }
