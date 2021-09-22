'use strict'

const express = require('express')

const { init, createApiRouter } = require('./backend/build/index')

async function start () {
  init(process.env)

  const app = express()
  app.use(express.json())

  // the project needs to be built (`npm run build`) before these paths can work!
  app.use('/api', createApiRouter())
  app.use(express.static('./frontend/build'))

  app.listen(8080, '::')
}

start()
