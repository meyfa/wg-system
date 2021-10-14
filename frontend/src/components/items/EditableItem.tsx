import './EditableItem.css'
import { CSSProperties, PropsWithChildren, ReactElement } from 'react'
import clsx from 'clsx'
import EditButton, { EditModalRenderFn } from './EditButton'

interface Props {
  className?: string
  style?: CSSProperties
  renderModal: EditModalRenderFn
}

export default function EditableItem (props: PropsWithChildren<Props>): ReactElement {
  return (
    <div className={clsx('EditableItem', props.className)} style={props.style}>
      <div className='EditableItem-name'>
        {props.children}
      </div>
      <div className='EditableItem-actions'>
        <EditButton renderModal={props.renderModal} />
      </div>
    </div>
  )
}
