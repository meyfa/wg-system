import { ReactElement, useCallback } from 'react'
import { faUserTag } from '@fortawesome/free-solid-svg-icons'
import GroupItem from './GroupItem'
import Section from '../Section'
import { useAppSelector } from '../../store/store'
import { Group, selectGroups } from '../../store/entities/groups'
import { EditModalRenderFn } from '../items/EditButton'
import api from '../../api/api'
import EditGroupModal from './EditGroupModal'
import { useTranslation } from 'react-i18next'
import Empty from '../Empty'

export default function GroupsSection (): ReactElement {
  const { t } = useTranslation()

  const groups = useAppSelector(selectGroups)

  const renderCreateModal: EditModalRenderFn = useCallback((active, hide) => {
    const create = (entity: Group): void => {
      hide()
      void api.groups.create(entity)
    }
    return <EditGroupModal active={active} onSave={create} onCancel={hide} />
  }, [])

  return (
    <Section icon={faUserTag} title={t('members.groups')} renderCreateModal={renderCreateModal}>
      {groups.length === 0 && <Empty message={t('groups.empty')} />}
      {groups.map(group => <GroupItem key={group._id} group={group} />)}
    </Section>
  )
}
