/* ============================================================
   serve.mjs — the dev server for this site

   The site is static and needs no build, but it does need to be
   served over HTTP: ES modules and an import map will not load
   from file://.

   A plain "send the file" server is not quite enough either. The
   dish pages scrub a video by setting currentTime, and a browser
   will not seek in a file the server delivers in one lump — it
   needs Range requests answered, and the right content type. A
   server that gets either wrong leaves the clip frozen on its
   first frame with no error anywhere, which is a miserable thing
   to debug.

     node tools/serve.mjs          # http://localhost:8137
     node tools/serve.mjs 3000     # somewhere else
   ============================================================ */

import { createServer } from 'node:http';
import { createReadStream, promises as fsp } from 'node:fs';
import { extname, join, normalize, sep } from 'node:path';

const root = process.cwd();
const port = Number(process.argv[2]) || 8137;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);

  // never serve anything above the folder being served
  const file = join(root, normalize(url === '/' ? '/index.html' : url));
  if (!file.startsWith(root + sep) && file !== root) {
    res.writeHead(403, { 'content-type': 'text/plain' });
    return res.end('forbidden');
  }

  let stat;
  try {
    stat = await fsp.stat(file);
    if (!stat.isFile()) throw new Error('not a file');
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    return res.end('404 ' + url);
  }

  const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';

  /* A <video> seeks by asking for a byte range. Answer it, or currentTime
     silently does nothing and the clip sits on frame one for ever. */
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;

    if (start >= stat.size || start > end) {
      res.writeHead(416, { 'content-range': `bytes */${stat.size}` });
      return res.end();
    }

    res.writeHead(206, {
      'content-type': type,
      'content-range': `bytes ${start}-${end}/${stat.size}`,
      'content-length': end - start + 1,
      'accept-ranges': 'bytes',
      'cache-control': 'no-store',
    });
    return createReadStream(file, { start, end }).pipe(res);
  }

  res.writeHead(200, {
    'content-type': type,
    'content-length': stat.size,
    'accept-ranges': 'bytes',
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log(`Sunehri Rice Mills — http://localhost:${port}`);
});
