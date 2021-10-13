import './UrgencyIndicator.css'
import { ReactElement } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import clsx from 'clsx'

interface Props {
  urgency: number
  className?: string
}

export default function UrgencyIndicator (props: Props): ReactElement {
  // show as green arc on top of red background
  // (higher urgency value means reduced size of green arc, revealing more of the red background)
  return (
    <div className={clsx('UrgencyIndicator', props.className)}>
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
