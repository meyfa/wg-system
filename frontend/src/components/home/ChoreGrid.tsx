import './ChoreGrid.css'
import { PropsWithChildren, ReactElement } from 'react'

export default function ChoreGrid (props: PropsWithChildren<{}>): ReactElement {
  return (
    <div className='ChoreGrid'>
      {props.children}
    </div>
  )
}
