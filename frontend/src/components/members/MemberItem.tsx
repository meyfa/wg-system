import './MemberItem.css'
import { ReactElement, useCallback } from 'react'
import { Member } from '../../store/entities/members'
import EditMemberModal from './EditMemberModal'
import api from '../../api/api'
import EditableItem from '../items/EditableItem'
import clsx from 'clsx'
import { EditModalRenderFn } from '../items/EditButton'

interface Props {
  member: Member
}

export default function MemberItem (props: Props): ReactElement {
  const onDelete = useCallback(async () => await api.members.delete(props.member._id), [props.member._id])

  const renderModal: EditModalRenderFn = useCallback((active, hide) => {
    const save = async (entity: Member): Promise<void> => {
      hide()
      await api.members.update(entity)
    }
    return <EditMemberModal member={props.member} active={active} onSave={save} onCancel={hide} onDelete={onDelete} />
  }, [props.member, onDelete])

  return (
    <EditableItem className={clsx('MemberItem', { inactive: !props.member.active })} renderModal={renderModal}>
      <div className='MemberItem-color' style={{ background: props.member.color }} />
      {props.member.name}
    </EditableItem>
  )
}
