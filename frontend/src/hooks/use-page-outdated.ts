import { useEffect, useMemo, useState } from 'react'
import { getPageVersion } from '../util/get-page-version'
import socket, { EVENT_PAGE_VERSION } from '../websocket/socket'

function useRemotePageVersion (): string | undefined {
  const [version, setVersion] = useState(socket.reportedPageVersion)

  useEffect(() => {
    const listener = (version: string | undefined): void => setVersion(version)
    socket.on(EVENT_PAGE_VERSION, listener)
    return () => {
      socket.off(EVENT_PAGE_VERSION, listener)
    }
  }, [])

  return version
}

/**
 * A custom hook to determine whether an updated script version is available on reload.
 *
 * @returns Update availability.
 */
export function usePageOutdated (): boolean {
  const thisVersion = useMemo(() => getPageVersion(), [])
  const remoteVersion = useRemotePageVersion()

  return thisVersion != null && remoteVersion != null && thisVersion !== remoteVersion
}
