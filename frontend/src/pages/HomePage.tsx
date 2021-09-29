import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import PageTitle from '../components/PageTitle'
import NavigationBarLayout from '../layouts/NavigationBarLayout'

export default function HomePage (): ReactElement {
  const { t } = useTranslation()

  return (
    <NavigationBarLayout>
      <PageTitle title={t('home.title')} />
    </NavigationBarLayout>
  )
}
