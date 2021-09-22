import WebSocket from 'ws'
import { register } from './events'

export const webSocketHandler = (ws: WebSocket): void => {
  const unsubscribe = register(ws)

  ws.on('close', unsubscribe)
}
