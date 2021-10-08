import './SelectMemberButton.css'
import { CSSProperties, ReactElement, useMemo } from 'react'
import { Member } from '../../store/entities/members'
import { useParametrized } from '../../util/use-parametrized'

interface Props {
  member: Member
  onSelect: (member: Member) => void
}

export default function SelectMemberButton (props: Props): ReactElement {
  const handleClick = useParametrized(props.onSelect, props.member)

  const style = useMemo<CSSProperties>(() => ({ borderColor: props.member.color }), [props.member.color])

  return (
    <button type='button' className='SelectMemberButton' style={style} onClick={handleClick}>
      {props.member.name}
    </button>
  )
}
