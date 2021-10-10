import './BasicCheckbox.css'
import { ChangeEventHandler, ReactElement } from 'react'
import clsx from 'clsx'

interface Props {
  checked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  className?: string
  disabled?: boolean
}

export default function BasicCheckbox (props: Props): ReactElement {
  return (
    <input
      type='checkbox'
      className={clsx('BasicCheckbox', props.className)}
      disabled={props.disabled}
      checked={props.checked}
      onChange={props.onChange}
    />
  )
}
