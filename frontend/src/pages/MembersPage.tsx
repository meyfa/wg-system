import { ReactElement } from 'react'
import { useAppSelector } from '../store/store'
import { selectMembers } from '../store/entities/members'

export default function MembersPage (): ReactElement {
  const members = useAppSelector(selectMembers)

  return (
    <div>
      <h1>Members</h1>
      {members.map(member => (
        <div key={member._id}>{member.name}</div>
      ))}
    </div>
  )
}
