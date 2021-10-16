import './SettingsBox.css'
import { PropsWithChildren, ReactElement } from 'react'

export default function SettingsBox (props: PropsWithChildren<{}>): ReactElement {
  return (
    <div className='SettingsBox'>
      {props.children}
    </div>
  )
}
