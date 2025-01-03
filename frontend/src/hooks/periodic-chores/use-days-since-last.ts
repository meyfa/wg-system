import { PeriodicChore } from '../../store/entities/periodic-chores'
import { DateTime } from 'luxon'
import ms from 'ms'
import { useIntervalMemo } from '../use-interval-memo'

/**
 * The time before the 'days since last' value is recomputed automatically.
 */
const UPDATE_PERIOD = ms('1 hour')

/**
 * For a give chore, determine the number of days since last completion.
 *
 * @param chore The chore.
 * @returns The number of days that have passed.
 */
export function useDaysSinceLast (chore: PeriodicChore): number | undefined {
  const last = chore.entries.length > 0 ? chore.entries[chore.entries.length - 1] : undefined

  return useIntervalMemo(UPDATE_PERIOD, () => {
    if (last == null) {
      return undefined
    }
    const lastDate = DateTime.fromISO(last.date, { zone: 'utc' })
    return Math.round(-lastDate.diffNow().as('days'))
  }, [last])
}
