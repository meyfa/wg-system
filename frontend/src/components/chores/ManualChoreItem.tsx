import { ManualChore } from '../../store/entities/manual-chores'
import { ReactElement, useCallback } from 'react'
import api from '../../api/api'
import EditManualChoreModal from './EditManualChoreModal'
import EditableItem from '../items/EditableItem'
import { EditModalRenderFn } from '../items/EditButton'
import ItemTag from '../items/ItemTag'

interface Props {
  chore: ManualChore
}

export default function ManualChoreItem (props: Props): ReactElement {
  const onDelete = useCallback(() => {
    void api.manualChores.delete(props.chore._id)
  }, [props.chore._id])

  const renderModal: EditModalRenderFn = useCallback((active, hide) => {
    const save = (entity: ManualChore): void => {
      hide()
      void api.manualChores.update(entity)
    }
    return <EditManualChoreModal chore={props.chore} active={active} onSave={save} onCancel={hide} onDelete={onDelete} />
  }, [props.chore, onDelete])

  return (
    <EditableItem renderModal={renderModal}>
      {props.chore.name}
      <ItemTag.Scoreboard id={props.chore.scoreboardId} />
    </EditableItem>
  )
}
