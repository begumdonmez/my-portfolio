import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Unity WebGL builds ship pre-compressed .br files and expect the server to
// send them with `Content-Encoding: br`. Vercel does this via vercel.json;
// this plugin does the same for the dev and preview servers.
function unityBrotli() {
  const types = { '.js.br': 'application/javascript', '.wasm.br': 'application/wasm', '.data.br': 'application/octet-stream' }
  const middleware = (req, res, next) => {
    const url = decodeURIComponent((req.url || '').split('?')[0])
    if (url.startsWith('/webgl/') && url.endsWith('.br')) {
      res.setHeader('Content-Encoding', 'br')
      const type = Object.entries(types).find(([ext]) => url.endsWith(ext))
      if (type) res.setHeader('Content-Type', type[1])
    }
    next()
  }
  return {
    name: 'unity-brotli',
    // block bodies on purpose: a returned function would be run as a post-hook
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [unityBrotli(), react()],
})
