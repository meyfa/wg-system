import { ReactElement, useState } from 'react'
import Icon from '../Icon'
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import BasicButton from '../forms/BasicButton'
import { useParametrized } from '../../hooks/use-parametrized'
import { useTranslation } from 'react-i18next'

export type EditModalRenderFn = (active: boolean, hide: () => void) => ReactElement

interface Props {
  create?: boolean
  renderModal: EditModalRenderFn
}

export default function EditButton (props: Props): ReactElement {
  const { t } = useTranslation()

  const isCreate = props.create === true

  const [active, setActive] = useState(false)

  const showModal = useParametrized(setActive, true)
  const hideModal = useParametrized(setActive, false)

  return (
    <>
      <BasicButton onClick={showModal}>
        <Icon icon={isCreate ? faPlus : faEdit} className='mr-0 sm:mr-4' />
        <span className='hidden sm:inline'>
          {t(isCreate ? 'basicActions.add' : 'basicActions.edit')}
        </span>
      </BasicButton>
      {props.renderModal(active, hideModal)}
    </>
  )
}
