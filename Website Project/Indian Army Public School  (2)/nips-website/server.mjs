// NIPS Etawah website server — zero dependencies (Node 18+).
// Serves the static site and handles POST /api/enquiry.
//
// Env vars (all optional):
//   PORT                 default 3000
//   HOST                 default 0.0.0.0
//   ENQUIRY_WEBHOOK_URL  if set, each enquiry is also POSTed as JSON here
//                        (e.g. a Google Apps Script web app that emails the office,
//                        Zapier/Make, or any CRM webhook).
//
// Every enquiry is ALWAYS appended to data/enquiries.jsonl first. The API reports
// `saved` and `notified` separately so the UI never claims more than what happened.

import http from 'node:http';
import { readFile, stat, appendFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'enquiries.jsonl');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const WEBHOOK = process.env.ENQUIRY_WEBHOOK_URL || '';
const MAX_BODY = 16 * 1024;

const CLASSES = ['Play Group (P.G.)', 'Nursery (N.C.)', 'K.G.', 'Class I', 'Class II', 'Class III',
  'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII'];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
};

// Simple in-memory rate limit: 5 enquiries per IP per 15 minutes.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('Body too large'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const clean = (v, max) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ').slice(0, max) : '');

export function validateEnquiry(input) {
  const errors = {};
  const d = {
    parentName: clean(input.parentName, 80),
    studentName: clean(input.studentName, 80),
    classApplying: clean(input.classApplying, 40),
    mobile: clean(input.mobile, 20).replace(/[\s\-]/g, '').replace(/^\+?91/, ''),
    email: clean(input.email, 120),
    address: clean(input.address, 200),
    message: clean(input.message, 1000),
  };
  if (d.parentName.length < 3) errors.parentName = 'Please enter the parent/guardian name.';
  if (d.studentName.length < 2) errors.studentName = 'Please enter the student name.';
  if (!CLASSES.includes(d.classApplying)) errors.classApplying = 'Please select a class.';
  if (!/^[6-9]\d{9}$/.test(d.mobile)) errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) errors.email = 'Enter a valid email address.';
  if (input.consent !== true) errors.consent = 'Please allow the school to contact you.';
  return { errors, data: d };
}

async function saveEnquiry(record) {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(DATA_FILE, JSON.stringify(record) + '\n', 'utf8');
}

async function notifyWebhook(record) {
  if (!WEBHOOK) return false;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(WEBHOOK, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record), signal: ctrl.signal,
    });
    clearTimeout(t);
    return r.ok;
  } catch (err) {
    console.error('Webhook failed:', err.message);
    return false;
  }
}

async function handleEnquiry(req, res) {
  const ip = req.socket.remoteAddress || 'unknown';
  if (rateLimited(ip)) return sendJson(res, 429, { ok: false, error: 'Too many requests. Please try again after some time or call the school office.' });

  let input;
  try {
    const raw = await readBody(req);
    input = JSON.parse(raw || '{}');
  } catch (err) {
    return sendJson(res, err.status || 400, { ok: false, error: 'Invalid request.' });
  }
  // Honeypot: real users never fill the hidden "website" field.
  if (input.website) return sendJson(res, 400, { ok: false, error: 'Invalid submission.' });

  const { errors, data } = validateEnquiry(input);
  if (Object.keys(errors).length) return sendJson(res, 422, { ok: false, errors });

  const record = {
    id: 'NIPS-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + randomUUID().slice(0, 6).toUpperCase(),
    receivedAt: new Date().toISOString(),
    source: clean(input.source, 60) || 'website',
    ...data,
  };

  try {
    await saveEnquiry(record);
  } catch (err) {
    console.error('Save failed:', err.message);
    return sendJson(res, 503, { ok: false, error: 'We could not save your enquiry right now. Please call 8006000109 or 9720085999.' });
  }
  const notified = await notifyWebhook(record);
  return sendJson(res, 201, { ok: true, id: record.id, saved: true, notified, webhookConfigured: Boolean(WEBHOOK) });
}

async function serveStatic(req, res, urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(ROOT, p));
  // Block traversal and private folders/files.
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('..') || path.isAbsolute(rel) || /^(data|scripts|node_modules)(\/|$)/.test(rel) || rel === 'server.mjs' || rel.endsWith('.md')) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Not found');
  }
  let target = file;
  if (!existsSync(target) && existsSync(file + '.html')) target = file + '.html';
  try {
    const st = await stat(target);
    if (st.isDirectory()) target = path.join(target, 'index.html');
    const ext = path.extname(target).toLowerCase();
    const body = await readFile(target);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    const body = await readFile(path.join(ROOT, '404.html')).catch(() => Buffer.from('Page not found'));
    res.end(body);
  }
}

export function createServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    const url = new URL(req.url, 'http://localhost');
    try {
      if (url.pathname === '/api/enquiry' && req.method === 'POST') return await handleEnquiry(req, res);
      if (url.pathname === '/api/enquiry') return sendJson(res, 405, { ok: false, error: 'Method not allowed' });
      if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
      return await serveStatic(req, res, url.pathname);
    } catch (err) {
      console.error(err);
      if (!res.headersSent) sendJson(res, 500, { ok: false, error: 'Server error.' });
    }
  });
}

// Start only when run directly (not when imported by tests).
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  createServer().listen(PORT, HOST, () => {
    console.log(`NIPS Etawah website running at http://${HOST}:${PORT}`);
    console.log(`Enquiries saved to ${DATA_FILE}`);
    console.log(WEBHOOK ? 'Webhook: configured' : 'Webhook: NOT configured (enquiries are saved locally only)');
  });
}
