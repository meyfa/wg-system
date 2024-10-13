import { ChangeEventHandler, ReactElement } from 'react'
import clsx from 'clsx'

interface Props {
  value?: string | number
  numeric?: boolean
  placeholder?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  disabled?: boolean
}

export default function TextField (props: Props): ReactElement {
  return (
    <input
      type={props.numeric === true ? 'number' : 'text'}
      className={clsx(
        'h-9 px-2 text-base leading-none bg-white border-2 border-gray-400 rounded-sm outline-none',
        'disabled:opacity-50 disabled:pointer-events-none',
        'hover:border-gray-500 focus:border-black focus:shadow-md'
      )}
      disabled={props.disabled}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
    />
  )
}
