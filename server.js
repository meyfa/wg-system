'use strict'

const express = require('express')
const path = require('path')
const { Server: WebSocketServer } = require('ws')

const { init, createApiRouter, createApiErrorHandler, webSocketHandler } = require('./backend/build/index')

async function start () {
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
  wsServer.on('connection', webSocketHandler)

  server.on('upgrade', (req, socket, head) => {
    if (req.url === '/websocket' || req.url === '/websocket/') {
      wsServer.handleUpgrade(req, socket, head, ws => wsServer.emit('connection', ws, req))
    }
  })
}

start()
