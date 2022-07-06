import { ReactElement, useCallback } from 'react'
import api from '../../api/api'
import EditPeriodicChoreModal from './EditPeriodicChoreModal'
import EditableItem from '../items/EditableItem'
import { PeriodicChore } from '../../store/entities/periodic-chores'
import { EditModalRenderFn } from '../items/EditButton'
import ItemTag from '../items/ItemTag'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

interface Props {
  chore: PeriodicChore
}

export default function PeriodicChoreItem (props: Props): ReactElement {
  const { t } = useTranslation()

  const onDelete = useCallback(() => {
    void api.periodicChores.delete(props.chore._id)
  }, [props.chore._id])

  const renderModal: EditModalRenderFn = useCallback((active, hide) => {
    const save = (entity: PeriodicChore): void => {
      hide()
      void api.periodicChores.update(entity)
    }
    return <EditPeriodicChoreModal chore={props.chore} active={active} onSave={save} onCancel={hide} onDelete={onDelete} />
  }, [props.chore, onDelete])

  return (
    <EditableItem renderModal={renderModal}>
      {props.chore.name}
      <ItemTag icon={faClock} text={t('periodic.everyNDays', { count: props.chore.period })} />
      {props.chore.groups.map((id, i) => <ItemTag.Group key={i} id={id} />)}
    </EditableItem>
  )
}
