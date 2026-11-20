#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const usage = 'Usage: edge-study-notes [--port 8787]';
if (args.length === 1 && args[0] === '--help') {
  console.log(usage);
  process.exit(0);
}

const port = args.length === 0 ? 8787 : Number(args[1]);
if (args.length !== 0 && (
  args.length !== 2 || args[0] !== '--port' || !/^\d+$/.test(args[1]) ||
  port < 1 || port > 65535
)) {
  console.error(usage);
  process.exit(1);
}

const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
].map(([route, [filename, contentType]]) => [
  route, { contentType, body: readFileSync(new URL('../public/' + filename, import.meta.url)) },
]));

const headers = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8')
  .split(/\r?\n/)
  .filter(line => /^\s+[\w-]+:/.test(line))
  .map(line => {
    const separator = line.indexOf(':');
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
  });
const securityHeaders = Object.fromEntries(headers);
const host = '127.0.0.1';
const authority = `${host}:${port}`;

const server = createServer((request, response) => {
  if (request.headers.host !== authority && request.headers.host !== `localhost:${port}`) {
    response.writeHead(400, securityHeaders).end();
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { ...securityHeaders, Allow: 'GET, HEAD' }).end();
    return;
  }

  const asset = assets.get(request.url.split('?')[0]);
  if (!asset) {
    response.writeHead(404, securityHeaders).end();
    return;
  }

  response.writeHead(200, { ...securityHeaders, 'Content-Type': asset.contentType,
    'Content-Length': asset.body.length });
  response.end(request.method === 'HEAD' ? undefined : asset.body);
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is already in use. Choose a different port with --port.`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, host, () => console.log(`http://${authority}/`));
