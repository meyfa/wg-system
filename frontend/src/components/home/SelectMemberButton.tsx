import { CSSProperties, ReactElement, useMemo } from 'react'
import { Member } from '../../store/entities/members'
import { useParametrized } from '../../hooks/use-parametrized'

interface Props {
  member: Member
  onSelect: (member: Member) => void
}

export default function SelectMemberButton (props: Props): ReactElement {
  const handleClick = useParametrized(props.onSelect, props.member)

  const style = useMemo<CSSProperties>(() => ({ borderColor: props.member.color }), [props.member.color])

  return (
    <button
      type='button'
      className='min-w-[7.5rem] py-6 px-3 text-xl bg-white border-[0.375rem] border-gray-400 rounded-md cursor-pointer hocus:shadow-lg'
      style={style}
      onClick={handleClick}
    >
      {props.member.name}
    </button>
  )
}
