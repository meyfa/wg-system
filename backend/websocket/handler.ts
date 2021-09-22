import { WebsocketRequestHandler } from 'express-ws'
import { register } from './events'

export const handler: WebsocketRequestHandler = (ws) => {
  const unsubscribe = register(ws)

  ws.on('close', unsubscribe)
}
