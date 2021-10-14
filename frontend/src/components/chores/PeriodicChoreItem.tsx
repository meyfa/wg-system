import { ReactElement, useCallback, useState } from 'react'
import api from '../../api/api'
import EditPeriodicChoreModal from './EditPeriodicChoreModal'
import EditableItem from '../items/EditableItem'
import { PeriodicChore } from '../../store/entities/periodic-chores'

interface Props {
  chore: PeriodicChore
}

export default function PeriodicChoreItem (props: Props): ReactElement {
  const [editing, setEditing] = useState(false)

  const showEditModal = useCallback(() => setEditing(true), [])
  const hideEditModal = useCallback(() => setEditing(false), [])

  const save = useCallback(async (entity: PeriodicChore) => {
    setEditing(false)
    await api.periodicChores.update(entity)
  }, [])

  return (
    <EditableItem itemName={props.chore.name} onClickEdit={showEditModal}>
      <EditPeriodicChoreModal chore={props.chore} active={editing} onSave={save} onCancel={hideEditModal} />
    </EditableItem>
  )
}
