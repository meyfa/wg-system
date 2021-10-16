import './Modal.css'
import { UIEvent, PropsWithChildren, ReactElement, useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { useScrollLock } from '../../util/use-scroll-lock'

function preventBubbling (event: UIEvent): void {
  // Although we are in a portal, this is still sometimes necessary when dealing with buttons etc.
  // because apparently React events bubble through the virtual DOM, not the browser DOM
  event.stopPropagation()
}

interface Props {
  active: boolean
  important?: boolean
}

export default function Modal (props: PropsWithChildren<Props>): ReactElement {
  const ref = useRef<HTMLDivElement>(null)
  useScrollLock(ref, props.active)

  if (!props.active) {
    return <></>
  }

  return createPortal((
    <div ref={ref} className={clsx('Modal', { active: props.active, important: props.important })} onClick={preventBubbling}>
      <div className='Modal-container'>
        {props.children}
      </div>
    </div>
  ), document.body)
}
