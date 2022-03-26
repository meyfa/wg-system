import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { WebSocketServer } from 'ws'

// this works because 'backend' is listed as a workspace in package.json
import { init, Environment } from 'backend'

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

async function start (): Promise<void> {
  const pageVersion = await getPageVersion()
  const { createApiRouter, createApiErrorHandler, webSocketHandler } = await init(process.env as Environment)

  const app = express()

  app.use(express.json())

  // the project needs to be built (`npm run build-all`) before these paths can work!
  app.use('/api', createApiRouter())
  app.use(express.static('./frontend/build'))
  // redirect all other requests to index.html for React-Router to handle
  app.get('*', (req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, './frontend/build/index.html'))
  })

  // this will catch errors in express itself, and things missed by the routes
  app.use(createApiErrorHandler())

  const server = app.listen(8080, '::')

  const wsServer = new WebSocketServer({ noServer: true })
  wsServer.on('connection', socket => webSocketHandler(socket, pageVersion))

  server.on('upgrade', (req, socket, head) => {
    if (req.url === '/websocket' || req.url === '/websocket/') {
      wsServer.handleUpgrade(req, socket, head, ws => wsServer.emit('connection', ws, req))
    }
  })
}

void start()
