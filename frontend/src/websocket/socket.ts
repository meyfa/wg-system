import { EventEmitter } from 'events'

export const EVENT_CONNECT = 'connect'
export const EVENT_DISCONNECT = 'disconnect'
export const EVENT_MESSAGE = 'message'

export interface Message {
  event: string
  data: any
}

/**
 * This is the main class for operating a WebSocket client.
 * It will handle connecting and reconnecting internally and only provides a method for
 * creating subscriptions.
 */
export class Socket extends EventEmitter {
  private readonly url: string
  private readonly reconnectDelay: number

  private ws: WebSocket | undefined

  /**
   * Create a socket connector for the given URL.
   *
   * @param url The WebSocket server URL.
   * @param reconnectDelay The time in milliseconds between reconnect attempts.
   */
  constructor (url: string, reconnectDelay: number) {
    super()
    this.url = url
    this.reconnectDelay = reconnectDelay
  }

  /**
   * Whether the socket is currently connected.
   * Note that changes to this state are available via events "connect" and "disconnect".
   */
  get connected (): boolean {
    return this.ws != null && this.ws.readyState === WebSocket.OPEN
  }

  /**
   * Attempt connection to the WebSocket server. This does nothing if the connection already exists.
   * As soon as the connection exists, the "connect" event will fire and the "connected" flag will be set to true.
   */
  connect (): void {
    if (this.ws != null) {
      return
    }
    this.ws = new WebSocket(this.url)
    this.ws.addEventListener('open', () => {
      this.emit(EVENT_CONNECT)
    })
    this.ws.addEventListener('error', () => this.handleClose())
    this.ws.addEventListener('close', () => this.handleClose())
    this.ws.addEventListener('message', (event: MessageEvent<string>) => {
      this.emit(EVENT_MESSAGE, JSON.parse(event.data))
    })
  }

  private handleClose (): void {
    this.emit(EVENT_DISCONNECT)
    this.ws = undefined
    if (this.reconnectDelay >= 0) {
      setTimeout(() => this.connect(), this.reconnectDelay)
    }
  }
}

const url = window.location.origin.replace(/^http/, 'ws') + '/websocket/'

const socket = new Socket(url, 5000)
socket.connect()

export default socket
