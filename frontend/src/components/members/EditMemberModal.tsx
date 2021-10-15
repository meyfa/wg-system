import { ReactElement, useEffect, useMemo } from 'react'
import { Member } from '../../store/entities/members'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import EditModal from '../modals/EditModal'
import FormRow from '../forms/FormRow'
import ColorPicker from './ColorPicker'
import { useMemberEditor } from '../../editors/use-member-editor'
import { useParametrized } from '../../util/use-parametrized'
import BasicCheckbox from '../forms/BasicCheckbox'
import BasicDropdown from '../forms/BasicDropdown'
import { useAppSelector } from '../../store/store'
import { Group, selectGroups } from '../../store/entities/groups'

function useGroupFormatter (): (item: Group | undefined) => string {
  const { t } = useTranslation()
  return item => item == null ? t('noneOption') : item.name
}

interface Props {
  active: boolean
  member?: Member
  onSave: (entity: Member) => void
  onCancel: () => void
  onDelete?: () => void
}

export default function EditMemberModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const groups = useAppSelector(selectGroups)

  const editor = useMemberEditor(props.member)
  // reset editor when modal closes/opens
  useEffect(() => editor.reset(), [editor, props.active])

  const save = useParametrized(props.onSave, editor.value)

  const doDelete = useMemo(() => {
    return props.onDelete != null && props.member != null ? props.onDelete : undefined
  }, [props.onDelete, props.member])

  const groupOptions = useMemo(() => [undefined, ...groups], [groups])
  const groupFormatter = useGroupFormatter()
  const groupValue = useMemo(() => {
    return editor.value.groups.length !== 0
      ? groups.find(item => item._id === editor.value.groups[0])
      : undefined
  }, [groups, editor.value.groups])

  return (
    <EditModal title={props.member != null ? t('members.edit') : t('members.create')}
               active={props.active}
               isValid={editor.isValid}
               onSave={save}
               onCancel={props.onCancel}
               onDelete={doDelete}>
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
      <FormRow label={t('members.fields.group')}>
        <BasicDropdown
          options={groupOptions}
          formatter={groupFormatter}
          value={groupValue}
          onSelect={group => editor.update({ groups: group != null ? [group._id] : [] })}
        />
      </FormRow>
      <FormRow label={t('members.fields.active')}>
        <BasicCheckbox
          checked={editor.value.active}
          onChange={({ target }) => editor.update({ active: target.checked })}
        />
      </FormRow>
    </EditModal>
  )
}
