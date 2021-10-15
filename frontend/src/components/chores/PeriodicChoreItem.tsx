import { ReactElement, useCallback } from 'react'
import api from '../../api/api'
import EditPeriodicChoreModal from './EditPeriodicChoreModal'
import EditableItem from '../items/EditableItem'
import { PeriodicChore } from '../../store/entities/periodic-chores'
import { EditModalRenderFn } from '../items/EditButton'
import GroupTag from '../items/GroupTag'

interface Props {
  chore: PeriodicChore
}

export default function PeriodicChoreItem (props: Props): ReactElement {
  const onDelete = useCallback(async () => await api.periodicChores.delete(props.chore._id), [props.chore._id])

  const renderModal: EditModalRenderFn = useCallback((active, hide) => {
    const save = async (entity: PeriodicChore): Promise<void> => {
      hide()
      await api.periodicChores.update(entity)
    }
    return <EditPeriodicChoreModal chore={props.chore} active={active} onSave={save} onCancel={hide} onDelete={onDelete} />
  }, [props.chore, onDelete])

  return (
    <EditableItem renderModal={renderModal}>
      {props.chore.name}
      {props.chore.groups.map((id, i) => <GroupTag key={i} id={id} />)}
    </EditableItem>
  )
}
