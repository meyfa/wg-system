'use strict'

const express = require('express')
const path = require('path')
const fs = require('fs')
const { Server: WebSocketServer } = require('ws')

const { init, createApiRouter, createApiErrorHandler, webSocketHandler } = require('./backend/build/index')

/**
 * Match all occurrences of the given RegExp.
 * The result is an array of match arrays, which differs from a simple global match where the array is only
 * a single level deep and capture groups are excluded.
 *
 * @param str The string to search.
 * @param regex The regular expression to execute.
 * @returns {string[][]} An array of match results, where each entry is an array of groups for a single match.
 */
function matchAll (str, regex) {
  const matches = []
  let match
  do {
    match = regex.exec(str)
    if (match != null) {
      matches.push(match)
    }
  } while (match != null)
  return matches
}

let pageVersionPromise

/**
 * Determine the page version, that is, the sorted, comma-separated list of all JS and CSS chunk identifiers present in
 * the main HTML file.
 *
 * @returns {Promise<string|undefined>} The version, or undefined if unable to determine.
 */
async function getPageVersion () {
  if (pageVersionPromise == null) {
    pageVersionPromise = Promise.resolve().then(async () => {
      const html = await fs.promises.readFile(path.join(__dirname, './frontend/build/index.html'), 'utf8')
      const hashes = matchAll(html, /[a-zA-Z0-9]+?\.([0-9a-f]+?)\.chunk\.(?:js|css)/g).map(m => m[1])
      return hashes.length > 0 ? hashes.sort().join() : undefined
    })
  }
  return await pageVersionPromise
}

async function start () {
  const pageVersion = await getPageVersion()
  init(process.env)

  const app = express()

  app.use(express.json())

  // the project needs to be built (`npm run build-all`) before these paths can work!
  app.use('/api', createApiRouter())
  app.use(express.static('./frontend/build'))
  // redirect all other requests to index.html for React-Router to handle
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'))
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

start()
