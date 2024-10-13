import { ReactElement, useCallback, useMemo } from 'react'
import { useAppSelector } from '../../store/store'
import { Member, selectMembers } from '../../store/entities/members'
import { EditModalRenderFn } from '../items/EditButton'
import { api } from '../../api/api'
import EditMemberModal from './EditMemberModal'
import { useTranslation } from 'react-i18next'
import Section from '../Section'
import { faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import Empty from '../Empty'
import MemberItem from './MemberItem'

export default function MembersSection (): ReactElement {
  const { t } = useTranslation()

  const members = useAppSelector(selectMembers)
  const activeMembers = useMemo(() => members.filter((item) => item.active), [members])
  const inactiveMembers = useMemo(() => members.filter((item) => !item.active), [members])

  const renderCreateModal: EditModalRenderFn = useCallback((active, hide) => {
    const create = (entity: Member): void => {
      hide()
      void api.members.create(entity)
    }
    return <EditMemberModal active={active} onSave={create} onCancel={hide} />
  }, [])

  return (
    <>
      <Section icon={faUser} title={t('members.active')} renderCreateModal={renderCreateModal}>
        {activeMembers.length === 0 && <Empty message={t('members.empty')} />}
        {activeMembers.map((member) => <MemberItem key={member._id} member={member} />)}
      </Section>
      {inactiveMembers.length > 0
        ? (<Section icon={faUserSlash} title={t('members.former')}>
          {inactiveMembers.map((member) => <MemberItem key={member._id} member={member} />)}
        </Section>)
        : undefined}
    </>
  )
}
