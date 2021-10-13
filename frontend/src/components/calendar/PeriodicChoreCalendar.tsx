import './PeriodicChoreCalendar.css'
import { ReactElement, useCallback, useMemo } from 'react'
import { PeriodicChoreEntry } from '../../store/entities/periodic-chores'
import Calendar, { CellRenderFn } from './Calendar'
import { DateTime } from 'luxon'
import { useEntityById } from '../../util/use-entity-by-id'
import { selectMembers } from '../../store/entities/members'

type EntryMap = Map<string, readonly PeriodicChoreEntry[]>

/**
 * Convert a date-time into an ISO date string (yyyy-MM-dd).
 *
 * @param date The date-time.
 * @returns The formatted string.
 */
function formatDate (date: DateTime | string): string {
  const dateTime = typeof date === 'string'
    ? DateTime.fromISO(date, { zone: 'utc' })
    : date
  return dateTime.toLocal().toFormat('yyyy-MM-dd')
}

/**
 * Transform the given array of entries into a map-lookup format,
 * where ISO date strings (yyyy-MM-dd) are keys, and their associated values are the respective
 * array of entries for that date.
 *
 * @param items The items array.
 * @returns The resulting map for lookup of entries on a given date.
 */
function useEntryMap (items: readonly PeriodicChoreEntry[]): EntryMap {
  return useMemo(() => {
    const map = new Map<string, PeriodicChoreEntry[]>()
    for (const item of items) {
      const day = formatDate(item.date)
      const array = map.get(day) ?? []
      array.push(item)
      map.set(day, array)
    }
    return map
  }, [items])
}

function PeriodicChoreCalendarEntry (props: { entry: PeriodicChoreEntry }): ReactElement {
  const member = useEntityById(selectMembers, props.entry.memberId)

  return (
    <button className='PeriodicChoreCalendarEntry' style={{ backgroundColor: member?.color }}>
      {member?.name ?? '???'}
    </button>
  )
}

interface Props {
  entries: readonly PeriodicChoreEntry[]
}

export default function PeriodicChoreCalendar (props: Props): ReactElement {
  const map = useEntryMap(props.entries)

  const renderCell: CellRenderFn = useCallback(date => {
    const entries = map.get(formatDate(date))
    if (entries == null) {
      return undefined
    }
    return entries.map((entry, i) => <PeriodicChoreCalendarEntry key={i} entry={entry} />)
  }, [map])

  return (
    <Calendar renderCell={renderCell} />
  )
}
