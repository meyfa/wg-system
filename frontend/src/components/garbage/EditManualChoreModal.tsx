import './EditManualChoreModal.css'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import Modal from '../modals/Modal'
import BasicButton from '../forms/BasicButton'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ManualChore } from '../../store/entities/manual-chores'

interface Props {
  active: boolean
  chore?: ManualChore
  onSave: (entity: ManualChore) => void
  onCancel: () => void
}

export default function EditManualChoreModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [dueSince, setDueSince] = useState(0)

  useEffect(() => {
    setName(props.chore?.name ?? '')
    setDueSince(props.chore?.dueSince ?? 0)
  }, [props.chore])

  const isValid = useMemo(() => {
    return name.trim().length > 0
  }, [name])

  const { onSave } = props
  const save = useCallback(() => {
    if (isValid) {
      onSave({
        _id: props.chore?._id ?? '',
        name,
        dueSince
      })
    }
  }, [onSave, props.chore, isValid, name, dueSince])

  return (
    <Modal active={props.active}>
      <div className='EditManualChoreModal-title'>
        <FontAwesomeIcon icon={faEdit} />
        {props.chore != null ? t('garbage.edit') : t('garbage.create')}
      </div>
      <TextField
        value={name}
        placeholder={t('garbage.fields.name')}
        onChange={({ target }) => setName(target.value)}
      />
      <div className='EditManualChoreModal-actions'>
        <BasicButton onClick={save} disabled={!isValid}>
          {t('basicActions.save')}
        </BasicButton>
        <BasicButton onClick={props.onCancel}>
          {t('basicActions.cancel')}
        </BasicButton>
      </div>
    </Modal>
  )
}
