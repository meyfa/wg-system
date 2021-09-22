import WebSocket from 'ws'

export type UnsubscribeFunction = () => void

const clients = new Set<WebSocket>()

export function register (ws: WebSocket): UnsubscribeFunction {
  clients.add(ws)
  return () => clients.delete(ws)
}

export function broadcast (event: string, payload: any): void {
  for (const ws of clients) {
    ws.send(JSON.stringify({
      event,
      data: payload
    }))
  }
}
