import './Calendar.css'
import { PeriodicChoreEntry } from '../../store/entities/periodic-chores'
import { selectMembers } from '../../store/entities/members'
import { ReactElement, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { useEntityById } from '../../util/use-entity-by-id'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Keys for week-day translations, found at `calendar.week.${weekday}`
 */
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

type EntryMap = Map<string, readonly PeriodicChoreEntry[]>
type CalendarGrid = Array<Array<CalendarDaySpec | undefined>>

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

function CalendarHeader (): ReactElement {
  const { t } = useTranslation()

  return (
    <thead>
      <tr>
        {WEEKDAYS.map(weekday => (
          <th key={weekday} className='Calendar-th'>
            {t(`calendar.week.${weekday}`)}
          </th>
        ))}
      </tr>
    </thead>
  )
}

interface CalendarDaySpec {
  day?: number
  items: readonly PeriodicChoreEntry[]
}

function CalendarBody (props: { items: readonly PeriodicChoreEntry[], month: DateTime }): ReactElement {
  const entryMap = useEntryMap(props.items)

  const grid = useMemo(() => {
    const last = props.month.endOf('month')

    const rows: CalendarGrid = new Array(6).fill(undefined).map(() => new Array(7).fill(undefined))

    let offset = props.month.weekday - 1
    for (let cursor = props.month; cursor.toMillis() < last.toMillis(); cursor = cursor.plus({ days: 1 })) {
      const items = entryMap.get(formatDate(cursor)) ?? []
      rows[Math.trunc(offset / 7)][offset % 7] = {
        day: cursor.day,
        items
      }
      ++offset
    }

    return rows
  }, [props.month, entryMap])

  return (
    <tbody>
      {grid.map((row, i) => <CalendarRow key={i} columns={row} />)}
    </tbody>
  )
}

function CalendarRow (props: { columns: Array<CalendarDaySpec | undefined> }): ReactElement {
  return (
    <tr>
      {props.columns.map((col, i) => (
        <CalendarCell key={i} spec={col} />
      ))}
    </tr>
  )
}

function CalendarCell (props: { spec?: CalendarDaySpec }): ReactElement {
  if (props.spec == null) {
    return <td className='Calendar-td inactive' />
  }

  return (
    <td className='Calendar-td'>
      {props.spec.day}
      {props.spec.items.map((item, i) => (
        <CalendarEntry key={i} entry={item} />
      ))}
    </td>
  )
}

function CalendarEntry (props: { entry: PeriodicChoreEntry }): ReactElement {
  const member = useEntityById(selectMembers, props.entry.memberId)

  return (
    <button className='Calendar-entry' style={{ backgroundColor: member?.color }}>
      {member?.name ?? '???'}
    </button>
  )
}

interface Props {
  items: readonly PeriodicChoreEntry[]
}

export default function Calendar (props: Props): ReactElement {
  // first day of month
  const [month, setMonth] = useState(() => DateTime.now().startOf('month'))

  const previousMonth = useCallback(() => setMonth(m => m.minus({ months: 1 })), [])
  const nextMonth = useCallback(() => setMonth(m => m.plus({ months: 1 })), [])

  const monthName = useMemo(() => {
    return month.toLocaleString({
      year: 'numeric',
      month: 'long'
    })
  }, [month])

  return (
    <div className='Calendar'>
      <div className='Calendar-head'>
        <button className='Calendar-head-btn' onClick={previousMonth}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <div className='Calendar-head-month'>{monthName}</div>
        <button className='Calendar-head-btn' onClick={nextMonth}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
      <table className='Calendar-table'>
        <CalendarHeader />
        <CalendarBody month={month} items={props.items} />
      </table>
    </div>
  )
}
