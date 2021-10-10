import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import NavigationBarLayout from '../layouts/NavigationBarLayout'

export default function CleaningPage (): ReactElement {
  const { t } = useTranslation()

  return (
    <NavigationBarLayout centered>
      <Title title={t('cleaning.title')} />
    </NavigationBarLayout>
  )
}
