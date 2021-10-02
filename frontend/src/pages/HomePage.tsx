import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import PageTitle from '../components/PageTitle'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import { useAppSelector } from '../store/store'
import { selectManualChores } from '../store/entities/manual-chores'
import ManualChoreBox from '../components/home/ManualChoreBox'
import { selectScoreboards } from '../store/entities/scoreboards'
import ScoreboardBox from '../components/home/ScoreboardBox'

export default function HomePage (): ReactElement {
  const { t } = useTranslation()

  const scoreboards = useAppSelector(selectScoreboards)
  const manualChores = useAppSelector(selectManualChores)

  return (
    <NavigationBarLayout>
      <PageTitle title={t('home.title')} />
      {scoreboards.map(scoreboard => <ScoreboardBox key={scoreboard._id} scoreboard={scoreboard} />)}
      {manualChores.map(chore => <ManualChoreBox key={chore._id} chore={chore} />)}
    </NavigationBarLayout>
  )
}
