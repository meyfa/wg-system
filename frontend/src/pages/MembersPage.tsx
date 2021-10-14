import { ReactElement, useCallback, useMemo, useState } from 'react'
import { useAppSelector } from '../store/store'
import { Member, selectMembers } from '../store/entities/members'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import BasicButton from '../components/forms/BasicButton'
import { faPlus, faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MemberItem from '../components/members/MemberItem'
import EditMemberModal from '../components/members/EditMemberModal'
import api from '../api/api'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import Empty from '../components/Empty'

export default function MembersPage (): ReactElement {
  const { t } = useTranslation()

  const members = useAppSelector(selectMembers)
  const activeMembers = useMemo(() => members.filter(item => item.active), [members])
  const inactiveMembers = useMemo(() => members.filter(item => !item.active), [members])

  const [creating, setCreating] = useState(false)

  const showCreateModal = useCallback(() => setCreating(true), [])
  const hideCreateModal = useCallback(() => setCreating(false), [])

  const create = useCallback(async (entity: Member) => {
    await api.members.create(entity)
    setCreating(false)
  }, [])

  return (
    <NavigationBarLayout centered>
      <Title title={t('members.title')}>
        <BasicButton onClick={showCreateModal}>
          <FontAwesomeIcon icon={faPlus} />
          {t('basicActions.add')}
        </BasicButton>
      </Title>
      <EditMemberModal active={creating} onSave={create} onCancel={hideCreateModal} />
      <Title minor icon={faUser} title={t('members.active')} />
      {activeMembers.length === 0 ? <Empty message={t('members.empty')} /> : undefined}
      {activeMembers.map(member => <MemberItem key={member._id} member={member} />)}
      {inactiveMembers.length > 0
        ? (<>
          <Title minor icon={faUserSlash} title={t('members.former')} />
          {inactiveMembers.map(member => <MemberItem key={member._id} member={member} />)}
        </>)
        : undefined}
    </NavigationBarLayout>
  )
}
