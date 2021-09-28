import './MemberItem.css'
import { ReactElement, useCallback, useState } from 'react'
import { Member } from '../../store/entities/members'
import BasicButton from '../forms/BasicButton'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import EditMemberModal from './EditMemberModal'
import api from '../../api/api'

interface Props {
  member: Member
}

export default function MemberItem (props: Props): ReactElement {
  const { t } = useTranslation()

  const [editing, setEditing] = useState(false)

  const showEditModal = useCallback(() => setEditing(true), [])
  const hideEditModal = useCallback(() => setEditing(false), [])

  const save = useCallback(async (entity: Member) => {
    await api.members.update(entity)
    setEditing(false)
  }, [])

  return (
    <div className='MemberItem'>
      <div className='MemberItem-name'>
        {props.member.name}
      </div>
      <div className='MemberItem-actions'>
        <BasicButton onClick={showEditModal}>
          <FontAwesomeIcon icon={faEdit} />
          {t('basicActions.edit')}
        </BasicButton>
      </div>
      <EditMemberModal member={props.member} active={editing} onSave={save} onCancel={hideEditModal} />
    </div>
  )
}
