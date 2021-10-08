import { Entity } from '../store/entity'
import { Dispatch, DispatchWithoutAction, useEffect, useMemo, useState } from 'react'
import { useSameObjectReference } from '../util/use-same-object-reference'

/**
 * Options that can be passed to the editor hook to customize it for a specific entity type.
 */
export interface EditorOptions<E extends Entity> {
  value?: E
  default: E
  validate?: (value: E) => boolean
}

// similar to SetStateAction<S>, but allowing partial values
export type UpdateStateAction<S> = Partial<S> | ((prevState: S) => Partial<S>)

/**
 * An editor for an entity, containing the current value, update and reset methods, and a validity state.
 */
export interface Editor<E extends Entity> {
  value: E
  update: Dispatch<UpdateStateAction<E>>
  reset: DispatchWithoutAction
  isValid: boolean
}

/**
 * A custom hook that provides editing functionality. The given options MUST NOT change dynamically.
 *
 * @param options The editor options.
 * @returns The editor.
 */
export function useEditor<E extends Entity> (options: EditorOptions<E>): Editor<E> {
  const initial = options.value ?? options.default
  const [storedValue, setStoredValue] = useState<E>(initial)

  const update: Dispatch<UpdateStateAction<E>> = (value) => setStoredValue(previous => {
    const partial = value instanceof Function ? value(previous) : value
    return { ...previous, ...partial }
  })

  const reset = (): void => setStoredValue(initial)
  // when the outside inputs change, reset the editor to them
  useEffect(reset, [initial])

  const isValid = useMemo(() => {
    return options.validate != null ? options.validate(storedValue) : true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedValue])

  return useSameObjectReference({
    value: storedValue,
    update,
    reset,
    isValid
  })
}
