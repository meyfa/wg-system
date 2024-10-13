import { ReactElement, useCallback, useState } from 'react'
import ChoreBox from './ChoreBox'
import { PeriodicChore } from '../../store/entities/periodic-chores'
import { useEntityById } from '../../hooks/use-entity-by-id'
import { Member, selectMembers } from '../../store/entities/members'
import { useTranslation } from 'react-i18next'
import BasicButton from '../forms/BasicButton'
import { api } from '../../api/api'
import { SelectMemberModal } from './SelectMemberModal'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { DateTime } from 'luxon'
import UrgencyIndicator from './UrgencyIndicator'
import { useUrgency } from '../../hooks/periodic-chores/use-urgency'
import { usePlannedEntry } from '../../hooks/periodic-chores/use-planned-entry'
import ChoreDetailButton from './ChoreDetailButton'

/**
 * After this much progress has been made towards the next due-date, show the chore as being urgent.
 */
const URGENCY_THRESHOLD = 0.75

/**
 * For a given chore, obtain the last completion and format it into a human-readable string.
 *
 * @param chore The chore.
 * @returns The formatted string, containing member name and date of completion.
 */
function useRecentlyCompletedString (chore: PeriodicChore): string {
  const last = chore.entries.length > 0 ? chore.entries[chore.entries.length - 1] : undefined

  const lastMember = useEntityById(selectMembers, last?.memberId)
  // get only date part from ISO date-time string
  const lastDate = last != null && last.date.length >= 10 ? last.date.slice(0, 10) : '???'

  return last != null && lastMember != null ? `${lastMember.name}, ${lastDate}` : '--'
}

/**
 * For a given chore, determine the string to show for the "next up" property.
 * This string includes the member name and if possible, the remaining days for that member to complete the chore.
 *
 * @param chore The chore.
 * @returns A string describing the upcoming due date.
 */
function usePlannedEntryString (chore: PeriodicChore): string {
  const { t } = useTranslation()
  const entry = usePlannedEntry(chore)
  if (entry == null) {
    return '--'
  }
  if (entry.dueDays != null) {
    const daysRemaining = Math.max(0, entry.dueDays)
    return t('home.chores.nextFormatDays', { name: entry.member.name, count: daysRemaining })
  }
  return t('home.chores.nextFormat', { name: entry.member.name })
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
  const planned = usePlannedEntryString(props.chore)

  const [isSelectingMember, setSelectingMember] = useState(false)

  const startMarkDone = useCallback(() => setSelectingMember(true), [])
  const cancelMarkDone = useCallback(() => setSelectingMember(false), [])

  const confirmMarkDone = useCallback((member?: Member) => {
    setSelectingMember(false)
    if (member != null) {
      void addEntry(props.chore, member)
    }
  }, [props.chore])

  const title = (
    <>
      <UrgencyIndicator urgency={urgency} />
      {props.chore.name}
      <ChoreDetailButton icon={faCalendarAlt} link={`/calendar/${props.chore._id}`} />
    </>
  )

  return (
    <ChoreBox urgent={urgency > URGENCY_THRESHOLD} title={title}>
      <div className='leading-tight mb-2'>
        {t('home.chores.last')}<br />
        {recentlyCompleted}
      </div>
      <div className='leading-tight mb-2'>
        {t('home.chores.next')}<br />
        {planned}
      </div>
      <div>
        <BasicButton onClick={startMarkDone}>{t('home.chores.markDone')}</BasicButton>
      </div>
      <SelectMemberModal active={isSelectingMember} onSelect={confirmMarkDone} onCancel={cancelMarkDone} />
    </ChoreBox>
  )
}
