import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import PageTitle from '../components/PageTitle'

export default function GarbageDisposalPage (): ReactElement {
  const { t } = useTranslation()

  return (
    <PageTitle title={t('garbage.title')} />
  )
}
