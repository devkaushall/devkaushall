#!/usr/bin/env python3
"""Apple's Pizza site server — stdlib only. Clean URLs + custom 404."""
import http.server, os, posixpath

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def translate_path(self, path):
        path = path.split("?", 1)[0].split("#", 1)[0]
        path = posixpath.normpath(path)
        fs = super().translate_path(path)
        if os.path.isdir(fs):
            idx = os.path.join(fs, "index.html")
            if os.path.exists(idx):
                return idx
        if not os.path.exists(fs) and not os.path.splitext(fs)[1]:
            html = fs + ".html"
            if os.path.exists(html):
                return html
        return fs

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            p = os.path.join(ROOT, "404.html")
            if os.path.exists(p):
                body = open(p, "rb").read()
                self.send_response(404, "Not Found")
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
        super().send_error(code, message, explain)

    def log_message(self, fmt, *args):
        print("%s - %s" % (self.address_string(), fmt % args), flush=True)

if __name__ == "__main__":
    srv = http.server.ThreadingHTTPServer(("0.0.0.0", 8000), Handler)
    print("Serving Apple's Pizza site on 0.0.0.0:8000", flush=True)
    srv.serve_forever()
