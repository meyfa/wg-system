import { useState } from 'react'

/**
 * Think very hard about whether to use this or not. This custom hook can break things if misused.
 * It always returns the same object reference and only modifies the properties (shallowly).
 *
 * @param object The object with most recent properties.
 * @returns Always the same reference, but with updated properties.
 */
export function useSameObjectReference<T> (object: T): T {
  const [state] = useState<T>(object)
  Object.assign(state, object)
  return state
}
