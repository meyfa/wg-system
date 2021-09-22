import { WebsocketRequestHandler } from 'express-ws'

export const handler: WebsocketRequestHandler = (ws) => {
  ws.on('message', (msg) => {
    // TODO
  })
}
