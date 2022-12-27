import { ReactElement } from 'react'
import clsx from 'clsx'
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon'

function UrgencyIndicatorCirclePath (props: {
  stroke: string
  size: number
  strokeWidth: number
  fraction: number
}): ReactElement {
  const { size, strokeWidth, stroke, fraction } = props
  const inset = Math.ceil(strokeWidth / 2)
  const radius = size / 2 - inset
  const arcLength = Math.PI * 2 * radius

  /*
   * We draw a circle by moving to the top-center position, then drawing a half-circle to the bottom-center position,
   * then another half-circle back to the top-center position.
   *
   * This circle has a stroke-dasharray that is 100% color followed by 100% transparency.
   * By shifting the dash (via stroke-dashoffset), we can emulate a circular arc.
   */

  return (
    <path
      d={`M${size / 2},${inset} a${radius},${radius} 0 1 0 0,${radius * 2} a${radius},${radius} 0 1 0 0,${-radius * 2} z`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={`${arcLength} ${arcLength}`}
      strokeDashoffset={Math.max(0, Math.min(1, 1 - fraction)) * arcLength}
      fill='none'
    />
  )
}

interface Props {
  urgency: number | boolean
}

export default function UrgencyIndicator (props: Props): ReactElement {
  // show as simple good/bad indicator
  if (typeof props.urgency === 'boolean') {
    return (
      <Icon
        className={clsx('mr-2 text-2xl', props.urgency ? 'text-red-400' : 'text-emerald-400')}
        icon={props.urgency ? faExclamationTriangle : faCheckCircle}
      />
    )
  }

  const size = 100
  const strokeWidth = 25

  // show as green arc on top of red background
  // (higher urgency value means reduced size of green arc, revealing more of the red background)
  return (
    <svg className='mr-2 inline-block w-7 relative -top-0.5 align-middle' viewBox={`0 0 ${size} ${size}`}>
      <UrgencyIndicatorCirclePath stroke='#f05353' size={size} strokeWidth={strokeWidth} fraction={1} />
      <UrgencyIndicatorCirclePath stroke='#61Cd7d' size={size} strokeWidth={strokeWidth} fraction={1 - props.urgency} />
    </svg>
  )
}
