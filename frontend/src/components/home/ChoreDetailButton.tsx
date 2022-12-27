import { MouseEventHandler, ReactElement } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '../Icon'

type Props = { icon: IconDefinition, minor?: boolean } & (
  | { link: string }
  | { onClick: MouseEventHandler }
)

export default function ChoreDetailButton (props: Props): ReactElement {
  const className = clsx(
    'inline-block ml-3 h-6 px-1 rounded-sm cursor-pointer',
    'opacity-70 hocus:opacity-100 hocus:outline outline-2 outline-gray-400 outline-offset-2'
  )
  const icon = <Icon icon={props.icon} className={props.minor === true ? 'text-lg' : 'text-2xl'} />
  if ('link' in props) {
    return <Link to={props.link} className={className}>{icon}</Link>
  }
  return <button onClick={props.onClick} className={className}>{icon}</button>
}
