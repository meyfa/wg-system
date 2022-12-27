import { ReactElement } from 'react'
import { usePageOutdated } from '../hooks/use-page-outdated'
import { useTranslation } from 'react-i18next'
import BasicButton from './forms/BasicButton'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import Icon from './Icon'
import DialogModal from './modals/DialogModal'

function reloadPage (): void {
  window.location.reload()
}

export default function UpdateModal (): ReactElement {
  const { t } = useTranslation()

  const outdated = usePageOutdated()

  return (
    <DialogModal important active={outdated} text={t('outdated')}>
      <BasicButton primary onClick={reloadPage}>
        <Icon icon={faRedo} className='mr-4' />
        {t('reloadPage')}
      </BasicButton>
    </DialogModal>
  )
}
