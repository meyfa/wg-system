import { onTermination } from 'omniwheel'
import { fastify, FastifyInstance } from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyWebSocket from '@fastify/websocket'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

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

async function createApp (backend: Backend): Promise<FastifyInstance> {
  const app = fastify()

  app.setErrorHandler(backend.createApiErrorHandler())
  await app.register(backend.createApiRouter(), { prefix: '/api' })

  // the project needs to be built (`npm run build-all`) before this path can work!
  await app.register(fastifyStatic, {
    root: path.join(PROJECT_ROOT, './frontend/build')
  })

  // rewrite all other requests to index.html for React-Router to handle
  app.setNotFoundHandler(async (req, reply) => await reply.sendFile('index.html'))

  return await app
}

async function setupWebSockets (server: FastifyInstance, backend: Backend): Promise<void> {
  const pageVersion = await getPageVersion()

  await app.register(fastifyWebSocket, {
    options: {
      // explicitly forbid all routes except '/websocket' and '/websocket/'
      verifyClient: (info, next) => next(info.req.url === '/websocket' || info.req.url === '/websocket/')
    }
  })

  app.get('/websocket', { websocket: true }, ({ socket }) => backend.webSocketHandler(socket, pageVersion))
  app.get('/websocket/', { websocket: true }, ({ socket }) => backend.webSocketHandler(socket, pageVersion))

  onTermination(() => {
    for (const client of app.websocketServer.clients) {
      // 1001 = "going away" (https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1)
      client.close(1001)
    }
    app.websocketServer.close()
  })
}

async function startServer (app: FastifyInstance): Promise<void> {
  await app.listen({
    port: 8080,
    host: '::'
  })
  onTermination(async () => await app.close())
}

const backend = await createBackend()
const app = await createApp(backend)
await setupWebSockets(app, backend)
await startServer(app)
