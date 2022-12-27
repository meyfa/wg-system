import { ChangeEventHandler, ReactElement } from 'react'

interface Props {
  checked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  disabled?: boolean
}

export default function BasicCheckbox (props: Props): ReactElement {
  return (
    <input
      type='checkbox'
      className='w-8 h-5 leading-9 align-middle'
      disabled={props.disabled}
      checked={props.checked}
      onChange={props.onChange}
    />
  )
}
