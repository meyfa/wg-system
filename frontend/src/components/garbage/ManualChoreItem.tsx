import './ManualChoreItem.css'
import { ManualChore } from '../../store/entities/manual-chores'
import { ReactElement, useCallback, useState } from 'react'
import BasicButton from '../forms/BasicButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import api from '../../api/api'
import EditManualChoreModal from './EditManualChoreModal'

interface Props {
  chore: ManualChore
}

export default function ManualChoreItem (props: Props): ReactElement {
  const { t } = useTranslation()

  const [editing, setEditing] = useState(false)

  const showEditModal = useCallback(() => setEditing(true), [])
  const hideEditModal = useCallback(() => setEditing(false), [])

  const save = useCallback(async (entity: ManualChore) => {
    await api.manualChores.update(entity)
    setEditing(false)
  }, [])

  return (
    <div className='ManualChoreItem'>
      <div className='ManualChoreItem-name'>
        {props.chore.name}
      </div>
      <div className='ManualChoreItem-actions'>
        <BasicButton onClick={showEditModal}>
          <FontAwesomeIcon icon={faEdit} />
          {t('basicActions.edit')}
        </BasicButton>
      </div>
      <EditManualChoreModal chore={props.chore} active={editing} onSave={save} onCancel={hideEditModal} />
    </div>
  )
}
