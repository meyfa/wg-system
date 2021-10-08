import './EditableItem.css'
import { CSSProperties, PropsWithChildren, ReactElement } from 'react'
import clsx from 'clsx'
import BasicButton from '../forms/BasicButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

interface Props {
  className?: string
  style?: CSSProperties
  itemName: string
  onClickEdit: () => void
}

export default function EditableItem (props: PropsWithChildren<Props>): ReactElement {
  const { t } = useTranslation()

  return (
    <div className={clsx('EditableItem', props.className)} style={props.style}>
      <div className='EditableItem-name'>
        {props.itemName}
      </div>
      <div className='EditableItem-actions'>
        <BasicButton onClick={props.onClickEdit}>
          <FontAwesomeIcon icon={faEdit} />
          {t('basicActions.edit')}
        </BasicButton>
      </div>
      {props.children}
    </div>
  )
}
