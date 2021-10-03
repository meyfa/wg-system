import './ManualChoreBox.css'
import { ReactElement, useCallback, useMemo, useState } from 'react'
import { ManualChore } from '../../store/entities/manual-chores'
import ChoreBox from './ChoreBox'
import BasicButton from '../forms/BasicButton'
import { useTranslation } from 'react-i18next'
import api from '../../api/api'
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { SelectMemberModal } from './SelectMemberModal'
import { Member } from '../../store/entities/members'
import { useAppSelector } from '../../store/store'
import { Scoreboard, selectScoreboards } from '../../store/entities/scoreboards'

/**
 * Increase the score of a specific member on the given scoreboard by 1.
 *
 * @param scoreboard The scoreboard.
 * @param memberId The member whose score to increment.
 * @returns A cloned Scoreboard with the relevant score added or modified.
 */
function incrementScore (scoreboard: Scoreboard, memberId: string): Scoreboard {
  const index = scoreboard.scores.findIndex(score => score.memberId === memberId)
  // if score exists, simply increment
  if (index >= 0) {
    return {
      ...scoreboard,
      scores: scoreboard.scores.map((item, i) => {
        return i === index ? { ...item, score: item.score + 1 } : item
      })
    }
  }
  // otherwise, insert with score=1, and choose offset to be the max score of any existing member on this scoreboard
  // (be generous to new members)
  const maxExistingScore = scoreboard.scores.reduce((v, item) => Math.max(v, item.offset + item.score), 0)
  return {
    ...scoreboard,
    scores: [
      ...scoreboard.scores,
      { memberId, offset: maxExistingScore, score: 1 }
    ]
  }
}

interface Props {
  chore: ManualChore
}

export default function ManualChoreBox (props: Props): ReactElement {
  const { t } = useTranslation()

  const scoreboards = useAppSelector(selectScoreboards)
  const choreScoreboard = useMemo(() => {
    return props.chore.scoreboardId != null
      ? scoreboards.find(item => item._id === props.chore.scoreboardId)
      : undefined
  }, [props.chore.scoreboardId, scoreboards])

  const isDue = props.chore.dueSince != null && props.chore.dueSince > 0

  const markDue = useCallback(async () => {
    await api.manualChores.update({
      ...props.chore,
      dueSince: Date.now()
    })
  }, [props.chore])

  const markDone = useCallback(async (member?: Member) => {
    setSelectingMember(false)
    await api.manualChores.update({
      ...props.chore,
      dueSince: 0
    })
    if (choreScoreboard != null && member != null) {
      await api.scoreboards.update(incrementScore(choreScoreboard, member._id))
    }
  }, [props.chore, choreScoreboard])

  const [isSelectingMember, setSelectingMember] = useState(false)

  const startMarkDone = useCallback(async () => {
    // when no scoreboard exists for the chore, do not show the modal
    if (choreScoreboard == null) {
      await markDone()
      return
    }
    setSelectingMember(true)
  }, [choreScoreboard, markDone])

  const cancelMarkDone = useCallback(() => setSelectingMember(false), [])

  return (
    <ChoreBox className='ManualChoreBox' urgent={isDue}>
      <div className='ManualChoreBox-title'>
        <FontAwesomeIcon className={clsx('ManualChoreBox-icon', { good: !isDue, bad: isDue })}
                         icon={isDue ? faExclamationTriangle : faCheckCircle} />
        {props.chore.name}
      </div>
      <div className='ManualChoreBox-actions'>
        {isDue
          ? (<BasicButton onClick={startMarkDone}>
            {t('home.chores.markDone')}
          </BasicButton>)
          : (<BasicButton onClick={markDue}>
            {t('home.chores.markDue')}
          </BasicButton>)
        }
      </div>
      <SelectMemberModal active={isSelectingMember} onSelect={markDone} onCancel={cancelMarkDone} />
    </ChoreBox>
  )
}
