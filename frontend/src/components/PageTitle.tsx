import './PageTitle.css'
import { PropsWithChildren, ReactElement } from 'react'

interface PageTitleProps {
  title: string
}

export default function PageTitle (props: PropsWithChildren<PageTitleProps>): ReactElement {
  return (
    <div className='PageTitle'>
      <h1 className='PageTitle-h'>{props.title}</h1>
      {props.children}
    </div>
  )
}
