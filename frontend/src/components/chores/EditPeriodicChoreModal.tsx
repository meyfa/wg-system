import { ReactElement, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import EditModal from '../modals/EditModal'
import FormRow from '../forms/FormRow'
import { useParametrized } from '../../util/use-parametrized'
import { PeriodicChore } from '../../store/entities/periodic-chores'
import { usePeriodicChoreEditor } from '../../editors/use-periodic-chore-editor'
import { Group, selectGroups } from '../../store/entities/groups'
import { Editor } from '../../editors/use-editor'
import { useAppSelector } from '../../store/store'
import BasicDropdown from '../forms/BasicDropdown'

function useGroupFormatter (): (item: Group | undefined) => string {
  const { t } = useTranslation()
  return item => item == null ? t('noneOption') : item.name
}

function ChoreGroupSelect (props: { editor: Editor<PeriodicChore> }): ReactElement {
  const { editor } = props

  const groups = useAppSelector(selectGroups)

  const groupOptions = useMemo(() => [undefined, ...groups], [groups])
  const groupFormatter = useGroupFormatter()
  const groupValue = useMemo(() => {
    return editor.value.groups.length !== 0
      ? groups.find(item => item._id === editor.value.groups[0])
      : undefined
  }, [groups, editor.value.groups])

  return (
    <BasicDropdown
      options={groupOptions}
      formatter={groupFormatter}
      value={groupValue}
      onSelect={group => editor.update({ groups: group != null ? [group._id] : [] })}
    />
  )
}

interface Props {
  active: boolean
  chore?: PeriodicChore
  onSave: (entity: PeriodicChore) => void
  onCancel: () => void
  onDelete?: () => void
}

export default function EditPeriodicChoreModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const editor = usePeriodicChoreEditor(props.chore)
  // reset editor when modal closes/opens
  useEffect(() => editor.reset(), [editor, props.active])

  const doDelete = useMemo(() => {
    return props.onDelete != null && props.chore != null ? props.onDelete : undefined
  }, [props.onDelete, props.chore])

  const save = useParametrized(props.onSave, editor.value)

  return (
    <EditModal title={props.chore != null ? t('periodic.edit') : t('periodic.create')}
               active={props.active}
               isValid={editor.isValid}
               onSave={save}
               onCancel={props.onCancel}
               onDelete={doDelete}>
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
      <FormRow label={t('periodic.fields.group')}>
        <ChoreGroupSelect editor={editor} />
      </FormRow>
    </EditModal>
  )
}
