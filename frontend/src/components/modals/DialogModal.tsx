import './DialogModal.css'
import { PropsWithChildren, ReactElement } from 'react'
import Modal from './Modal'

interface Props {
  text: string
  active: boolean
  important?: boolean
}

export default function DialogModal (props: PropsWithChildren<Props>): ReactElement {
  return (
    <Modal active={props.active} important={props.important}>
      <div className='DialogModal-text'>{props.text}</div>
      <div className='DialogModal-buttons'>
        {props.children}
      </div>
    </Modal>
  )
}
