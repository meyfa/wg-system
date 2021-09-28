import './Modal.css'
import { PropsWithChildren, ReactElement } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  active: boolean
}

export default function Modal (props: PropsWithChildren<Props>): ReactElement {
  if (!props.active) {
    return <></>
  }

  return createPortal(<div className={'Modal' + (props.active ? ' active' : '')}>
    <div className='Modal-container'>
      {props.children}
    </div>
  </div>, document.body)
}
