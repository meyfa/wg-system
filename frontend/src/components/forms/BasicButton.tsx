import './BasicButton.css'
import { PropsWithChildren, ReactElement } from 'react'
import clsx from 'clsx'

interface BasicButtonProps {
  onClick?: () => void
  className?: string
  disabled?: boolean
  primary?: boolean
  warn?: boolean
}

export default function BasicButton (props: PropsWithChildren<BasicButtonProps>): ReactElement {
  return (
    <button className={clsx('BasicButton', props.className, { primary: props.primary, warn: props.warn })}
            type='button'
            disabled={props.disabled} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
