import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import PageTitle from '../components/PageTitle'
import NavigationBarLayout from '../layouts/NavigationBarLayout'

export default function GarbageDisposalPage (): ReactElement {
  const { t } = useTranslation()

  return (
    <NavigationBarLayout centered>
      <PageTitle title={t('garbage.title')} />
    </NavigationBarLayout>
  )
}
