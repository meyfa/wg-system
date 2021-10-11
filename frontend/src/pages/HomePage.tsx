import { ReactElement } from 'react'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import { useAppSelector } from '../store/store'
import { selectManualChores } from '../store/entities/manual-chores'
import ManualChoreBox from '../components/home/ManualChoreBox'
import { selectScoreboards } from '../store/entities/scoreboards'
import ScoreboardBox from '../components/home/ScoreboardBox'
import { selectPeriodicChores } from '../store/entities/periodic-chores'
import PeriodicChoreBox from '../components/home/PeriodicChoreBox'

export default function HomePage (): ReactElement {
  const periodicChores = useAppSelector(selectPeriodicChores)
  const scoreboards = useAppSelector(selectScoreboards)
  const manualChores = useAppSelector(selectManualChores)

  return (
    <NavigationBarLayout>
      {periodicChores.map(chore => <PeriodicChoreBox key={chore._id} chore={chore} />)}
      {scoreboards.map(scoreboard => <ScoreboardBox key={scoreboard._id} scoreboard={scoreboard} />)}
      {manualChores.map(chore => <ManualChoreBox key={chore._id} chore={chore} />)}
    </NavigationBarLayout>
  )
}
