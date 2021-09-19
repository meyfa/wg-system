'use strict'

const express = require('express')

const { createApiRouter } = require('./backend/build/index')

async function start () {
  const app = express()

  // the project needs to be built (`npm run build`) before these paths can work!
  app.use('/api', createApiRouter())
  app.use(express.static('./frontend/build'))

  app.listen(8080, '::')
}

start()
