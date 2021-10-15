import './MemberItem.css'
import { ReactElement, useCallback } from 'react'
import api from '../../api/api'
import EditableItem from '../items/EditableItem'
import { EditModalRenderFn } from '../items/EditButton'
import { Group } from '../../store/entities/groups'
import EditGroupModal from './EditGroupModal'

interface Props {
  group: Group
}

export default function GroupItem (props: Props): ReactElement {
  const onDelete = useCallback(async () => await api.groups.delete(props.group._id), [props.group._id])

  const renderModal: EditModalRenderFn = useCallback((active, hide) => {
    const save = async (entity: Group): Promise<void> => {
      hide()
      await api.groups.update(entity)
    }
    return <EditGroupModal group={props.group} active={active} onSave={save} onCancel={hide} onDelete={onDelete} />
  }, [props.group, onDelete])

  return (
    <EditableItem renderModal={renderModal}>
      {props.group.name}
    </EditableItem>
  )
}
