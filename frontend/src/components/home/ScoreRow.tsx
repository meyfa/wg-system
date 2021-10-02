import './ScoreRow.css'
import { ReactElement, useMemo } from 'react'
import { useAppSelector } from '../../store/store'
import { selectMembers } from '../../store/entities/members'

interface Props {
  memberId: string
  relativeScore: number
  lowestScore: number
}

export default function ScoreRow (props: Props): ReactElement {
  const members = useAppSelector(selectMembers)

  const member = useMemo(() => {
    return members.find(item => item._id === props.memberId)
  }, [members, props.memberId])

  const badness = Math.abs(props.relativeScore / props.lowestScore)

  return (
    <div className='ScoreRow'>
      <div className='ScoreRow-name'>{member?.name}</div>
      <div className='ScoreRow-bar'>
        <span className='ScoreRow-bar-inner' style={{ width: (badness * 100).toFixed(0) + '%' }} />
      </div>
    </div>
  )
}
