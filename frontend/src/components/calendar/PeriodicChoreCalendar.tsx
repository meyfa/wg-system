import './PeriodicChoreCalendar.css'
import { ReactElement, useCallback, useMemo, useState } from 'react'
import { PeriodicChore, PeriodicChoreEntry } from '../../store/entities/periodic-chores'
import Calendar, { CellRenderFn } from './Calendar'
import { DateTime } from 'luxon'
import { useEntityById } from '../../util/use-entity-by-id'
import { selectMembers } from '../../store/entities/members'
import { PlannedEntry, usePlannedEntry } from '../../hooks/periodic-chores/use-planned-entry'
import EditEntryModal from './EditEntryModal'
import { useParametrized } from '../../util/use-parametrized'
import api from '../../api/api'

type EntryMap = Map<string, readonly number[]>

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
 * where ISO date strings (yyyy-MM-dd) are keys, and their associated values are arrays of indices into the
 * provided array.
 *
 * @param items The items array.
 * @returns The resulting map for lookup of entry indices on a given date.
 */
function useEntryMap (items: readonly PeriodicChoreEntry[]): EntryMap {
  return useMemo(() => {
    const map = new Map<string, number[]>()
    for (let i = 0; i < items.length; ++i) {
      const day = formatDate(items[i].date)
      const array = map.get(day) ?? []
      array.push(i)
      map.set(day, array)
    }
    return map
  }, [items])
}

async function updateEntry (chore: PeriodicChore, index: number, entry: PeriodicChoreEntry): Promise<void> {
  const newEntries = [...chore.entries]
  newEntries[index] = entry
  await api.periodicChores.update({
    ...chore,
    entries: newEntries
  })
}

async function deleteEntry (chore: PeriodicChore, index: number): Promise<void> {
  const newEntries = [...chore.entries]
  newEntries.splice(index, 1)
  await api.periodicChores.update({
    ...chore,
    entries: newEntries
  })
}

function PeriodicChoreCalendarEntry (props: { chore: PeriodicChore, entryIndex: number }): ReactElement {
  const entry = props.chore.entries[props.entryIndex]

  const member = useEntityById(selectMembers, entry.memberId)

  const [editing, setEditing] = useState(false)
  const startEditing = useParametrized(setEditing, true)
  const cancelEditing = useParametrized(setEditing, false)

  const save = useCallback(async (updatedEntry: PeriodicChoreEntry) => {
    setEditing(false)
    await updateEntry(props.chore, props.entryIndex, updatedEntry)
  }, [props.chore, props.entryIndex])

  const onDelete = useCallback(async () => {
    setEditing(false)
    await deleteEntry(props.chore, props.entryIndex)
  }, [props.chore, props.entryIndex])

  return (
    <>
      <button className='PeriodicChoreCalendar-entry'
              style={{ backgroundColor: member?.color }}
              onClick={startEditing}>
        {member?.name ?? '???'}
      </button>
      <EditEntryModal
        active={editing}
        entry={entry}
        onDelete={onDelete}
        onSave={save}
        onCancel={cancelEditing}
      />
    </>
  )
}

function PeriodicChoreCalendarPlannedEntry (props: { entry: PlannedEntry }): ReactElement {
  const member = props.entry.member

  return (
    <button className='PeriodicChoreCalendar-entry planned' style={{ backgroundColor: member.color }}>
      {member.name}
    </button>
  )
}

interface Props {
  chore: PeriodicChore
}

export default function PeriodicChoreCalendar (props: Props): ReactElement {
  const map = useEntryMap(props.chore.entries)
  const planned = usePlannedEntry(props.chore)

  const renderCell: CellRenderFn = useCallback(date => {
    if (planned?.dueDate != null && date.hasSame(planned.dueDate, 'day')) {
      return <PeriodicChoreCalendarPlannedEntry entry={planned} />
    }
    const entryIndices = map.get(formatDate(date))
    if (entryIndices == null) {
      return undefined
    }
    return entryIndices.map((index) => (
      <PeriodicChoreCalendarEntry key={index} chore={props.chore} entryIndex={index} />
    ))
  }, [props.chore, map, planned])

  return (
    <Calendar renderCell={renderCell} />
  )
}