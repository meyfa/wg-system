import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Member } from '../../store/entities/members'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import EditModal from '../modals/EditModal'
import FormRow from '../forms/FormRow'
import ColorPicker from './ColorPicker'

interface Props {
  active: boolean
  member?: Member
  onSave: (entity: Member) => void
  onCancel: () => void
}

export default function EditMemberModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [color, setColor] = useState('#000000')

  useEffect(() => {
    setName(props.member?.name ?? '')
    setColor(props.member?.color ?? '#000000')
  }, [props.member])

  const isValid = useMemo(() => {
    return name.trim().length > 0
  }, [name])

  const { onSave } = props
  const save = useCallback(() => {
    if (isValid) {
      onSave({
        _id: props.member?._id ?? '',
        name,
        color
      })
    }
  }, [onSave, props.member, isValid, name, color])

  return (
    <EditModal title={props.member != null ? t('members.edit') : t('members.create')}
               active={props.active}
               isValid={isValid}
               onSave={save}
               onCancel={props.onCancel}>
      <FormRow label={t('members.fields.name')}>
        <TextField
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </FormRow>
      <FormRow label={t('members.fields.color')}>
        <ColorPicker
          value={color}
          onPick={color => setColor(color)}
        />
      </FormRow>
    </EditModal>
  )
}
