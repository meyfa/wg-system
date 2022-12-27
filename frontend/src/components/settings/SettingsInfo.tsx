import { PropsWithChildren, ReactElement } from 'react'
import Icon from '../Icon'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export default function SettingsInfo (props: PropsWithChildren<{}>): ReactElement {
  return (
    <div className='p-6'>
      <Icon icon={faInfoCircle} className='mr-4' />
      {props.children}
    </div>
  )
}
