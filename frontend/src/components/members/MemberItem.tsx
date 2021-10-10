import './MemberItem.css'
import { ReactElement, useCallback, useState } from 'react'
import { Member } from '../../store/entities/members'
import EditMemberModal from './EditMemberModal'
import api from '../../api/api'
import EditableItem from '../items/EditableItem'
import clsx from 'clsx'

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

  const itemName = (
    <>
      <div className='MemberItem-color' style={{ background: props.member.color }} />
      {props.member.name}
    </>
  )

  return (
    <EditableItem className={clsx('MemberItem', { inactive: !props.member.active })}
                  itemName={itemName}
                  onClickEdit={showEditModal}>
      <EditMemberModal member={props.member} active={editing} onSave={save} onCancel={hideEditModal} />
    </EditableItem>
  )
}
