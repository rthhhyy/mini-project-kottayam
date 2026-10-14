#!/usr/bin/env python
# serve_py2.py — Python 2 static server that sets no-cache headers for development
# Usage:
#   python serve_py2.py [PORT] [BIND]
# Examples:
#   python serve_py2.py         # serve on http://127.0.0.1:8000
#   python serve_py2.py 8000 0.0.0.0

import SimpleHTTPServer
import SocketServer
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
BIND = sys.argv[2] if len(sys.argv) > 2 else "127.0.0.1"

class NoCacheHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent browser caching during development
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

if __name__ == "__main__":
    httpd = SocketServer.TCPServer((BIND, PORT), NoCacheHandler)
    print("Serving HTTP on %s port %d (http://%s:%d/) ..." % (BIND, PORT, BIND, PORT))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        httpd.server_close()
