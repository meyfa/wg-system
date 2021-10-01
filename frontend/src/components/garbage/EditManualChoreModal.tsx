import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import { ManualChore } from '../../store/entities/manual-chores'
import EditModal from '../modals/EditModal'
import { useAppSelector } from '../../store/store'
import { Scoreboard, selectScoreboards } from '../../store/entities/scoreboards'
import BasicDropdown from '../forms/BasicDropdown'
import FormRow from '../forms/FormRow'

function useScoreboardFormatter (): (item: Scoreboard | null) => string {
  const { t } = useTranslation()
  return item => item == null ? t('noneOption') : item.name
}

interface Props {
  active: boolean
  chore?: ManualChore
  onSave: (entity: ManualChore) => void
  onCancel: () => void
}

export default function EditManualChoreModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const scoreboards = useAppSelector(selectScoreboards)

  const [name, setName] = useState('')
  const [dueSince, setDueSince] = useState(0)
  const [scoreboardId, setScoreboardId] = useState<string | null>(null)

  useEffect(() => {
    setName(props.chore?.name ?? '')
    setDueSince(props.chore?.dueSince ?? 0)
    setScoreboardId(props.chore?.scoreboardId ?? null)
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
        dueSince,
        scoreboardId
      })
    }
  }, [onSave, props.chore, isValid, name, dueSince, scoreboardId])

  const scoreboardOptions = useMemo(() => [null, ...scoreboards], [scoreboards])
  const scoreboardFormatter = useScoreboardFormatter()
  const scoreboardValue = useMemo(() => {
    return scoreboardId == null
      ? null
      : scoreboards.find(item => item._id === scoreboardId) ?? null
  }, [scoreboards, scoreboardId])

  return (
    <EditModal title={props.chore != null ? t('garbage.edit') : t('garbage.create')}
               active={props.active}
               isValid={isValid}
               onSave={save}
               onCancel={props.onCancel}>
      <FormRow label={t('garbage.fields.name')}>
        <TextField
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </FormRow>
      <FormRow label={t('garbage.fields.scoreboard')}>
        <BasicDropdown
          options={scoreboardOptions}
          formatter={scoreboardFormatter}
          value={scoreboardValue}
          onSelect={option => setScoreboardId(option?._id ?? null)}
        />
      </FormRow>
    </EditModal>
  )
}
