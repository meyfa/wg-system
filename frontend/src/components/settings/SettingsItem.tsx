import './SettingsItem.css'
import { PropsWithChildren, ReactElement } from 'react'

interface Props {
  label: string
}

export default function SettingsItem (props: PropsWithChildren<Props>): ReactElement {
  return (
    <div className='SettingsItem'>
      <div className='SettingsItem-text'>{props.label}</div>
      <div className='SettingsItem-content'>{props.children}</div>
    </div>
  )
}
