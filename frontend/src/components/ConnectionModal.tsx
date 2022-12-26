import { ReactElement, useEffect, useState } from 'react'
import Modal from './modals/Modal'
import { useConnectionStatusDebounced } from '../hooks/use-connection-status'
import { useTranslation } from 'react-i18next'

/**
 * The time (in milliseconds) that it's okay to be disconnected. Only when the socket is disconnected longer than this
 * will the overlay be shown.
 */
const ALLOWED_DISCONNECT_TIME = 3000

/**
 * The time (in milliseconds) before the page reload button is shown to the user.
 * The button is not shown instantly, to prevent data lass when the situation would have been recoverable.
 */
const DELAY_BEFORE_ENABLE_RELOAD = 5000

function reloadPage (): void {
  window.location.reload()
}

export default function ConnectionModal (): ReactElement {
  const { t } = useTranslation()

  const connected = useConnectionStatusDebounced(ALLOWED_DISCONNECT_TIME)

  const [isReloadAllowed, setReloadAllowed] = useState(false)
  useEffect(() => {
    if (connected) {
      setReloadAllowed(false)
    } else {
      const timeout = setTimeout(() => setReloadAllowed(true), DELAY_BEFORE_ENABLE_RELOAD)
      return () => clearTimeout(timeout)
    }
  }, [connected])

  return (
    <Modal important active={!connected}>
      {t('lostConnection')}
      {isReloadAllowed && (
        <button onClick={reloadPage} className='block mt-4 mx-auto p-1 text-sm underline text-gray-600 cursor-pointer'>
          {t('reloadPage')}
        </button>
      )}
    </Modal>
  )
}
