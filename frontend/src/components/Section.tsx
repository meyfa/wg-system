import { PropsWithChildren, ReactElement, useCallback, useState } from 'react'
import Title from './Title'
import BasicButton from './forms/BasicButton'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import Icon from './Icon'

export type CreateModalRenderFn = (active: boolean, hide: () => void) => ReactElement

interface Props {
  icon?: IconDefinition
  title: string
  renderCreateModal?: CreateModalRenderFn
}

export default function Section (props: PropsWithChildren<Props>): ReactElement {
  const { t } = useTranslation()

  const [creating, setCreating] = useState(false)
  const showCreateModal = useCallback(() => setCreating(true), [])
  const hideCreateModal = useCallback(() => setCreating(false), [])

  return (
    <>
      <Title minor title={props.title} icon={props.icon}>
        {props.renderCreateModal != null
          ? (<BasicButton onClick={showCreateModal}>
            <Icon icon={faPlus} /> {t('basicActions.add')}
          </BasicButton>)
          : undefined}
      </Title>
      {props.renderCreateModal != null ? props.renderCreateModal(creating, hideCreateModal) : undefined}
      {props.children}
    </>
  )
}
