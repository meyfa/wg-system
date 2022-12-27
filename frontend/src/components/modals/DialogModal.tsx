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
      <div className='max-w-sm text-center'>
        {props.text}
      </div>
      <div className='mt-4 text-center'>
        {props.children}
      </div>
    </Modal>
  )
}
