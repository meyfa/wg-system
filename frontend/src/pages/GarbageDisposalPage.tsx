import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function GarbageDisposalPage (): ReactElement {
  const { t } = useTranslation()

  return (
    <div>{t('garbage.title')}</div>
  )
}
