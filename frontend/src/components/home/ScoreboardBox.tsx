import './ScoreboardBox.css'
import { ReactElement, useMemo } from 'react'
import { Scoreboard } from '../../store/entities/scoreboards'
import ChoreBox from './ChoreBox'
import { useTranslation } from 'react-i18next'
import ScoreRow from './ScoreRow'

interface Props {
  scoreboard: Scoreboard
}

export default function ScoreboardBox (props: Props): ReactElement {
  const { t } = useTranslation()

  const scores = useMemo(() => {
    const max = props.scoreboard.scores.reduce((v, item) => Math.max(v, item.score + item.offset), 0)
    const entries = props.scoreboard.scores.map(item => ({
      memberId: item.memberId,
      relativeScore: item.score + item.offset - max
    }))
    return entries.sort((a, b) => a.relativeScore - b.relativeScore)
  }, [props.scoreboard])

  const lowestScore = useMemo(() => {
    return scores.reduce((v, item) => Math.min(v, item.relativeScore), 0)
  }, [scores])

  return (
    <ChoreBox className='ScoreboardBox'>
      <div className='ScoreboardBox-title'>
        {props.scoreboard.name}
      </div>
      {scores.map((row, i) => (
        <ScoreRow key={i} memberId={row.memberId} relativeScore={row.relativeScore} lowestScore={lowestScore} />
      ))}
      <div className='ScoreboardBox-info'>
        {scores.length > 0 ? t('home.scoreboards.help') : t('home.scoreboards.empty')}
      </div>
    </ChoreBox>
  )
}
