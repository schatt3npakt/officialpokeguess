#!/usr/bin/env node
/**
 * Zero-dependency static dev server for www/.
 *   node tools/serve.mjs [--port 8080] [--base /sub/]
 * --base serves the app under a sub-path to verify sub-path hosting.
 */
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const port = Number(arg('port', process.env.PORT || 8080))
const base = `/${arg('base', '/').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/')
const root = resolve(fileURLToPath(new URL('../www/', import.meta.url)))

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=utf-8'
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')
  if (!pathname.startsWith(base)) {
    res.writeHead(302, { Location: base })
    return res.end()
  }

  let rel = decodeURIComponent(pathname.slice(base.length))
  if (rel === '' || rel.endsWith('/')) rel += 'index.html'
  const file = normalize(join(root, rel))
  if (file !== root && !file.startsWith(root + sep)) {
    res.writeHead(403)
    return res.end()
  }

  try {
    const info = await stat(file)
    if (!info.isFile()) throw new Error('not a file')
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-cache'
    })
    createReadStream(file).pipe(res)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
  }
}).listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}${base}`)
})
