import { ReactElement } from 'react'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import { useAppSelector } from '../store/store'
import { selectManualChores } from '../store/entities/manual-chores'
import ManualChoreBox from '../components/home/ManualChoreBox'
import { selectScoreboards } from '../store/entities/scoreboards'
import ScoreboardBox from '../components/home/ScoreboardBox'
import { selectPeriodicChores } from '../store/entities/periodic-chores'
import PeriodicChoreBox from '../components/home/PeriodicChoreBox'
import Empty from '../components/Empty'
import { useTranslation } from 'react-i18next'
import ChoreGrid from '../components/home/ChoreGrid'

export default function HomePage (): ReactElement {
  const { t } = useTranslation()

  const periodicChores = useAppSelector(selectPeriodicChores)
  const scoreboards = useAppSelector(selectScoreboards)
  const manualChores = useAppSelector(selectManualChores)

  const empty = periodicChores.length + scoreboards.length + manualChores.length === 0

  return (
    <NavigationBarLayout centered={empty}>
      {empty ? <Empty message={t('home.empty')} /> : undefined}
      <ChoreGrid>
        {periodicChores.map(chore => <PeriodicChoreBox key={chore._id} chore={chore} />)}
        {scoreboards.map(scoreboard => <ScoreboardBox key={scoreboard._id} scoreboard={scoreboard} />)}
        {manualChores.map(chore => <ManualChoreBox key={chore._id} chore={chore} />)}
      </ChoreGrid>
    </NavigationBarLayout>
  )
}
