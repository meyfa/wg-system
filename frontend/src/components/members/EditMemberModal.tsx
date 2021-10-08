import { ReactElement, useEffect } from 'react'
import { Member } from '../../store/entities/members'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import EditModal from '../modals/EditModal'
import FormRow from '../forms/FormRow'
import ColorPicker from './ColorPicker'
import { useMemberEditor } from '../../editors/use-member-editor'
import { useParametrized } from '../../util/use-parametrized'

interface Props {
  active: boolean
  member?: Member
  onSave: (entity: Member) => void
  onCancel: () => void
}

export default function EditMemberModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const editor = useMemberEditor(props.member)
  // reset editor when modal closes/opens
  useEffect(() => editor.reset(), [editor, props.active])

  const save = useParametrized(props.onSave, editor.value)

  return (
    <EditModal title={props.member != null ? t('members.edit') : t('members.create')}
               active={props.active}
               isValid={editor.isValid}
               onSave={save}
               onCancel={props.onCancel}>
      <FormRow label={t('members.fields.name')}>
        <TextField
          value={editor.value.name}
          onChange={({ target }) => editor.update({ name: target.value })}
        />
      </FormRow>
      <FormRow label={t('members.fields.color')}>
        <ColorPicker
          value={editor.value.color}
          onPick={color => editor.update({ color })}
        />
      </FormRow>
    </EditModal>
  )
}
