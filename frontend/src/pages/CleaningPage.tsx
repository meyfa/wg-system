import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function CleaningPage (): ReactElement {
  const { t } = useTranslation()

  return (
    <div>{t('cleaning.title')}</div>
  )
}
