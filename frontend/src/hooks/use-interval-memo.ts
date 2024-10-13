import { DependencyList, useEffect, useMemo, useState } from 'react'

/**
 * A hook that periodically increments a counter, useful for invalidating dependencies in regular intervals.
 *
 * @param period The number of milliseconds between counter increments.
 * @returns The counter value.
 */
function useCounter (period: number): number {
  if (period <= 0) {
    throw new Error(`expected a positive interval period, given ${period}`)
  }

  const [count, setCount] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c + 1), period)
    return () => clearInterval(interval)
  }, [period])

  return count
}

/**
 * A hook that works just like useMemo, but with an additional argument describing a time period,
 * after which the value will be recomputed no matter if the dependencies changed or not.
 * This can be used to implement relative timestamps, for example.
 *
 * @param period The auto-reset time period.
 * @param factory The value factory.
 * @param deps The regular dependencies of the factory function.
 */
export function useIntervalMemo<T> (period: number, factory: () => T, deps: DependencyList | undefined): T {
  const updates = useCounter(period)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps == null ? [updates] : [...deps, updates])
}
