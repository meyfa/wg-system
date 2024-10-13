import { ReactElement, useCallback, useState } from 'react'
import { ManualChore } from '../../store/entities/manual-chores'
import ChoreBox from './ChoreBox'
import BasicButton from '../forms/BasicButton'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/api'
import { SelectMemberModal } from './SelectMemberModal'
import { Member } from '../../store/entities/members'
import { Scoreboard, selectScoreboards } from '../../store/entities/scoreboards'
import { useEntityById } from '../../hooks/use-entity-by-id'
import { DateTime } from 'luxon'
import UrgencyIndicator from './UrgencyIndicator'

/**
 * Increase the score of a specific member on the given scoreboard by 1 times the member's scoreboard multiplier.
 *
 * @param scoreboard The scoreboard.
 * @param member The member whose score to increment.
 * @returns A cloned Scoreboard with the relevant score added or modified.
 */
function incrementScore (scoreboard: Scoreboard, member: Member): Scoreboard {
  const increment = member.scoreboardMultiplier ?? 1
  const index = scoreboard.scores.findIndex((score) => score.memberId === member._id)
  // if score exists, simply increment
  if (index >= 0) {
    return {
      ...scoreboard,
      scores: scoreboard.scores.map((item, i) => {
        return i === index ? { ...item, score: item.score + increment } : item
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
      { memberId: member._id, offset: maxExistingScore, score: increment }
    ]
  }
}

function useDueState (chore: ManualChore): [boolean, () => Promise<void>, (member?: Member) => Promise<void>] {
  const choreScoreboard = useEntityById(selectScoreboards, chore.scoreboardId)

  const isDue = chore.dueSince > 0

  const markDue = useCallback(async () => {
    await api.manualChores.update({ ...chore, dueSince: DateTime.now().toUTC().toMillis() })
  }, [chore])

  const markDone = useCallback(async (member?: Member) => {
    await api.manualChores.update({ ...chore, dueSince: 0 })
    if (choreScoreboard != null && member != null) {
      await api.scoreboards.update(incrementScore(choreScoreboard, member))
    }
  }, [chore, choreScoreboard])

  return [isDue, markDue, markDone]
}

interface Props {
  chore: ManualChore
}

export default function ManualChoreBox (props: Props): ReactElement {
  const { t } = useTranslation()

  const [isDue, markDue, markDone] = useDueState(props.chore)

  const [isSelectingMember, setSelectingMember] = useState(false)

  const startMarkDone = useCallback(() => {
    // when no scoreboard exists for the chore, do not show the modal
    if (props.chore.scoreboardId == null) {
      void markDone()
      return
    }
    setSelectingMember(true)
  }, [props.chore.scoreboardId, markDone])

  const confirmMarkDone = useCallback((member?: Member) => {
    setSelectingMember(false)
    void markDone(member)
  }, [markDone])

  const cancelMarkDone = useCallback(() => setSelectingMember(false), [])

  const markDueSync = useCallback(() => {
    void markDue()
  }, [markDue])

  const title = (
    <>
      <UrgencyIndicator urgency={isDue} />
      {props.chore.name}
    </>
  )

  return (
    <ChoreBox urgent={isDue} title={title}>
      <div>
        <BasicButton onClick={startMarkDone}>{t('home.chores.markDone')}</BasicButton>
        {!isDue && <BasicButton onClick={markDueSync}>{t('home.chores.markDue')}</BasicButton>}
      </div>
      <SelectMemberModal active={isSelectingMember} onSelect={confirmMarkDone} onCancel={cancelMarkDone} />
    </ChoreBox>
  )
}
