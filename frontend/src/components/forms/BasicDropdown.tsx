import './BasicDropdown.css'
import { ChangeEventHandler, ReactElement, useCallback, useMemo } from 'react'
import clsx from 'clsx'

function useFormatter<V> (options: readonly V[], formatter: (item: V) => string): string[] {
  return useMemo(() => options.map(formatter), [options, formatter])
}

function useChangeHandler<V> (options: readonly V[], onSelect?: (item: V) => void): ChangeEventHandler<HTMLSelectElement> {
  return useCallback((event) => {
    const index = parseInt(event.target.value, 10)
    if (index >= 0 && index < options.length && onSelect != null) {
      onSelect(options[index])
    }
  }, [onSelect, options])
}

interface Props<V> {
  disabled?: boolean
  options: readonly V[]
  formatter: (item: V) => string
  value?: V | undefined
  onSelect?: (item: V) => void
  className?: string
}

export default function BasicDropdown<V> (props: Props<V>): ReactElement {
  /* eslint-disable react/prop-types */ // for some reason the linter complains here? maybe because of generics?

  const valueIndex = useMemo(() => {
    return props.value != null ? props.options.indexOf(props.value) : -1
  }, [props.value, props.options])

  const invalidSelection = valueIndex < 0

  const formattedOptions = useFormatter(props.options, props.formatter)
  const handleChange = useChangeHandler(props.options, props.onSelect)

  return (
    <select className={clsx('BasicDropdown', props.className)}
            disabled={props.disabled}
            value={valueIndex}
            onChange={handleChange}>
      {invalidSelection ? <option value={-1} /> : undefined}
      {formattedOptions.map((formattedOption, index) => (
        <option key={index} value={index}>{formattedOption}</option>
      ))}
    </select>
  )
}
