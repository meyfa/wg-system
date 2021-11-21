import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import ms from 'ms'

/**
 * The max delay before forcing a date re-check (e.g. to account for changes in system time that would otherwise
 * only get detected after the entire day has passed).
 */
const MAX_TIMER_DURATION = ms('1 hour')

/**
 * A custom hook that returns the DateTime representing the beginning of the current day.
 * The value will refresh when needed (when the date has changed), but not too often.
 */
export function useCurrentDay (): DateTime {
  const [date, setDate] = useState(() => DateTime.now().startOf('day'))

  useEffect(() => {
    const tomorrow = date.plus({ day: 1 })
    const remainingMs = tomorrow.diffNow().toMillis()
    const timeout = setTimeout(() => {
      setDate(DateTime.now().startOf('day'))
    }, Math.min(remainingMs + 1000, MAX_TIMER_DURATION))
    return () => clearTimeout(timeout)
  }, [date])

  return date
}
