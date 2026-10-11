/* ============================================================
   New Indian Public School, Etawah — website server
   Zero-dependency Node.js (>=18): serves ./public statically and
   exposes POST /api/enquiry.

   Where enquiry data goes:
   1. Always appended to data/enquiries.jsonl on this server.
   2. If ENQUIRY_WEBHOOK_URL is set (e.g. a Zapier/Make hook that
      emails the office or writes to a sheet), the enquiry is also
      forwarded there. No fake success is ever shown client-side:
      the front-end only reports success when this API says ok.
   ============================================================ */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const ENQUIRY_FILE = path.join(DATA_DIR, "enquiries.jsonl");
const WEBHOOK_URL = process.env.ENQUIRY_WEBHOOK_URL || "";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function sendJSON(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); return res.end("Forbidden");
  }

  fs.stat(filePath, (err, st) => {
    let finalPath = filePath;
    if (!err && st.isDirectory()) finalPath = path.join(filePath, "index.html");
    else if (err && !path.extname(filePath)) finalPath = filePath + ".html";

    fs.readFile(finalPath, (err2, data) => {
      if (err2) {
        // graceful 404 page
        fs.readFile(path.join(PUBLIC_DIR, "404.html"), (e3, page) => {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(e3 ? "<h1>404 — Page not found</h1>" : page);
        });
        return;
      }
      const ext = path.extname(finalPath).toLowerCase();
      const headers = { "Content-Type": MIME[ext] || "application/octet-stream" };
      if (ext !== ".html") headers["Cache-Control"] = "public, max-age=86400";
      else headers["Cache-Control"] = "no-cache";
      res.writeHead(200, headers);
      res.end(data);
    });
  });
}

function handleEnquiry(req, res) {
  let raw = "";
  let overflow = false;
  req.on("data", (c) => {
    raw += c;
    if (raw.length > 20000) { overflow = true; req.destroy(); }
  });
  req.on("end", () => {
    if (overflow) return;
    let data;
    try { data = JSON.parse(raw); } catch (e) {
      return sendJSON(res, 400, { ok: false, error: "Invalid JSON" });
    }

    const name = String(data.studentName || "").trim().slice(0, 120);
    const parent = String(data.parentName || "").trim().slice(0, 120);
    const phone = String(data.phone || "").replace(/\D/g, "").slice(0, 12);
    const email = String(data.email || "").trim().slice(0, 160);
    const klass = String(data.classSeeking || "").trim().slice(0, 40);
    const message = String(data.message || "").trim().slice(0, 1200);

    if (!name || !parent || !/^[6-9]\d{9}$/.test(phone) || !klass) {
      return sendJSON(res, 422, { ok: false, error: "Missing or invalid required fields" });
    }

    const id = "NIPS-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const record = {
      id, receivedAt: new Date().toISOString(),
      studentName: name, parentName: parent, phone, email,
      classSeeking: klass, message, page: String(data.page || "").slice(0, 120)
    };

    fs.appendFile(ENQUIRY_FILE, JSON.stringify(record) + "\n", (err) => {
      if (err) return sendJSON(res, 500, { ok: false, error: "Storage error" });

      // Optional forwarding (email service / sheet via webhook)
      const forward = WEBHOOK_URL
        ? fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(record)
          }).catch(() => {})
        : Promise.resolve();

      Promise.resolve(forward).finally(() => {
        sendJSON(res, 200, { ok: true, id, forwarded: !!WEBHOOK_URL });
      });
    });
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && (req.url === "/api/health" || req.url.startsWith("/api/health?"))) {
    return sendJSON(res, 200, { ok: true, service: "nips-etawah-website", webhookConfigured: !!WEBHOOK_URL });
  }
  if (req.method === "POST" && req.url.split("?")[0] === "/api/enquiry") {
    return handleEnquiry(req, res);
  }
  if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res);
  res.writeHead(405); res.end("Method Not Allowed");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("NIPS Etawah website running on http://0.0.0.0:" + PORT);
});
