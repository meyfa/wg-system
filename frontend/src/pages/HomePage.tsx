import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function HomePage (): ReactElement {
  const { t } = useTranslation()

  return (
    <div>{t('home.title')}</div>
  )
}
