import './PeriodicChoreBox.css'
import { ReactElement, useCallback, useState } from 'react'
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

function useMostRecent (entries: readonly PeriodicChoreEntry[]): PeriodicChoreEntry | undefined {
  return entries.length > 0 ? entries[entries.length - 1] : undefined
}

function useRecentlyCompletedString (last: PeriodicChoreEntry | undefined): string {
  const lastMember = useEntityById(selectMembers, last?.memberId)
  // get only date part from ISO date-time string
  const lastDate = last != null && last.date.length >= 10 ? last.date.substring(0, 10) : '???'

  return last != null && lastMember != null ? `${lastMember.name}, ${lastDate}` : '--'
}

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

  const mostRecent = useMostRecent(props.chore.entries)
  const recentlyCompleted = useRecentlyCompletedString(mostRecent)

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
    <ChoreBox className='PeriodicChoreBox'>
      <div className='PeriodicChoreBox-title'>
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
