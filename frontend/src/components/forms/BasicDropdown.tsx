import { ChangeEventHandler, ReactElement, useCallback, useMemo } from 'react'
import clsx from 'clsx'

interface Props<V> {
  disabled?: boolean
  options: readonly V[]
  formatter: (item: V) => string
  value?: V | undefined
  onSelect?: (item: V) => void
}

export default function BasicDropdown<V> (props: Props<V>): ReactElement {
  const { options, formatter, value, onSelect } = props

  const valueIndex = useMemo(() => {
    // @ts-expect-error because props.value can be undefined, but props.options cannot contain undefined
    // (this component is a lot more useful if value can be undefined, so we need to allow this, unfortunately)
    return options.indexOf(value)
  }, [value, options])
  const invalidSelection = valueIndex < 0

  const handleChange: ChangeEventHandler<HTMLSelectElement> = useCallback((event) => {
    const index = Number.parseInt(event.target.value, 10)
    if (index >= 0 && index < options.length && onSelect != null) {
      onSelect(options[index])
    }
  }, [onSelect, options])

  return (
    <select
      className={clsx(
        'inline-block h-9 px-3 leading-none font-semibold bg-white border border-gray-400 rounded-lg shadow-md cursor-pointer outline-none',
        'disabled:opacity-50 disabled:pointer-events-none',
        'hover:border-gray-500 focus:border-black hover:ring-1 ring-gray-400'
      )}
      disabled={props.disabled}
      value={valueIndex}
      onChange={handleChange}
    >
      {invalidSelection ? <option value={-1} /> : undefined}
      {options.map((option, index) => (
        <option key={index} value={index}>{formatter(option)}</option>
      ))}
    </select>
  )
}
