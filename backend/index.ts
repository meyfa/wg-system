import mongoose from 'mongoose'
import { Environment } from './environment'

export { createApiRouter, createApiErrorHandler } from './api/api'
export { webSocketHandler } from './websocket/handler'

export async function init (env: Environment): Promise<void> {
  mongoose.set('toJSON', {
    versionKey: false
  })

  await mongoose.connect(env.MONGODB_URI ?? 'mongodb://localhost/wgsystem')
}
