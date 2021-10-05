import './ScoreRow.css'
import { ReactElement } from 'react'
import { selectMembers } from '../../store/entities/members'
import { useEntityById } from '../../util/use-entity-by-id'

interface Props {
  memberId: string
  relativeScore: number
  lowestScore: number
}

export default function ScoreRow (props: Props): ReactElement {
  const member = useEntityById(selectMembers, props.memberId)

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
