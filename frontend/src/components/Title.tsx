import './Title.css'
import { PropsWithChildren, ReactElement, createElement } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  icon?: IconDefinition
  title: string
  minor?: boolean
}

export default function Title (props: PropsWithChildren<Props>): ReactElement {
  const iconElement = props.icon != null ? <FontAwesomeIcon icon={props.icon} className='Title-icon' /> : undefined

  return (
    <div className='Title'>
      {createElement(props.minor === true ? 'h2' : 'h1', {
        className: 'Title-h'
      }, [
        iconElement,
        props.title
      ])}
      {props.children}
    </div>
  )
}
