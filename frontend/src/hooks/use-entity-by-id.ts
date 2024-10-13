import { Selector } from '@reduxjs/toolkit'
import { RootState, useAppSelector } from '../store/store'
import { useMemo } from 'react'
import { Entity } from '../store/entity'

/**
 * A hook that allows selection of a single entity from an array selector. Note that this might be inefficient
 * because it requires searching the entire array (still the result will be memoized, limiting the impact a bit).
 *
 * @param selector The entity array selector.
 * @param id The entity id.
 * @returns The entity with the given id, or undefined if no such entity exists.
 */
export function useEntityById<T extends Entity> (selector: Selector<RootState, T[]>, id: string | undefined | null): T | undefined {
  const entities = useAppSelector(selector)

  return useMemo(() => {
    if (id == null || id === '') {
      return undefined
    }
    return entities.find((item) => item._id === id)
  }, [entities, id])
}
