'use strict'

const express = require('express')

const { init, createApiRouter } = require('./backend/build/index')
const { handler: webSocketHandler } = require('./backend/build/websocket/handler')

async function start () {
  init(process.env)

  const app = express()
  require('express-ws')(app)

  app.use(express.json())

  // the project needs to be built (`npm run build`) before these paths can work!
  app.use('/api', createApiRouter())
  app.ws('/websocket', webSocketHandler)
  app.use(express.static('./frontend/build'))

  app.listen(8080, '::')
}

start()
