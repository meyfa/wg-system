import './BasicButton.css'
import { PropsWithChildren, ReactElement } from 'react'
import clsx from 'clsx'

interface BasicButtonProps {
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function BasicButton (props: PropsWithChildren<BasicButtonProps>): ReactElement {
  return (
    <button className={clsx('BasicButton', props.className)} type='button'
            disabled={props.disabled} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
