import { ReactElement, useCallback, useState } from 'react'
import BasicButton from '../forms/BasicButton'
import { useParametrized } from '../../hooks/use-parametrized'
import Modal from '../modals/Modal'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon'
import { useTranslation } from 'react-i18next'

interface Props {
  onDelete: () => void
  itemDescriptor?: string
}

export default function DeleteButton (props: Props): ReactElement {
  const { t } = useTranslation()

  const { onDelete } = props
  const handleDelete = useCallback(() => onDelete(), [onDelete])

  const [modalOpen, setModalOpen] = useState(false)
  const showModal = useParametrized(setModalOpen, true)
  const hideModal = useParametrized(setModalOpen, false)

  return (
    <>
      <BasicButton warn onClick={showModal}>
        {t('basicActions.delete')}
      </BasicButton>
      <Modal active={modalOpen}>
        <div className='max-w-[15rem] mb-6 text-xl center'>
          {t('deleteConfirm')}
        </div>
        {props.itemDescriptor != null && (
          <div className='max-w-[15rem] mb-8 p-2 bg-gray-200 rounded-sm text-center font-bold break-words'>
            {props.itemDescriptor}
          </div>
        )}
        <BasicButton warn onClick={handleDelete}>
          <Icon icon={faCheck} className='mr-4' />
          {t('basicActions.delete')}
        </BasicButton>
        <BasicButton onClick={hideModal}>
          <Icon icon={faTimes} className='mr-4' />
          {t('basicActions.cancel')}
        </BasicButton>
      </Modal>
    </>
  )
}
