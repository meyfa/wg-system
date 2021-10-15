import { PeriodicChore } from '../../store/entities/periodic-chores'
import { useDaysSinceLast } from './use-days-since-last'
import { useMemo } from 'react'

/**
 * For a given chore, compute the urgency value (number between 0 and 1), where 0 indicates minimal urgency
 * (i.e. the chore was very recently completed) and 1 indicates maximum urgency (the chore is due today or is
 * already past the due date).
 *
 * @param chore The chore.
 * @returns The urgency value.
 */
export function useUrgency (chore: PeriodicChore): number {
  const diffDays = useDaysSinceLast(chore)

  return useMemo(() => {
    return diffDays != null
      ? Math.max(0, Math.min(1, diffDays / chore.period))
      : 0
  }, [diffDays, chore.period])
}
