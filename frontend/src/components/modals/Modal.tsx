import { UIEvent, PropsWithChildren, ReactElement, useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { useScrollLock } from '../../hooks/use-scroll-lock'

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
    <div
      ref={ref}
      className={clsx(
        'w-screen h-screen fixed top-0 left-0 bg-black/30 pt-6 px-3 md:px-6 pb-16 overflow-y-auto',
        props.active ? 'flex' : 'hidden',
        props.important === true ? 'z-50' : 'z-40'
      )}
      onClick={preventBubbling}
    >
      <div className='relative max-w-full m-auto p-4 md:p-8 bg-white shadow-2xl rounded'>
        {props.children}
      </div>
    </div>
  ), document.body)
}
