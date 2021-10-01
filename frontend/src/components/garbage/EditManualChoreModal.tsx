import './EditManualChoreModal.css'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import { ManualChore } from '../../store/entities/manual-chores'
import EditModal from '../modals/EditModal'

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
    <EditModal title={props.chore != null ? t('garbage.edit') : t('garbage.create')}
               active={props.active}
               isValid={isValid}
               onSave={save}
               onCancel={props.onCancel}>
      <TextField
        value={name}
        placeholder={t('garbage.fields.name')}
        onChange={({ target }) => setName(target.value)}
      />
    </EditModal>
  )
}
