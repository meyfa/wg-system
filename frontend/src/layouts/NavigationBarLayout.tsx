import './NavigationBarLayout.css'
import { PropsWithChildren, ReactElement } from 'react'
import NavigationBar from '../components/NavigationBar'

interface Props {
  centered?: boolean
}

export default function NavigationBarLayout (props: PropsWithChildren<Props>): ReactElement {
  return (
    <div className={'NavigationBarLayout' + (props.centered === true ? ' centered' : '')}>
      <NavigationBar />
      <div className='NavigationBarLayout-content'>
        {props.children}
      </div>
    </div>
  )
}
