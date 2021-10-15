import { PeriodicChoreEntry } from '../../store/entities/periodic-chores'

/**
 * A hook that provides the most recent entry, if one exists.
 *
 * @param entries The chore entries.
 * @returns The most recent entry.
 */
export function useMostRecent (entries: readonly PeriodicChoreEntry[]): PeriodicChoreEntry | undefined {
  return entries.length > 0 ? entries[entries.length - 1] : undefined
}
