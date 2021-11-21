import './UrgencyIndicator.css'
import { ReactElement } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import clsx from 'clsx'
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon'

interface Props {
  urgency: number | boolean
  className?: string
}

export default function UrgencyIndicator (props: Props): ReactElement {
  // show as simple good/bad indicator
  if (typeof props.urgency === 'boolean') {
    return (
      <Icon
        className={clsx('UrgencyIndicator', 'simple', { good: !props.urgency, bad: props.urgency })}
        icon={props.urgency ? faExclamationTriangle : faCheckCircle}
      />
    )
  }

  // show as green arc on top of red background
  // (higher urgency value means reduced size of green arc, revealing more of the red background)
  return (
    <div className={clsx('UrgencyIndicator', 'circular', props.className)}>
      <CircularProgressbar
        value={1 - props.urgency}
        minValue={0}
        maxValue={1}
        counterClockwise
        strokeWidth={25}
        styles={buildStyles({
          pathColor: '#61Cd7d',
          trailColor: '#f05353',
          strokeLinecap: 'butt'
        })}
      />
    </div>
  )
}
