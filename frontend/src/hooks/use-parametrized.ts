import { useCallback } from 'react'

/**
 * A hook that simplifies callback invocation for callbacks that expect a single value as their argument.
 * This is basically the same as calling bind on the function, but the reference stays the same as long as
 * the dependencies do not change.
 *
 * @param original The callback to invoke.
 * @param value The value to pass to the callback.
 * @returns The bound function.
 */
export function useParametrized<V, R = any> (original: (value: V) => R, value: V): () => R {
  return useCallback(() => original(value), [original, value])
}
