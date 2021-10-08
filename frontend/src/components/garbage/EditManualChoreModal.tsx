import { ReactElement, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import { ManualChore } from '../../store/entities/manual-chores'
import EditModal from '../modals/EditModal'
import { useAppSelector } from '../../store/store'
import { Scoreboard, selectScoreboards } from '../../store/entities/scoreboards'
import BasicDropdown from '../forms/BasicDropdown'
import FormRow from '../forms/FormRow'
import { useEntityById } from '../../util/use-entity-by-id'
import { useManualChoreEditor } from '../../editors/use-manual-chore-editor'
import { useParametrized } from '../../util/use-parametrized'

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

  const editor = useManualChoreEditor(props.chore)
  // reset editor when modal closes/opens
  useEffect(() => editor.reset(), [editor, props.active])

  const save = useParametrized(props.onSave, editor.value)

  const scoreboardOptions = useMemo(() => [null, ...scoreboards], [scoreboards])
  const scoreboardFormatter = useScoreboardFormatter()
  const scoreboardValue = useEntityById(selectScoreboards, editor.value.scoreboardId)

  return (
    <EditModal title={props.chore != null ? t('garbage.edit') : t('garbage.create')}
               active={props.active}
               isValid={editor.isValid}
               onSave={save}
               onCancel={props.onCancel}>
      <FormRow label={t('garbage.fields.name')}>
        <TextField
          value={editor.value.name}
          onChange={({ target }) => editor.update({ name: target.value })}
        />
      </FormRow>
      <FormRow label={t('garbage.fields.scoreboard')}>
        <BasicDropdown
          options={scoreboardOptions}
          formatter={scoreboardFormatter}
          value={scoreboardValue}
          onSelect={option => editor.update({ scoreboardId: option?._id ?? null })}
        />
      </FormRow>
    </EditModal>
  )
}
