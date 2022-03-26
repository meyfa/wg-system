import { onTermination, promisifiedClose, promisifiedListen } from 'omniwheel'
import express, { Application } from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { WebSocketServer } from 'ws'
import { Server } from 'http'

// this works because 'backend' is listed as a workspace in package.json
import { init, Environment, Backend } from 'backend'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// after compilation, this file ends up in './build', so the root is one level up
const PROJECT_ROOT = path.join(__dirname, '..')

/**
 * Determine the page version, that is, the sorted, comma-separated list of all JS and CSS chunk identifiers present in
 * the main HTML file.
 *
 * @returns The version, or undefined if unable to determine.
 */
async function getPageVersion (): Promise<string | undefined> {
  const html = await fs.promises.readFile(path.join(PROJECT_ROOT, './frontend/build/index.html'), 'utf8')
  const hashes = Array.from(html.matchAll(/[a-zA-Z0-9]+?\.([0-9a-f]+?)\.chunk\.(?:js|css)/g), m => m[1])
  return hashes.length > 0 ? hashes.sort().join() : undefined
}

async function createBackend (): Promise<Backend> {
  const backend = await init(process.env as Environment)
  onTermination(async () => await backend.stop())

  return backend
}

async function createApp (backend: Backend): Promise<Application> {
  const app = express()

  app.use(express.json())

  // the project needs to be built (`npm run build-all`) before these paths can work!
  app.use('/api', backend.createApiRouter())
  app.use(express.static('./frontend/build'))
  // redirect all other requests to index.html for React-Router to handle
  app.get('*', (req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, './frontend/build/index.html'))
  })

  // this will catch errors in express itself, and things missed by the routes
  app.use(backend.createApiErrorHandler())

  return app
}

async function startServer (app: Application): Promise<Server> {
  const server = await promisifiedListen(app, 8080, '::')
  onTermination(async () => await promisifiedClose(server))

  return server
}

async function setupWebSockets (server: Server, backend: Backend): Promise<void> {
  const pageVersion = await getPageVersion()

  const wsServer = new WebSocketServer({ noServer: true })

  wsServer.on('connection', socket => backend.webSocketHandler(socket, pageVersion))

  server.on('upgrade', (req, socket, head) => {
    if (req.url === '/websocket' || req.url === '/websocket/') {
      wsServer.handleUpgrade(req, socket, head, ws => wsServer.emit('connection', ws, req))
    }
  })

  onTermination(() => {
    for (const client of wsServer.clients) {
      // 1001 = "going away" (https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1)
      client.close(1001)
    }
    wsServer.close()
  })
}

const backend = await createBackend()
const app = await createApp(backend)
const server = await startServer(app)
await setupWebSockets(server, backend)
