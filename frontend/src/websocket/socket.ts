import { EventEmitter } from 'events'

export const EVENT_CONNECT = 'connect'
export const EVENT_DISCONNECT = 'disconnect'
export const EVENT_MESSAGE = 'message'
export const EVENT_PAGE_VERSION = 'pageVersion'

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
  private _reportedPageVersion: string | undefined

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
      const parsed = JSON.parse(event.data)
      if (parsed != null && parsed.event === 'pageVersion') {
        this._reportedPageVersion = typeof parsed.data === 'string' ? parsed.data : undefined
        this.emit(EVENT_PAGE_VERSION, this._reportedPageVersion)
        return
      }
      this.emit(EVENT_MESSAGE, parsed)
    })
  }

  private handleClose (): void {
    this.emit(EVENT_DISCONNECT)
    this.ws = undefined
    if (this.reconnectDelay >= 0) {
      setTimeout(() => this.connect(), this.reconnectDelay)
    }
  }

  /**
   * Obtain the previously reported page version. When this changes at some point,
   * an event will be emitted.
   *
   * @returns The previously reported page version, if any.
   * @see EVENT_PAGE_VERSION
   */
  get reportedPageVersion (): string | undefined {
    return this._reportedPageVersion
  }
}

const url = window.location.origin.replace(/^http/, 'ws') + '/websocket/'

export const socket = new Socket(url, 5000)
socket.connect()
