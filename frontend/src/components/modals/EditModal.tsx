import './EditModal.css'
import { PropsWithChildren, ReactElement } from 'react'
import Modal from '../modals/Modal'
import BasicButton from '../forms/BasicButton'
import { useTranslation } from 'react-i18next'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon'

interface Props {
  active: boolean
  title: string
  isValid: boolean
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
}

export default function EditModal (props: PropsWithChildren<Props>): ReactElement {
  const { t } = useTranslation()

  const deleteButton = props.onDelete != null
    ? (
      <div className='EditModal-delete'>
        <BasicButton warn onClick={props.onDelete} className='EditModal-delete'>
          {t('basicActions.delete')}
        </BasicButton>
      </div>
      )
    : undefined

  return (
    <Modal active={props.active}>
      <div className='EditModal-title'>
        <Icon icon={faEdit} /> {props.title}
      </div>
      {props.children}
      <div className='EditModal-actions'>
        {deleteButton}
        <BasicButton primary onClick={props.onSave} disabled={!props.isValid}>
          {t('basicActions.save')}
        </BasicButton>
        <BasicButton onClick={props.onCancel}>
          {t('basicActions.cancel')}
        </BasicButton>
      </div>
    </Modal>
  )
}
