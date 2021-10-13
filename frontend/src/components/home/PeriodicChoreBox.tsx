import './PeriodicChoreBox.css'
import { ReactElement, useCallback, useMemo, useState } from 'react'
import ChoreBox from './ChoreBox'
import { PeriodicChore, PeriodicChoreEntry } from '../../store/entities/periodic-chores'
import { useEntityById } from '../../util/use-entity-by-id'
import { Member, selectMembers } from '../../store/entities/members'
import { useTranslation } from 'react-i18next'
import BasicButton from '../forms/BasicButton'
import api from '../../api/api'
import { SelectMemberModal } from './SelectMemberModal'
import { Link } from 'react-router-dom'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DateTime } from 'luxon'
import UrgencyIndicator from './UrgencyIndicator'

/**
 * After this much progress has been made towards the next due-date, show the chore as being urgent.
 */
const URGENCY_THRESHOLD = 0.75

/**
 * A hook that provides the most recent entry, if one exists.
 *
 * @param entries The chore entries.
 * @returns The most recent entry.
 */
function useMostRecent (entries: readonly PeriodicChoreEntry[]): PeriodicChoreEntry | undefined {
  return entries.length > 0 ? entries[entries.length - 1] : undefined
}

/**
 * For a given chore, obtain the last completion and format it into a human-readable string.
 *
 * @param chore The chore.
 * @returns The formatted string, containing member name and date of completion.
 */
function useRecentlyCompletedString (chore: PeriodicChore): string {
  const last = useMostRecent(chore.entries)

  const lastMember = useEntityById(selectMembers, last?.memberId)
  // get only date part from ISO date-time string
  const lastDate = last != null && last.date.length >= 10 ? last.date.substring(0, 10) : '???'

  return last != null && lastMember != null ? `${lastMember.name}, ${lastDate}` : '--'
}

/**
 * For a given chore, compute the urgency value (number between 0 and 1), where 0 indicates minimal urgency
 * (i.e. the chore was very recently completed) and 1 indicates maximum urgency (the chore is due today or is
 * already past the due date).
 *
 * @param chore The chore.
 * @returns The urgency value.
 */
function useUrgency (chore: PeriodicChore): number {
  const last = useMostRecent(chore.entries)

  return useMemo(() => {
    if (last == null) {
      return 0
    }
    const lastDate = DateTime.fromISO(last.date, { zone: 'utc' })
    const diffDays = Math.round(DateTime.now().diff(lastDate).as('days'))
    return Math.max(0, Math.min(1, diffDays / chore.period))
  }, [last, chore.period])
}

/**
 * Perform a request to add an entry to the chore.
 *
 * @param chore The chore to modify.
 * @param member The member who has completed the chore.
 */
async function addEntry (chore: PeriodicChore, member: Member): Promise<void> {
  await api.periodicChores.update({
    ...chore,
    entries: [
      ...chore.entries,
      {
        memberId: member._id,
        date: DateTime.now().toUTC().toISO()
      }
    ]
  })
}

interface Props {
  chore: PeriodicChore
}

export default function PeriodicChoreBox (props: Props): ReactElement {
  const { t } = useTranslation()

  const urgency = useUrgency(props.chore)
  const recentlyCompleted = useRecentlyCompletedString(props.chore)

  const [isSelectingMember, setSelectingMember] = useState(false)

  const startMarkDone = useCallback(() => setSelectingMember(true), [])
  const cancelMarkDone = useCallback(() => setSelectingMember(false), [])

  const confirmMarkDone = useCallback(async (member?: Member) => {
    setSelectingMember(false)
    if (member != null) {
      await addEntry(props.chore, member)
    }
  }, [props.chore])

  return (
    <ChoreBox className='PeriodicChoreBox' urgent={urgency > URGENCY_THRESHOLD}>
      <div className='PeriodicChoreBox-title'>
        <UrgencyIndicator className='PeriodicChoreBox-urgency' urgency={urgency} />
        {props.chore.name}
        <Link to={`/calendar/${props.chore._id}`} className='PeriodicChoreBox-calendar'>
          <FontAwesomeIcon icon={faCalendarAlt} />
        </Link>
      </div>
      <div className='PeriodicChoreBox-detail'>
        {t('home.chores.last')}<br />
        {recentlyCompleted}
      </div>
      <div>
        <BasicButton onClick={startMarkDone}>
          {t('home.chores.markDone')}
        </BasicButton>
      </div>
      <SelectMemberModal active={isSelectingMember} onSelect={confirmMarkDone} onCancel={cancelMarkDone} />
    </ChoreBox>
  )
}
