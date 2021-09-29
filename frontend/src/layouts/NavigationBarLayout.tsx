import './NavigationBarLayout.css'
import { PropsWithChildren, ReactElement } from 'react'
import NavigationBar from '../components/NavigationBar'
import clsx from 'clsx'

interface Props {
  centered?: boolean
}

export default function NavigationBarLayout (props: PropsWithChildren<Props>): ReactElement {
  return (
    <div className={clsx('NavigationBarLayout', { centered: props.centered })}>
      <NavigationBar />
      <div className='NavigationBarLayout-content'>
        {props.children}
      </div>
    </div>
  )
}
