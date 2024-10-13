import WebSocket from 'ws'
import { Controller, ControllerListener } from '../controllers/controller.js'

function subscribe (ws: WebSocket, controllerName: string, controller: Controller<unknown>): void {
  const sendEvent = (type: string, item: any): void => {
    ws.send(JSON.stringify({
      event: `${type}/${controllerName}`,
      data: item
    }))
  }

  const onCreated: ControllerListener<unknown> = (item) => sendEvent('add', item)
  const onUpdated: ControllerListener<unknown> = (item) => sendEvent('update', item)
  const onDeleted: ControllerListener<unknown> = (item) => sendEvent('remove', item)

  controller.on('created', onCreated)
  controller.on('updated', onUpdated)
  controller.on('deleted', onDeleted)

  ws.on('close', () => {
    controller.off('created', onCreated)
    controller.off('updated', onUpdated)
    controller.off('deleted', onDeleted)
  })
}

export function handler (controllers: Record<string, Controller<unknown>>, ws: WebSocket, pageVersion?: string): void {
  // if available, send page version to client immediately on connect
  if (pageVersion != null) {
    ws.send(JSON.stringify({
      event: 'pageVersion',
      data: pageVersion
    }))
  }

  for (const [name, controller] of Object.entries(controllers)) {
    subscribe(ws, name, controller)
  }

  const heartbeat = setInterval(() => ws.ping(), 20000)
  ws.on('close', () => clearInterval(heartbeat))
}
