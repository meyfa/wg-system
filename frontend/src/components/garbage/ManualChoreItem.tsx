import { ManualChore } from '../../store/entities/manual-chores'
import { ReactElement, useCallback, useState } from 'react'
import api from '../../api/api'
import EditManualChoreModal from './EditManualChoreModal'
import EditableItem from '../items/EditableItem'

interface Props {
  chore: ManualChore
}

export default function ManualChoreItem (props: Props): ReactElement {
  const [editing, setEditing] = useState(false)

  const showEditModal = useCallback(() => setEditing(true), [])
  const hideEditModal = useCallback(() => setEditing(false), [])

  const save = useCallback(async (entity: ManualChore) => {
    setEditing(false)
    await api.manualChores.update(entity)
  }, [])

  return (
    <EditableItem itemName={props.chore.name} onClickEdit={showEditModal}>
      <EditManualChoreModal chore={props.chore} active={editing} onSave={save} onCancel={hideEditModal} />
    </EditableItem>
  )
}
