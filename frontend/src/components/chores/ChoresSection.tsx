import { PropsWithChildren, ReactElement, useCallback, useState } from 'react'
import Title from '../Title'
import BasicButton from '../forms/BasicButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

export type CreateModalRenderFn = (active: boolean, hide: () => void) => ReactElement

interface Props {
  title: string
  renderCreateModal: CreateModalRenderFn
}

export default function ChoresSection (props: PropsWithChildren<Props>): ReactElement {
  const { t } = useTranslation()

  const [creating, setCreating] = useState(false)
  const showCreateModal = useCallback(() => setCreating(true), [])
  const hideCreateModal = useCallback(() => setCreating(false), [])

  return (
    <>
      <Title minor title={props.title}>
        <BasicButton onClick={showCreateModal}>
          <FontAwesomeIcon icon={faPlus} />
          {t('basicActions.add')}
        </BasicButton>
      </Title>
      {props.renderCreateModal(creating, hideCreateModal)}
      {props.children}
    </>
  )
}
