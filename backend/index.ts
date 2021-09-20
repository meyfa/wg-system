import mongoose from 'mongoose'
import { Environment } from './environment'

export { createApiRouter } from './api/api'

export async function init (env: Environment): Promise<void> {
  await mongoose.connect(env.MONGODB_URI ?? 'mongodb://localhost/wgsystem')
}
