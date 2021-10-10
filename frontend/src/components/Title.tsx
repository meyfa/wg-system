import './Title.css'
import { PropsWithChildren, ReactElement, createElement } from 'react'

interface Props {
  title: string
  minor?: boolean
}

export default function Title (props: PropsWithChildren<Props>): ReactElement {
  return (
    <div className='Title'>
      {createElement(props.minor === true ? 'h2' : 'h1', {
        className: 'Title-h'
      }, props.title)}
      {props.children}
    </div>
  )
}
