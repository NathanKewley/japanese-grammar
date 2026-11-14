"""A minimal Chrome DevTools Protocol client over a raw websocket, using only
the standard library, so the tests need nothing but Python 3 and Chrome."""
import base64, json, os, socket, struct, subprocess, time, urllib.request, shutil, tempfile


def find_chrome():
    """Chrome or Chromium: the CHROME environment variable, or the first on the PATH."""
    if os.environ.get('CHROME'):
        return os.environ['CHROME']
    for name in ('google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome'):
        path = shutil.which(name)
        if path:
            return path
    mac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    if os.path.exists(mac):
        return mac
    raise SystemExit('Chrome not found. Set CHROME to its path.')


def free_port():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


class Chrome:
    """A fresh headless Chrome with its own empty profile, so each test starts with no saved progress."""

    def __init__(self, width=420, height=900):
        self.prof = tempfile.mkdtemp(prefix='vibe-test-')
        PORT = free_port()
        self.proc = subprocess.Popen([
            find_chrome(), '--headless=new', '--no-sandbox', '--disable-gpu', '--autoplay-policy=no-user-gesture-required',
            f'--remote-debugging-port={PORT}', f'--user-data-dir={self.prof}',
            f'--window-size={width},{height}', 'about:blank'],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(100):
            try:
                tabs = json.load(urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json'))
                page = [t for t in tabs if t['type'] == 'page'][0]
                break
            except Exception:
                time.sleep(0.1)
        else:
            raise RuntimeError('Chrome did not start')
        self.ws_connect(page['webSocketDebuggerUrl'])
        self.id = 0
        self.events = []
        self.logs = []
        for m in ['Runtime.enable', 'Page.enable', 'Log.enable']:
            self.send(m)
        self.send('Emulation.setDeviceMetricsOverride', width=width, height=height, deviceScaleFactor=1, mobile=False)

    # --- websocket ---
    def ws_connect(self, url):
        rest = url.split('://', 1)[1]
        hostport, path = rest.split('/', 1)
        host, port = hostport.split(':')
        self.sock = socket.create_connection((host, int(port)))
        key = base64.b64encode(os.urandom(16)).decode()
        req = (f'GET /{path} HTTP/1.1\r\nHost: {hostport}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n'
               f'Sec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n')
        self.sock.sendall(req.encode())
        buf = b''
        while b'\r\n\r\n' not in buf:
            buf += self.sock.recv(4096)
        self.buf = buf.split(b'\r\n\r\n', 1)[1]

    def ws_send(self, text):
        data = text.encode()
        header = bytearray([0x81])
        n = len(data)
        if n < 126:
            header.append(0x80 | n)
        elif n < 65536:
            header.append(0x80 | 126); header += struct.pack('>H', n)
        else:
            header.append(0x80 | 127); header += struct.pack('>Q', n)
        mask = os.urandom(4)
        header += mask
        self.sock.sendall(bytes(header) + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))

    def recv_exact(self, n):
        while len(self.buf) < n:
            chunk = self.sock.recv(1 << 20)
            if not chunk:
                raise EOFError
            self.buf += chunk
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def ws_recv(self):
        msg = b''
        while True:
            b1, b2 = self.recv_exact(2)
            n = b2 & 0x7F
            if n == 126:
                n = struct.unpack('>H', self.recv_exact(2))[0]
            elif n == 127:
                n = struct.unpack('>Q', self.recv_exact(8))[0]
            msg += self.recv_exact(n)
            if b1 & 0x80:
                return msg.decode()

    # --- protocol ---
    def send(self, method, **params):
        self.id += 1
        my = self.id
        self.ws_send(json.dumps({'id': my, 'method': method, 'params': params}))
        while True:
            m = json.loads(self.ws_recv())
            if m.get('id') == my:
                if 'error' in m:
                    raise RuntimeError(m['error'])
                return m.get('result')
            self.on_event(m)

    def on_event(self, m):
        meth = m.get('method')
        p = m.get('params', {})
        if meth == 'Runtime.consoleAPICalled':
            args = ' '.join(str(a.get('value', a.get('description', ''))) for a in p['args'])
            self.logs.append(f"console.{p['type']}: {args}")
        elif meth == 'Runtime.exceptionThrown':
            d = p['exceptionDetails']
            ex = d.get('exception', {}).get('description') or d.get('text')
            self.logs.append(f"EXCEPTION: {ex} @ {d.get('url','')}:{d.get('lineNumber')}")
        elif meth == 'Log.entryAdded':
            e = p['entry']
            if e['level'] in ('error', 'warning'):
                self.logs.append(f"log.{e['level']}: {e['text']} {e.get('url','')}")
        self.events.append(m)

    def js(self, expr, await_promise=True):
        r = self.send('Runtime.evaluate', expression=expr, awaitPromise=await_promise, returnByValue=True)
        if 'exceptionDetails' in r:
            d = r['exceptionDetails']
            raise RuntimeError(d.get('exception', {}).get('description') or d.get('text'))
        return r['result'].get('value')

    def go(self, url, wait=1.5):
        self.send('Page.navigate', url=url)
        self.sleep(wait)

    def sleep(self, s):
        # Keep reading events while waiting.
        end = time.time() + s
        self.sock.settimeout(0.05)
        while time.time() < end:
            try:
                self.on_event(json.loads(self.ws_recv()))
            except (socket.timeout, BlockingIOError):
                pass
        self.sock.settimeout(None)

    def wait_for(self, expr, timeout=10):
        end = time.time() + timeout
        while time.time() < end:
            try:
                if self.js(expr):
                    return True
            except RuntimeError:
                pass
            self.sleep(0.1)
        raise TimeoutError(expr)

    def click(self, selector_or_text, wait=0.4):
        """Clicks the first element matching a CSS selector, or a button/link whose text contains the given text."""
        ok = self.js(f"""(() => {{
          const q = {json.dumps(selector_or_text)};
          let el = null;
          try {{ el = document.querySelector(q); }} catch (e) {{}}
          if (!el) el = [...document.querySelectorAll('button,a,summary,label,[data-act]')].find(e => e.textContent.trim().includes(q) && e.offsetParent !== null);
          if (!el) return false;
          el.scrollIntoView({{block:'center'}});
          el.click();
          return true;
        }})()""")
        if not ok:
            raise RuntimeError(f'nothing to click: {selector_or_text}')
        self.sleep(wait)

    def text(self, selector='body'):
        return self.js(f"document.querySelector({json.dumps(selector)})?.innerText ?? ''")

    def shot(self, path, full=True):
        params = {'format': 'png'}
        if full:
            m = self.send('Page.getLayoutMetrics')
            h = int(m['cssContentSize']['height'])
            w = int(m['cssContentSize']['width'])
            params['clip'] = {'x': 0, 'y': 0, 'width': w, 'height': min(h, 6000), 'scale': 1}
            params['captureBeyondViewport'] = True
        data = self.send('Page.captureScreenshot', **params)['data']
        with open(path, 'wb') as f:
            f.write(base64.b64decode(data))

    def dump_logs(self):
        out = self.logs[:]
        self.logs.clear()
        return out

    def close(self):
        try:
            self.proc.terminate(); self.proc.wait(5)
        except Exception:
            pass
        shutil.rmtree(self.prof, ignore_errors=True)
