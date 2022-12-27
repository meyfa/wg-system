import { ReactElement, useCallback } from 'react'
import { Member } from '../../store/entities/members'
import EditMemberModal from './EditMemberModal'
import { api } from '../../api/api'
import EditableItem from '../items/EditableItem'
import { EditModalRenderFn } from '../items/EditButton'
import ItemTag from '../items/ItemTag'

interface Props {
  member: Member
}

export default function MemberItem (props: Props): ReactElement {
  const onDelete = useCallback(() => {
    void api.members.delete(props.member._id)
  }, [props.member._id])

  const renderModal: EditModalRenderFn = useCallback((active, hide) => {
    const save = (entity: Member): void => {
      hide()
      void api.members.update(entity)
    }
    return <EditMemberModal member={props.member} active={active} onSave={save} onCancel={hide} onDelete={onDelete} />
  }, [props.member, onDelete])

  return (
    <EditableItem renderModal={renderModal}>
      <span
        className='inline-block w-8 h-8 mr-4 rounded align-middle'
        style={{ background: props.member.active ? props.member.color : '#d0d0d0' }}
      />
      <span className={props.member.active ? '' : 'text-gray-400'}>
        {props.member.name}
      </span>
      {props.member.groups.map((id, i) => <ItemTag.Group key={i} id={id} />)}
    </EditableItem>
  )
}
