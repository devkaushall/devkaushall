#!/usr/bin/env python3
"""Local server for New Indian Public School, Etawah website.

Serves the static site and stores admission enquiries in data/enquiries.json.
Bind: 0.0.0.0:8000
"""
from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs

ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data" / "enquiries.json"
HOST = "0.0.0.0"
PORT = 8000

REQUIRED = ("parentName", "studentName", "klass", "phone")


def load_enquiries() -> list:
    if not DATA_FILE.exists():
        return []
    try:
        data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def save_enquiry(record: dict) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    items = load_enquiries()
    items.append(record)
    DATA_FILE.write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")
    log = ROOT / "data" / "enquiries.log"
    with log.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, ensure_ascii=False) + "\n")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        if self.path.rstrip("/") == "/api/enquiry":
            self._json(405, {"ok": False, "error": "Listing enquiries is disabled on the public site."})
            return
        return super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0].rstrip("/") != "/api/enquiry":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length") or 0)
        if length > 50_000:
            self._json(413, {"ok": False, "error": "Payload too large"})
            return
        raw = self.rfile.read(length)
        ctype = (self.headers.get("Content-Type") or "").lower()
        try:
            if "application/json" in ctype:
                payload = json.loads(raw.decode("utf-8") or "{}")
            else:
                parsed = parse_qs(raw.decode("utf-8"), keep_blank_values=True)
                payload = {k: (v[0] if v else "") for k, v in parsed.items()}
        except Exception:
            self._json(400, {"ok": False, "error": "Could not read the form data."})
            return

        if not isinstance(payload, dict):
            self._json(400, {"ok": False, "error": "Invalid payload."})
            return

        # Honeypot — pretend nothing happened
        if str(payload.get("website") or payload.get("company") or "").strip():
            self._json(200, {"ok": True, "id": "ignored"})
            return

        missing = [k for k in REQUIRED if not str(payload.get(k) or "").strip()]
        if missing:
            self._json(422, {"ok": False, "error": "Missing: " + ", ".join(missing)})
            return

        record = {
            "id": str(uuid.uuid4())[:8],
            "receivedAt": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
            "parentName": str(payload.get("parentName", "")).strip()[:120],
            "studentName": str(payload.get("studentName", "")).strip()[:120],
            "klass": str(payload.get("klass", "")).strip()[:40],
            "phone": str(payload.get("phone", "")).strip()[:20],
            "email": str(payload.get("email", "")).strip()[:120],
            "address": str(payload.get("address", "")).strip()[:300],
            "message": str(payload.get("message", "")).strip()[:2000],
            "source": "nips-etawah-website",
            "destinationNote": "Stored in data/enquiries.json. Email/WhatsApp copies are sent by the parent from the confirmation screen.",
        }
        save_enquiry(record)
        self._json(
            200,
            {
                "ok": True,
                "id": record["id"],
                "storedAt": str(DATA_FILE),
                "message": "Enquiry saved. Please also WhatsApp or email the school.",
            },
        )

    def _json(self, code: int, obj: dict) -> None:
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt: str, *args) -> None:
        super().log_message(fmt, *args)


def main() -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text("[]\n", encoding="utf-8")
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"NIPS Etawah site → http://{HOST}:{PORT}", flush=True)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
