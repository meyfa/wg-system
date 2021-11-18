import './UpdateModal.css'
import { ReactElement } from 'react'
import Modal from './modals/Modal'
import { usePageOutdated } from '../hooks/use-page-outdated'
import { useTranslation } from 'react-i18next'
import BasicButton from './forms/BasicButton'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import Icon from './Icon'

function reloadPage (): void {
  // eslint-disable-next-line no-restricted-globals
  location.reload()
}

export default function UpdateModal (): ReactElement {
  const { t } = useTranslation()

  const outdated = usePageOutdated()

  return (
    <Modal important active={outdated}>
      <div className='UpdateModal-content'>
        <div className='UpdateModal-text'>{t('outdated')}</div>
        <BasicButton primary onClick={reloadPage}>
          <Icon icon={faRedo} />
          {t('reloadPage')}
        </BasicButton>
      </div>
    </Modal>
  )
}
