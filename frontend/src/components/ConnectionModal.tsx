import { ReactElement } from 'react'
import Modal from './modals/Modal'
import { useConnectionStatusDebounced } from '../util/use-connection-status'
import { useTranslation } from 'react-i18next'

/**
 * The time (in milliseconds) that it's okay to be disconnected. Only when the socket is disconnected longer than this
 * will the overlay be shown.
 */
const ALLOWED_DISCONNECT_TIME = 3000

export default function ConnectionModal (): ReactElement {
  const { t } = useTranslation()

  const connected = useConnectionStatusDebounced(ALLOWED_DISCONNECT_TIME)

  return (
    <Modal important active={!connected}>
      {t('lostConnection')}
    </Modal>
  )
}
