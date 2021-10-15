import { PeriodicChore } from '../../store/entities/periodic-chores'
import { useMostRecent } from './use-most-recent'
import { useMemo } from 'react'
import { DateTime } from 'luxon'

/**
 * For a give chore, determine the number of days since last completion.
 *
 * @param chore The chore.
 * @returns The number of days that have passed.
 */
export function useDaysSinceLast (chore: PeriodicChore): number | undefined {
  const last = useMostRecent(chore.entries)

  return useMemo(() => {
    if (last == null) {
      return undefined
    }
    const lastDate = DateTime.fromISO(last.date, { zone: 'utc' })
    return Math.round(-lastDate.diffNow().as('days'))
  }, [last])
}
