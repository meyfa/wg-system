import './FormRow.css'
import { PropsWithChildren, ReactElement } from 'react'

interface Props {
  label: string
}

export default function FormRow (props: PropsWithChildren<Props>): ReactElement {
  return (
    <label className='FormRow'>
      <div className='FormRow-text'>{props.label}</div>
      {props.children}
    </label>
  )
}
