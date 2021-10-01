import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import EditModal from '../modals/EditModal'
import { Scoreboard } from '../../store/entities/scoreboards'
import FormRow from '../forms/FormRow'

interface Props {
  active: boolean
  scoreboard?: Scoreboard
  onSave: (entity: Scoreboard) => void
  onCancel: () => void
}

export default function EditScoreboardModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const [name, setName] = useState('')

  useEffect(() => {
    setName(props.scoreboard?.name ?? '')
  }, [props.scoreboard])

  const isValid = useMemo(() => {
    return name.trim().length > 0
  }, [name])

  const { onSave } = props
  const save = useCallback(() => {
    if (isValid) {
      onSave({
        _id: props.scoreboard?._id ?? '',
        name,
        scores: props.scoreboard?.scores ?? []
      })
    }
  }, [onSave, props.scoreboard, isValid, name])

  return (
    <EditModal title={props.scoreboard != null ? t('scoreboards.edit') : t('scoreboards.create')}
               active={props.active}
               isValid={isValid}
               onSave={save}
               onCancel={props.onCancel}>
      <FormRow label={t('scoreboards.fields.name')}>
        <TextField
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </FormRow>
    </EditModal>
  )
}
