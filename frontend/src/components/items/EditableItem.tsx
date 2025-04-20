import { PropsWithChildren, ReactElement } from 'react'
import EditButton, { EditModalRenderFn } from './EditButton'

interface Props {
  renderModal: EditModalRenderFn
}

export default function EditableItem (props: PropsWithChildren<Props>): ReactElement {
  return (
    <div className='flex my-2 p-3 items-center bg-white rounded-sm shadow-lg'>
      <div className='grow text-xl align-middle'>
        {props.children}
      </div>
      <div className='ml-2 text-right'>
        <EditButton renderModal={props.renderModal} />
      </div>
    </div>
  )
}
