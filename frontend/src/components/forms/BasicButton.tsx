import './BasicButton.css'
import { PropsWithChildren, ReactElement } from 'react'

interface BasicButtonProps {
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function BasicButton (props: PropsWithChildren<BasicButtonProps>): ReactElement {
  return (
    <button className={'BasicButton' + (props.className != null ? ' ' + props.className : '')} type='button'
            disabled={props.disabled} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
