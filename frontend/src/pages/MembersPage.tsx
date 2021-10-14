import { ReactElement, useCallback, useMemo } from 'react'
import { useAppSelector } from '../store/store'
import { Member, selectMembers } from '../store/entities/members'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import { faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import MemberItem from '../components/members/MemberItem'
import EditMemberModal from '../components/members/EditMemberModal'
import api from '../api/api'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import Empty from '../components/Empty'
import Section from '../components/Section'
import EditButton, { EditModalRenderFn } from '../components/items/EditButton'

export default function MembersPage (): ReactElement {
  const { t } = useTranslation()

  const members = useAppSelector(selectMembers)
  const activeMembers = useMemo(() => members.filter(item => item.active), [members])
  const inactiveMembers = useMemo(() => members.filter(item => !item.active), [members])

  const renderCreateModal: EditModalRenderFn = useCallback((active, hide) => {
    const create = async (entity: Member): Promise<void> => {
      hide()
      await api.members.create(entity)
    }
    return <EditMemberModal active={active} onSave={create} onCancel={hide} />
  }, [])

  return (
    <NavigationBarLayout centered>
      <Title title={t('members.title')}>
        <EditButton create renderModal={renderCreateModal} />
      </Title>
      <Section icon={faUser} title={t('members.active')}>
        {activeMembers.length === 0 ? <Empty message={t('members.empty')} /> : undefined}
        {activeMembers.map(member => <MemberItem key={member._id} member={member} />)}
      </Section>
      {inactiveMembers.length > 0
        ? (<Section icon={faUserSlash} title={t('members.former')}>
          {inactiveMembers.map(member => <MemberItem key={member._id} member={member} />)}
        </Section>)
        : undefined}
    </NavigationBarLayout>
  )
}
