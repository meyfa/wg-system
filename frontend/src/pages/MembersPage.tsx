import { ReactElement } from 'react'
import { useAppSelector } from '../store/store'
import { selectMembers } from '../store/entities/members'
import { useTranslation } from 'react-i18next'

export default function MembersPage (): ReactElement {
  const { t } = useTranslation()

  const members = useAppSelector(selectMembers)

  return (
    <div>
      <h1>{t('members.title')}</h1>
      {members.map(member => (
        <div key={member._id}>{member.name}</div>
      ))}
    </div>
  )
}
