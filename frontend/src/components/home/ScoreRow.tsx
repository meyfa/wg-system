import { ReactElement, useMemo } from 'react'
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

  const content = useMemo(() => {
    if (!Number.isFinite(props.relativeScore) && props.relativeScore < 0) {
      return (
        <div className='w-full sm:w-24 h-5 text-left sm:text-center text-rose-400'>
          <Icon icon={faTimes} />
        </div>
      )
    }

    const badness = props.lowestScore !== 0
      ? Math.abs(props.relativeScore / props.lowestScore)
      : 0

    return (
      <div className='w-full sm:w-24 h-5 bg-[#c0e0d0]'>
        <div className='h-full pl-2 text-sm font-bold bg-orange-400' style={{ width: `${badness * 100}%` }}>
          {props.relativeScore}
        </div>
      </div>
    )
  }, [props.relativeScore, props.lowestScore])

  return (
    <div className='block sm:flex my-1 leading-tight'>
      <div className='grow'>{member?.name}</div>
      {content}
    </div>
  )
}
