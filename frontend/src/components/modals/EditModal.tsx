import { PropsWithChildren, ReactElement } from 'react'
import Modal from '../modals/Modal'
import BasicButton from '../forms/BasicButton'
import { useTranslation } from 'react-i18next'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon'
import DeleteButton from '../items/DeleteButton'

interface Props {
  active: boolean
  title: string
  isValid: boolean
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
  itemDescriptor?: string
}

export default function EditModal (props: PropsWithChildren<Props>): ReactElement {
  const { t } = useTranslation()

  return (
    <Modal active={props.active}>
      {/* title */}
      <div className='font-bold'>
        <Icon icon={faEdit} className='mr-3' />
        {props.title}
      </div>
      {/* content */}
      <div className='my-4 py-4 border-y-2 border-y-gray-300'>
        {props.children}
      </div>
      {/* buttons */}
      <div className='flex justify-center'>
        {props.onDelete != null && (
          <div className='grow mr-8'>
            <DeleteButton onDelete={props.onDelete} itemDescriptor={props.itemDescriptor} />
          </div>
        )}
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
