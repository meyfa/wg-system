import './TextField.css'
import { ChangeEventHandler } from 'react'
import clsx from 'clsx'

interface Props {
  value?: string | number
  numeric?: boolean
  placeholder?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  className?: string
  disabled?: boolean
}

export default function TextField (props: Props): JSX.Element {
  return (
    <input
      type={props.numeric === true ? 'number' : 'text'}
      className={clsx('TextField', props.className)}
      disabled={props.disabled}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
    />
  )
}
