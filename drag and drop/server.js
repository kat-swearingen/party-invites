const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const PARTY_FILE = path.join(DATA_DIR, 'party.json');
const RSVPS_FILE = path.join(DATA_DIR, 'rsvps.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const cleanUrl = req.url.split('?')[0];

  if (cleanUrl === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', server: 'PartyPortal Node Engine' }));
  }

  if (cleanUrl === '/api/party') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        fs.writeFileSync(PARTY_FILE, body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(body);
      });
      return;
    } else {
      if (fs.existsSync(PARTY_FILE)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(fs.readFileSync(PARTY_FILE));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No party data' }));
      }
    }
  }

  if (cleanUrl === '/api/rsvps') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        fs.writeFileSync(RSVPS_FILE, body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(body);
      });
      return;
    } else {
      if (fs.existsSync(RSVPS_FILE)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(fs.readFileSync(RSVPS_FILE));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end('[]');
      }
    }
  }

  let filePath = path.join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl);
  if (!filePath.startsWith(__dirname)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Party Portal server live on port ${PORT}`);
});
