import { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import EditModal from '../modals/EditModal'
import FormRow from '../forms/FormRow'
import { useParametrized } from '../../util/use-parametrized'
import { PeriodicChore } from '../../store/entities/periodic-chores'
import { usePeriodicChoreEditor } from '../../editors/use-periodic-chore-editor'

interface Props {
  active: boolean
  chore?: PeriodicChore
  onSave: (entity: PeriodicChore) => void
  onCancel: () => void
}

export default function EditPeriodicChoreModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const editor = usePeriodicChoreEditor(props.chore)
  // reset editor when modal closes/opens
  useEffect(() => editor.reset(), [editor, props.active])

  const save = useParametrized(props.onSave, editor.value)

  return (
    <EditModal title={props.chore != null ? t('periodic.edit') : t('periodic.create')}
               active={props.active}
               isValid={editor.isValid}
               onSave={save}
               onCancel={props.onCancel}>
      <FormRow label={t('periodic.fields.name')}>
        <TextField
          value={editor.value.name}
          onChange={({ target }) => editor.update({ name: target.value })}
        />
      </FormRow>
      <FormRow label={t('periodic.fields.period')}>
        <TextField
          numeric
          value={editor.value.period}
          onChange={({ target }) => editor.update({ period: target.valueAsNumber })}
        />
      </FormRow>
    </EditModal>
  )
}
