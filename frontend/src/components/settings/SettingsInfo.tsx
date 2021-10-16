import './SettingsInfo.css'
import { PropsWithChildren, ReactElement } from 'react'
import Icon from '../Icon'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export default function SettingsInfo (props: PropsWithChildren<{}>): ReactElement {
  return (
    <div className='SettingsInfo'>
      <Icon icon={faInfoCircle} />
      {props.children}
    </div>
  )
}
