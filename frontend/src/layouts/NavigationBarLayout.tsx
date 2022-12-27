import './NavigationBarLayout.css'
import { PropsWithChildren, ReactElement } from 'react'
import NavigationBar from '../components/NavigationBar'
import clsx from 'clsx'

interface Props {
  centered?: boolean
}

export default function NavigationBarLayout (props: PropsWithChildren<Props>): ReactElement {
  return (
    <div className='NavigationBarLayout'>
      <NavigationBar />
      <div className={clsx(props.centered === true && 'w-full max-w-3xl my-5 mx-auto')}>
        {props.children}
      </div>
    </div>
  )
}
