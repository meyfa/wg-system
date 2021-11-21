import './ChoreDetailButton.css'
import { MouseEventHandler, ReactElement } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../Icon'

interface Props {
  icon: IconDefinition
  minor?: boolean
  link?: string
  onClick?: MouseEventHandler
}

export default function ChoreDetailButton (props: Props): ReactElement {
  const className = clsx('ChoreDetailButton', { minor: props.minor })

  if (props.link != null) {
    return (
      <Link to={props.link} onClick={props.onClick} className={className}>
        <Icon icon={props.icon} />
      </Link>
    )
  }

  return (
    <button onClick={props.onClick} className={className}>
      <Icon icon={props.icon} />
    </button>
  )
}
