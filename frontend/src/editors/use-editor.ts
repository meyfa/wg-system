import { Dispatch, DispatchWithoutAction, useEffect, useMemo, useState } from 'react'
import { useSameObjectReference } from '../util/use-same-object-reference'

/**
 * Options that can be passed to the editor hook to customize it for a specific data type.
 */
export interface EditorOptions<T> {
  value?: T
  default: T
  validate?: (value: T) => boolean
}

// similar to SetStateAction<S>, but allowing partial values
export type UpdateStateAction<S> = Partial<S> | ((prevState: S) => Partial<S>)

/**
 * An editor for a data object, containing the current value, update and reset methods, and a validity state.
 */
export interface Editor<T> {
  value: T
  update: Dispatch<UpdateStateAction<T>>
  reset: DispatchWithoutAction
  isValid: boolean
}

function useValidation<T> (value: T, validator?: (value: T) => boolean): boolean {
  return useMemo(() => {
    return validator != null ? validator(value) : true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
}

/**
 * A custom hook that provides editing functionality. The given options MUST NOT change dynamically.
 *
 * @param options The editor options.
 * @returns The editor.
 */
export function useEditor<T> (options: EditorOptions<T>): Editor<T> {
  const initial = options.value ?? options.default
  const [storedValue, setStoredValue] = useState<T>(initial)

  const update: Dispatch<UpdateStateAction<T>> = (value) => setStoredValue(previous => {
    const partial = value instanceof Function ? value(previous) : value
    return { ...previous, ...partial }
  })

  const reset = (): void => setStoredValue(initial)
  // when the outside inputs change, reset the editor to them
  useEffect(reset, [initial])

  const isValid = useValidation(storedValue, options.validate)

  return useSameObjectReference({
    value: storedValue,
    update,
    reset,
    isValid
  })
}
