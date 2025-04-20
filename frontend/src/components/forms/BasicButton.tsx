import { MouseEventHandler, PropsWithChildren, ReactElement } from 'react'
import clsx from 'clsx'

interface Props {
  onClick?: MouseEventHandler
  disabled?: boolean
  primary?: boolean
  warn?: boolean
}

export default function BasicButton (props: PropsWithChildren<Props>): ReactElement {
  return (
    <button
      type='button'
      className={clsx(
        'inline-block h-9 px-2.5 mx-1 first:ml-0 last:mr-0 text-sm font-bold uppercase bg-white border border-gray-400 rounded-md cursor-pointer outline-hidden shadow-md',
        'disabled:opacity-50 disabled:pointer-events-none',
        'hocus:ring-1 hocus:ring-current',
        { 'border-blue-500 text-blue-500': props.primary },
        { 'border-red-600 text-red-600': props.warn }
      )}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
