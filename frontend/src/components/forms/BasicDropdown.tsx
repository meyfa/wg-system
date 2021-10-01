import './BasicDropdown.css'
import { ChangeEventHandler, ReactElement, useMemo } from 'react'
import clsx from 'clsx'

interface Props<V> {
  disabled?: boolean
  options: V[]
  formatter: (item: V) => string
  value?: V
  onSelect?: (item: V) => void
  className?: string
}

export default function BasicDropdown<V> (props: Props<V>): ReactElement {
  /* eslint-disable react/prop-types */ // for some reason the linter complains here? maybe because of generics?
  const valueIndex = props.value != null ? props.options.indexOf(props.value) : 0

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const index = parseInt(event.target.value, 10)
    if (index >= 0 && index < props.options.length && props.onSelect != null) {
      props.onSelect(props.options[index])
    }
  }

  const formattedOptions = useMemo(() => {
    return props.options.map(props.formatter)
  }, [props.options, props.formatter])

  return (
    <select className={clsx('BasicDropdown', props.className)}
            disabled={props.disabled}
            value={valueIndex}
            onChange={handleChange}>
      {formattedOptions.map((formattedOption, index) => (
        <option key={index} value={index}>{formattedOption}</option>
      ))}
    </select>
  )
}
