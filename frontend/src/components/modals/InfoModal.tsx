import { ReactElement, useCallback } from 'react'
import DialogModal from './DialogModal'
import BasicButton from '../forms/BasicButton'
import { useTranslation } from 'react-i18next'

interface Props {
  text: string
  active: boolean
  onConfirm: () => void
}

export default function InfoModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const { onConfirm } = props
  const handleClick = useCallback(() => onConfirm(), [onConfirm])

  return (
    <DialogModal text={props.text} active={props.active}>
      <BasicButton primary onClick={handleClick}>
        {t('basicActions.confirm')}
      </BasicButton>
    </DialogModal>
  )
}
