import './EditMemberModal.css'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import Modal from '../modals/Modal'
import { Member } from '../../store/entities/members'
import BasicButton from '../forms/BasicButton'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  active: boolean
  member?: Member
  onSave: (entity: Member) => void
  onCancel: () => void
}

export default function EditMemberModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const [name, setName] = useState('')

  useEffect(() => {
    setName(props.member?.name ?? '')
  }, [props.member])

  const isValid = useMemo(() => {
    return name.trim().length > 0
  }, [name])

  const { onSave } = props
  const save = useCallback(() => {
    if (isValid) {
      onSave({
        _id: props.member?._id ?? '',
        name
      })
    }
  }, [onSave, props.member, isValid, name])

  return (
    <Modal active={props.active}>
      <div className='EditMemberModal-title'>
        <FontAwesomeIcon icon={faEdit} />
        {props.member != null ? t('members.edit') : t('members.create')}
      </div>
      <TextField
        value={name}
        placeholder={t('members.fields.name')}
        onChange={({ target }) => setName(target.value)}
      />
      <div className='EditMemberModal-actions'>
        <BasicButton onClick={save} disabled={!isValid}>
          {t('basicActions.save')}
        </BasicButton>
        <BasicButton onClick={props.onCancel}>
          {t('basicActions.cancel')}
        </BasicButton>
      </div>
    </Modal>
  )
}
