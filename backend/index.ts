import mongoose from 'mongoose'
import { Environment } from './environment'
import { Controller } from './controllers/controller'
import { memberModel, memberValidator } from './models/member'
import { ScoreboardController } from './controllers/scoreboard-controller'
import { ManualChoreController } from './controllers/manual-chore-controller'
import { PeriodicChoreController } from './controllers/periodic-chore-controller'

import { createRouter, createErrorHandler } from './api/api'
import { handler as wsHandler } from './websocket/handler'

const membersController = new Controller(memberModel, memberValidator)
const scoreboardsController = new ScoreboardController({
  member: membersController
})
const manualChoresController = new ManualChoreController({
  scoreboard: scoreboardsController
})
const periodicChoresController = new PeriodicChoreController({
  member: membersController
})

const controllers: Record<string, Controller<unknown>> = {
  members: membersController,
  scoreboards: scoreboardsController,
  'manual-chores': manualChoresController,
  'periodic-chores': periodicChoresController
}

export async function init (env: Environment): Promise<void> {
  mongoose.set('toJSON', {
    versionKey: false
  })

  await mongoose.connect(env.MONGODB_URI ?? 'mongodb://localhost/wgsystem')
}

export const createApiRouter = createRouter.bind(undefined, controllers)
export const createApiErrorHandler = createErrorHandler

export const webSocketHandler = wsHandler.bind(undefined, controllers)
