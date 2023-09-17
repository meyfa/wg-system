const EVENT_CONNECT = 'connect'
const EVENT_DISCONNECT = 'disconnect'
const EVENT_MESSAGE = 'message'
const EVENT_PAGE_VERSION = 'pageVersion'

export class ConnectEvent extends Event {
  constructor () {
    super(EVENT_CONNECT)
  }
}

export class DisconnectEvent extends Event {
  constructor () {
    super(EVENT_DISCONNECT)
  }
}

export class MessageEvent extends Event {
  constructor (
    public readonly data: Message
  ) {
    super(EVENT_MESSAGE)
  }
}

export class PageVersionEvent extends Event {
  constructor (
    public readonly version: string | undefined
  ) {
    super(EVENT_PAGE_VERSION)
  }
}

export interface Message {
  event: string
  data: any
}

interface SocketEventMap {
  [EVENT_CONNECT]: ConnectEvent
  [EVENT_DISCONNECT]: DisconnectEvent
  [EVENT_MESSAGE]: MessageEvent
  [EVENT_PAGE_VERSION]: PageVersionEvent
}

/**
 * This is the main class for operating a WebSocket client.
 * It will handle connecting and reconnecting internally and only provides a method for
 * creating subscriptions.
 */
export class Socket extends EventTarget {
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

  addEventListener<K extends keyof SocketEventMap> (
    type: K,
    callback: (event: SocketEventMap[K]) => void,
    options?: EventListenerOptions | boolean
  ): void {
    super.addEventListener(type, callback as EventListener, options)
  }

  removeEventListener<K extends keyof SocketEventMap> (
    type: K,
    callback: (event: SocketEventMap[K]) => void,
    options?: EventListenerOptions | boolean
  ): void {
    super.removeEventListener(type, callback as EventListener, options)
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
    const ws = this.ws = new WebSocket(this.url)
    ws.addEventListener('open', () => this.handleOpen(ws))
    ws.addEventListener('error', () => this.handleClose(ws))
    ws.addEventListener('close', () => this.handleClose(ws))
    ws.addEventListener('message', (event) => this.handleMessage(ws, event.data))
  }

  private handleOpen (source: WebSocket): void {
    // This check prevents event handling for WebSocket instances that are no longer in use.
    if (source !== this.ws) {
      return
    }
    this.dispatchEvent(new ConnectEvent())
  }

  private handleClose (source: WebSocket): void {
    // This check prevents event handling for WebSocket instances that are no longer in use.
    if (source !== this.ws) {
      return
    }
    this.ws = undefined
    this.dispatchEvent(new DisconnectEvent())
    if (this.reconnectDelay >= 0) {
      setTimeout(() => this.connect(), this.reconnectDelay)
    }
  }

  private handleMessage (source: WebSocket, data: string): void {
    // This check prevents event handling for WebSocket instances that are no longer in use.
    if (source !== this.ws) {
      return
    }
    const parsed = JSON.parse(data)
    if (parsed != null && parsed.event === 'pageVersion') {
      this._reportedPageVersion = typeof parsed.data === 'string' ? parsed.data : undefined
      this.dispatchEvent(new PageVersionEvent(this._reportedPageVersion))
      return
    }
    this.dispatchEvent(new MessageEvent(parsed))
  }

  /**
   * Obtain the previously reported page version. When this changes at some point,
   * an event will be emitted.
   *
   * @returns The previously reported page version, if any.
   * @see PageVersionEvent
   */
  get reportedPageVersion (): string | undefined {
    return this._reportedPageVersion
  }
}

const url = window.location.origin.replace(/^http/, 'ws') + '/websocket/'

export const socket = new Socket(url, 5000)
socket.connect()
