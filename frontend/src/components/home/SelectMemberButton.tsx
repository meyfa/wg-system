import './SelectMemberButton.css'
import { ReactElement } from 'react'
import { Member } from '../../store/entities/members'
import { useParametrized } from '../../util/use-parametrized'

interface Props {
  member: Member
  onSelect: (member: Member) => void
}

export default function SelectMemberButton (props: Props): ReactElement {
  const handleClick = useParametrized(props.onSelect, props.member)

  return (
    <button type='button' className='SelectMemberButton' onClick={handleClick}>
      {props.member.name}
    </button>
  )
}
