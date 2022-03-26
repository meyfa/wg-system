import mongoose from 'mongoose'
import { Environment } from './environment.js'
import { Controller } from './controllers/controller.js'
import { MemberController } from './controllers/member-controller.js'
import { GroupController } from './controllers/group-controller.js'
import { ScoreboardController } from './controllers/scoreboard-controller.js'
import { ManualChoreController } from './controllers/manual-chore-controller.js'
import { PeriodicChoreController } from './controllers/periodic-chore-controller.js'

import { createRouter, createErrorHandler } from './api/api.js'
import { handler as wsHandler } from './websocket/handler.js'
import { Router } from 'express'
import WebSocket from 'ws'

export { Environment } from './environment.js'

export interface Backend {
  readonly createApiRouter: () => Router
  readonly createApiErrorHandler: typeof createErrorHandler
  readonly webSocketHandler: (ws: WebSocket, pageVersion?: string) => void
  readonly stop: () => Promise<void>
}

function createControllers (db: mongoose.Connection): Record<string, Controller<any>> {
  const groupsController = new GroupController(db)
  const membersController = new MemberController(db, {
    group: groupsController
  })
  const scoreboardsController = new ScoreboardController(db, {
    member: membersController
  })
  const manualChoresController = new ManualChoreController(db, {
    scoreboard: scoreboardsController
  })
  const periodicChoresController = new PeriodicChoreController(db, {
    member: membersController
  })

  return {
    groups: groupsController,
    members: membersController,
    scoreboards: scoreboardsController,
    'manual-chores': manualChoresController,
    'periodic-chores': periodicChoresController
  }
}

export async function init (env: Environment): Promise<Backend> {
  mongoose.set('toJSON', {
    versionKey: false
  })

  const db = await mongoose.createConnection(env.MONGODB_URI ?? 'mongodb://localhost/wgsystem').asPromise()
  const controllers = createControllers(db)

  return {
    createApiRouter: createRouter.bind(undefined, controllers),
    createApiErrorHandler: createErrorHandler,
    webSocketHandler: wsHandler.bind(undefined, controllers),
    stop: async () => await db.close()
  }
}
