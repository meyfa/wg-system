import './MemberItem.css'
import { CSSProperties, ReactElement, useCallback, useMemo, useState } from 'react'
import { Member } from '../../store/entities/members'
import EditMemberModal from './EditMemberModal'
import api from '../../api/api'
import EditableItem from '../items/EditableItem'

interface Props {
  member: Member
}

export default function MemberItem (props: Props): ReactElement {
  const [editing, setEditing] = useState(false)

  const showEditModal = useCallback(() => setEditing(true), [])
  const hideEditModal = useCallback(() => setEditing(false), [])

  const save = useCallback(async (entity: Member) => {
    await api.members.update(entity)
    setEditing(false)
  }, [])

  const style: CSSProperties = useMemo(() => {
    return {
      borderColor: props.member.color
    }
  }, [props.member.color])

  return (
    <EditableItem className='MemberItem' style={style} itemName={props.member.name} onClickEdit={showEditModal}>
      <EditMemberModal member={props.member} active={editing} onSave={save} onCancel={hideEditModal} />
    </EditableItem>
  )
}
