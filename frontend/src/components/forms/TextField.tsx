import './TextField.css'
import { ChangeEventHandler } from 'react'

interface Props {
  value?: string | number
  placeholder?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  className?: string
  disabled?: boolean
}

export default function TextField (props: Props): JSX.Element {
  return (
    <input
      type='text'
      className={'TextField' + (props.className != null ? ' ' + props.className : '')}
      disabled={props.disabled}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
    />
  )
}
