import { PeriodicChore } from '../../store/entities/periodic-chores'
import { useAppSelector } from '../../store/store'
import { Member, selectMembers } from '../../store/entities/members'
import { useMemo } from 'react'
import { DateTime } from 'luxon'
import ms from 'ms'
import { useIntervalMemo } from '../use-interval-memo'

/**
 * The time before the 'dueDays' value is recomputed automatically.
 */
const UPDATE_PERIOD = ms('1 hour')

export interface PlannedEntry {
  member: Member
  dueDate?: DateTime
  dueDays?: number
}

function useActiveGroupMembers (groupIds: readonly string[]): Member[] {
  const members = useAppSelector(selectMembers)

  return useMemo(() => {
    return members.filter(member => {
      if (!member.active) {
        return false
      }
      // if groupIds is empty, any active member is okay, otherwise there needs to be a common subset of groups
      return groupIds.length === 0 || member.groups.some(id => groupIds.includes(id))
    })
  }, [members, groupIds])
}

function usePreferredMember (chore: PeriodicChore): Member | undefined {
  const activeMembers = useActiveGroupMembers(chore.groups)

  return useMemo(() => {
    // no active members means nobody can complete the chore
    if (activeMembers.length === 0) {
      return undefined
    }

    // move backwards through time, eliminating members until there is at most one left
    const remaining = activeMembers.slice(0)
    for (let i = chore.entries.length - 1; i >= 0 && remaining.length > 1; --i) {
      const index = remaining.findIndex(item => item._id === chore.entries[i].memberId)
      if (index >= 0) {
        remaining.splice(index, 1)
      }
    }

    // choose the remaining member (if there are multiple, choose the one first in the alphabet)
    return remaining.sort((a, b) => a.name.localeCompare(b.name))[0]
  }, [activeMembers, chore])
}

/**
 * For a given chore, determine a PlannedEntry containing the member who should complete the chore next,
 * as well as date information, if possible. The result is undefined if there is no active member available.
 *
 * @param chore The chore.
 * @returns The upcoming completion information.
 */
export function usePlannedEntry (chore: PeriodicChore): PlannedEntry | undefined {
  const last = chore.entries[chore.entries.length - 1]
  const member = usePreferredMember(chore)

  return useIntervalMemo(UPDATE_PERIOD, () => {
    if (member == null) {
      return undefined
    }

    const dueDate = last != null
      ? DateTime.fromISO(last.date, { zone: 'utc' }).toLocal().plus({ days: chore.period })
      : undefined
    const dueDays = dueDate != null
      ? Math.round(dueDate.diffNow().as('days'))
      : undefined

    return { member, dueDate, dueDays }
  }, [chore, member, last])
}
