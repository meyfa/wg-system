import { ReactElement, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import { ManualChore } from '../../store/entities/manual-chores'
import EditModal from '../modals/EditModal'
import { useAppSelector } from '../../store/store'
import { Scoreboard, selectScoreboards } from '../../store/entities/scoreboards'
import BasicDropdown from '../forms/BasicDropdown'
import FormRow from '../forms/FormRow'
import { useEntityById } from '../../hooks/use-entity-by-id'
import { useManualChoreEditor } from '../../editors/use-manual-chore-editor'
import { useParametrized } from '../../hooks/use-parametrized'

function useScoreboardFormatter (): (item: Scoreboard | undefined) => string {
  const { t } = useTranslation()
  return (item) => item == null ? t('noneOption') : item.name
}

interface Props {
  active: boolean
  chore?: ManualChore
  onSave: (entity: ManualChore) => void
  onCancel: () => void
  onDelete?: () => void
}

export default function EditManualChoreModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const scoreboards = useAppSelector(selectScoreboards)

  const editor = useManualChoreEditor(props.chore)
  // reset editor when modal closes/opens
  useEffect(() => editor.reset(), [editor, props.active])

  const save = useParametrized(props.onSave, editor.value)

  const doDelete = useMemo(() => {
    return props.onDelete != null && props.chore != null ? props.onDelete : undefined
  }, [props.onDelete, props.chore])

  const scoreboardOptions = useMemo(() => [undefined, ...scoreboards], [scoreboards])
  const scoreboardFormatter = useScoreboardFormatter()
  const scoreboardValue = useEntityById(selectScoreboards, editor.value.scoreboardId)

  return (
    <EditModal
      title={props.chore != null ? t('manual.edit') : t('manual.create')}
      active={props.active}
      isValid={editor.isValid}
      itemDescriptor={props.chore?.name}
      onSave={save}
      onCancel={props.onCancel}
      onDelete={doDelete}
    >
      <FormRow label={t('manual.fields.name')}>
        <TextField
          value={editor.value.name}
          onChange={({ target }) => editor.update({ name: target.value })}
        />
      </FormRow>
      <FormRow label={t('manual.fields.scoreboard')}>
        <BasicDropdown
          options={scoreboardOptions}
          formatter={scoreboardFormatter}
          value={scoreboardValue}
          onSelect={(option) => editor.update({ scoreboardId: option?._id ?? null })}
        />
      </FormRow>
    </EditModal>
  )
}
