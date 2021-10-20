import './ScoreboardBox.css'
import { ReactElement, useMemo } from 'react'
import { Scoreboard, ScoreboardScore } from '../../store/entities/scoreboards'
import ChoreBox from './ChoreBox'
import { useTranslation } from 'react-i18next'
import ScoreRow from './ScoreRow'
import { useAppSelector } from '../../store/store'
import { selectMembers } from '../../store/entities/members'

/**
 * A filter hook that limits a given array of scores to only contain scores for active members.
 *
 * @param scores The scores array.
 * @returns Only the active scores.
 */
function useActiveScores (scores: readonly ScoreboardScore[]): ScoreboardScore[] {
  const members = useAppSelector(selectMembers)
  const activeMemberIds = useMemo(() => {
    const ids = members.filter(item => item.active).map(item => item._id)
    return new Set(ids)
  }, [members])

  return useMemo(() => {
    return Array.from(activeMemberIds).map(id => {
      return scores.find(item => item.memberId === id) ?? { memberId: id, offset: 0, score: Number.NEGATIVE_INFINITY }
    })
  }, [scores, activeMemberIds])
}

interface RelativeScore {
  memberId: string
  relativeScore: number
}

/**
 * A mapping hook that converts the given array of scoreboard scores into an array of relative scores.
 *
 * @param scores The scores array.
 * @returns The relativized scores.
 */
function useRelativeScores (scores: readonly ScoreboardScore[]): RelativeScore[] {
  return useMemo(() => {
    const max = scores.reduce((v, item) => Math.max(v, item.score + item.offset), 0)
    const entries = scores.map(item => ({
      memberId: item.memberId,
      relativeScore: item.score + item.offset - max
    }))
    return entries.sort((a, b) => a.relativeScore - b.relativeScore)
  }, [scores])
}

interface Props {
  scoreboard: Scoreboard
}

export default function ScoreboardBox (props: Props): ReactElement {
  const { t } = useTranslation()

  const activeScores = useActiveScores(props.scoreboard.scores)
  const relativeScores = useRelativeScores(activeScores)

  const lowestScore = useMemo(() => {
    return relativeScores.reduce((v, item) => Math.min(v, item.relativeScore ?? 0), 0)
  }, [relativeScores])

  return (
    <ChoreBox className='ScoreboardBox'>
      <div className='ScoreboardBox-title'>
        {props.scoreboard.name}
      </div>
      {relativeScores.map((row, i) => (
        <ScoreRow key={i} memberId={row.memberId} relativeScore={row.relativeScore} lowestScore={lowestScore} />
      ))}
      <div className='ScoreboardBox-info'>
        {relativeScores.length > 0 ? t('home.scoreboards.help') : t('home.scoreboards.empty')}
      </div>
    </ChoreBox>
  )
}
