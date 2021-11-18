import './DeleteButton.css'
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
        <div className='DeleteButton-confirm'>
          {t('deleteConfirm')}
        </div>
        {props.itemDescriptor != null
          ? <div className='DeleteButton-descriptor'>{props.itemDescriptor}</div>
          : undefined}
        <BasicButton warn onClick={handleDelete}>
          <Icon icon={faCheck} /> {t('basicActions.delete')}
        </BasicButton>
        <BasicButton onClick={hideModal}>
          <Icon icon={faTimes} /> {t('basicActions.cancel')}
        </BasicButton>
      </Modal>
    </>
  )
}
