import './ScoreRow.css'
import { ReactElement } from 'react'
import { selectMembers } from '../../store/entities/members'
import { useEntityById } from '../../hooks/use-entity-by-id'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon'

interface Props {
  memberId: string
  relativeScore: number
  lowestScore: number
}

export default function ScoreRow (props: Props): ReactElement {
  const member = useEntityById(selectMembers, props.memberId)

  if (!Number.isFinite(props.relativeScore) && props.relativeScore < 0) {
    return (
      <div className='ScoreRow'>
        <div className='ScoreRow-name'>{member?.name}</div>
        <div className='ScoreRow-x'>
          <Icon icon={faTimes} />
        </div>
      </div>
    )
  }

  const badness = props.lowestScore !== 0
    ? Math.abs(props.relativeScore / props.lowestScore)
    : 0

  return (
    <div className='ScoreRow'>
      <div className='ScoreRow-name'>{member?.name}</div>
      <div className='ScoreRow-bar'>
        <span className='ScoreRow-bar-inner' style={{ width: (badness * 100).toFixed(0) + '%' }}>
          {props.relativeScore}
        </span>
      </div>
    </div>
  )
}
