import './Title.css'
import { createElement, PropsWithChildren, ReactElement } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import Icon from './Icon'

interface Props {
  icon?: IconDefinition
  title: string
  minor?: boolean
}

export default function Title (props: PropsWithChildren<Props>): ReactElement {
  const iconElement = props.icon != null ? <Icon icon={props.icon} className='Title-icon' /> : undefined

  return (
    <div className='Title'>
      {/* <h1> or <h2>, depending on props */}
      {createElement(props.minor === true ? 'h2' : 'h1', {
        className: 'Title-h'
      }, iconElement, props.title)}
      {props.children}
    </div>
  )
}
