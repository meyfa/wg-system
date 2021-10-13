import './Calendar.css'
import { PeriodicChoreEntry } from '../../store/entities/periodic-chores'
import { useAppSelector } from '../../store/store'
import { selectMembers } from '../../store/entities/members'
import { useMemo } from 'react'
import Empty from '../Empty'
import { useTranslation } from 'react-i18next'

/**
 * Behaves like Array.prototype.map, but starts at the right and moves backwards through the array.
 * This is a more performant version of calling map() followed by reverse().
 *
 * @param array The array to map.
 * @param callbackFn The mapping function.
 * @returns The mapped and reversed array.
 */
function mapRight<T, U> (array: readonly T[], callbackFn: (value: T, index: number) => U): U[] {
  return array.map((value, index) => {
    const actualIndex = array.length - 1 - index
    return callbackFn(array[actualIndex], actualIndex)
  })
}

function formatDate (date: string): string {
  return date.length >= 10 ? date.substring(0, 10) : '???'
}

interface Props {
  items: readonly PeriodicChoreEntry[]
}

export default function Calendar (props: Props): JSX.Element {
  const { t } = useTranslation()

  const members = useAppSelector(selectMembers)
  const membersMap = useMemo(() => {
    return new Map(members.map(item => [item._id, item]))
  }, [members])

  if (props.items.length === 0) {
    return <Empty message={t('calendar.empty.noItems')} />
  }

  return (
    <div className='Calendar'>
      {mapRight(props.items, (item, i) => (
        <div key={i} className='Calendar-item'>
          <div className='Calendar-item-date'>{formatDate(item.date)}</div>
          <div className='Calendar-item-member'>{membersMap.get(item.memberId)?.name ?? '--'}</div>
        </div>
      ))}
    </div>
  )
}
