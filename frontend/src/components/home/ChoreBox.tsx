import './ChoreBox.css'
import { PropsWithChildren, ReactElement } from 'react'
import clsx from 'clsx'

interface Props {
  className?: string
  urgent?: boolean
}

export default function ChoreBox (props: PropsWithChildren<Props>): ReactElement {
  return (
    <div className={clsx('ChoreBox', props.className, { urgent: props.urgent })}>
      {props.children}
    </div>
  )
}
