import './SelectMemberButton.css'
import { ReactElement, useCallback } from 'react'
import { Member } from '../../store/entities/members'

interface Props {
  member: Member
  onSelect: (member: Member) => void
}

export default function SelectMemberButton (props: Props): ReactElement {
  const { onSelect } = props
  const handleClick = useCallback(() => onSelect(props.member), [onSelect, props.member])

  return (
    <button type='button' className='SelectMemberButton' onClick={handleClick}>
      {props.member.name}
    </button>
  )
}
