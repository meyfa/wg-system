import { useEffect, useMemo, useState } from 'react'
import { getPageVersion } from '../util/get-page-version'
import { PageVersionEvent, socket } from '../websocket/socket'

function useRemotePageVersion (): string | undefined {
  const [version, setVersion] = useState(socket.reportedPageVersion)

  useEffect(() => {
    const listener = (event: PageVersionEvent): void => setVersion(event.version)
    socket.addEventListener('pageVersion', listener)
    setVersion(socket.reportedPageVersion)
    return () => {
      socket.removeEventListener('pageVersion', listener)
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
