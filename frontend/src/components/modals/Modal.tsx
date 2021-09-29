import './Modal.css'
import { PropsWithChildren, ReactElement, useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { useScrollLock } from '../../util/use-scroll-lock'

interface Props {
  active: boolean
}

export default function Modal (props: PropsWithChildren<Props>): ReactElement {
  const ref = useRef<HTMLDivElement>(null)
  useScrollLock(ref, props.active)

  if (!props.active) {
    return <></>
  }

  return createPortal(<div ref={ref} className={clsx('Modal', { active: props.active })}>
    <div className='Modal-container'>
      {props.children}
    </div>
  </div>, document.body)
}
