import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import ScoreboardsSection from '../components/chores/ScoreboardsSection'
import ManualChoresSection from '../components/chores/ManualChoresSection'
import PeriodicChoresSection from '../components/chores/PeriodicChoresSection'

export default function ChoresPage (): ReactElement {
  const { t } = useTranslation()

  return (
    <NavigationBarLayout centered>
      <Title title={t('chores.title')} />
      <ScoreboardsSection />
      <ManualChoresSection />
      <PeriodicChoresSection />
    </NavigationBarLayout>
  )
}
