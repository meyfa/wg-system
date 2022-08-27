import { socket } from '../websocket/socket'
import { useEffect, useState } from 'react'

/**
 * A custom hook that provides the WebSocket connection status.
 *
 * @returns Whether the socket is currently connected.
 */
export function useConnectionStatus (): boolean {
  const [connected, setConnected] = useState(socket.connected)

  useEffect(() => {
    const connectListener = (): void => setConnected(true)
    const disconnectListener = (): void => setConnected(false)
    socket.on('connect', connectListener)
    socket.on('disconnect', disconnectListener)
    setConnected(socket.connected)
    return () => {
      socket.off('connect', connectListener)
      socket.off('disconnect', disconnectListener)
    }
  }, [])

  return connected
}

/**
 * A custom hook that provides the WebSocket connection status, but with a specified "grace period" for disconnected
 * state. The hook will continue to indicate the connected state for the given delay, and only if that delay is over
 * will it switch to disconnected (unless the connection was restored).
 *
 * @param delay The amount of time the socket can be disconnected while still showing as connected.
 * @returns Whether the socket is currently connected or was connected recently enough.
 */
export function useConnectionStatusDebounced (delay: number): boolean {
  const [wasConnected, setWasConnected] = useState(true)

  const connected = useConnectionStatus()

  useEffect(() => {
    // propagate restored connection immediately
    if (connected) {
      setWasConnected(true)
      return
    }
    // apply a delay to disconnect propagation
    const timeout = setTimeout(() => setWasConnected(false), delay)
    return () => clearTimeout(timeout)
  }, [connected, delay])

  return wasConnected
}
