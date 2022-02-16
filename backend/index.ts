import mongoose from 'mongoose'
import { Environment } from './environment.js'
import { Controller } from './controllers/controller.js'
import { groupModel, groupValidator } from './models/group.js'
import { ScoreboardController } from './controllers/scoreboard-controller.js'
import { ManualChoreController } from './controllers/manual-chore-controller.js'
import { PeriodicChoreController } from './controllers/periodic-chore-controller.js'

import { createRouter, createErrorHandler } from './api/api.js'
import { handler as wsHandler } from './websocket/handler.js'
import { MemberController } from './controllers/member-controller.js'

export { Environment } from './environment.js'

const groupsController = new Controller(groupModel, groupValidator)
const membersController = new MemberController({
  group: groupsController
})
const scoreboardsController = new ScoreboardController({
  member: membersController
})
const manualChoresController = new ManualChoreController({
  scoreboard: scoreboardsController
})
const periodicChoresController = new PeriodicChoreController({
  member: membersController
})

const controllers: Record<string, Controller<any>> = {
  groups: groupsController,
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
