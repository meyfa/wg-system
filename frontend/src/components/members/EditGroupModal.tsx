import { ReactElement, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import EditModal from '../modals/EditModal'
import FormRow from '../forms/FormRow'
import { useParametrized } from '../../util/use-parametrized'
import { Group } from '../../store/entities/groups'
import { useGroupEditor } from '../../editors/use-group-editor'

interface Props {
  active: boolean
  group?: Group
  onSave: (entity: Group) => void
  onCancel: () => void
  onDelete?: () => void
}

export default function EditGroupModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const editor = useGroupEditor(props.group)
  // reset editor when modal closes/opens
  useEffect(() => editor.reset(), [editor, props.active])

  const save = useParametrized(props.onSave, editor.value)

  const doDelete = useMemo(() => {
    return props.onDelete != null && props.group != null ? props.onDelete : undefined
  }, [props.onDelete, props.group])

  return (
    <EditModal title={props.group != null ? t('groups.edit') : t('groups.create')}
               active={props.active}
               isValid={editor.isValid}
               onSave={save}
               onCancel={props.onCancel}
               onDelete={doDelete}>
      <FormRow label={t('groups.fields.name')}>
        <TextField
          value={editor.value.name}
          onChange={({ target }) => editor.update({ name: target.value })}
        />
      </FormRow>
    </EditModal>
  )
}
