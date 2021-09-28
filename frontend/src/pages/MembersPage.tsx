import { ReactElement, useCallback, useState } from 'react'
import { useAppSelector } from '../store/store'
import { Member, selectMembers } from '../store/entities/members'
import { useTranslation } from 'react-i18next'
import PageTitle from '../components/PageTitle'
import BasicButton from '../components/forms/BasicButton'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MemberItem from '../components/members/MemberItem'
import EditMemberModal from '../components/members/EditMemberModal'

export default function MembersPage (): ReactElement {
  const { t } = useTranslation()

  const members = useAppSelector(selectMembers)

  const [creating, setCreating] = useState(false)

  const showCreateModal = useCallback(() => setCreating(true), [])
  const hideCreateModal = useCallback(() => setCreating(false), [])

  const create = useCallback((entity: Member) => {
    // TODO implement
    setCreating(false)
  }, [])

  return (
    <div>
      <PageTitle title={t('members.title')}>
        <BasicButton onClick={showCreateModal}>
          <FontAwesomeIcon icon={faPlus} />
          {t('basicActions.add')}
        </BasicButton>
      </PageTitle>
      <EditMemberModal active={creating} onSave={create} onCancel={hideCreateModal} />
      {members.map(member => (
        <MemberItem key={member._id} member={member} />
      ))}
    </div>
  )
}
