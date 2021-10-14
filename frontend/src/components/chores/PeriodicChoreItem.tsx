import { ReactElement, useCallback } from 'react'
import api from '../../api/api'
import EditPeriodicChoreModal from './EditPeriodicChoreModal'
import EditableItem from '../items/EditableItem'
import { PeriodicChore } from '../../store/entities/periodic-chores'
import { EditModalRenderFn } from '../items/EditButton'

interface Props {
  chore: PeriodicChore
}

export default function PeriodicChoreItem (props: Props): ReactElement {
  const renderModal: EditModalRenderFn = useCallback((active, hide) => {
    const save = async (entity: PeriodicChore): Promise<void> => {
      hide()
      await api.periodicChores.update(entity)
    }
    return <EditPeriodicChoreModal chore={props.chore} active={active} onSave={save} onCancel={hide} />
  }, [props.chore])

  return (
    <EditableItem renderModal={renderModal}>
      {props.chore.name}
    </EditableItem>
  )
}
