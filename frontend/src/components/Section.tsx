import { PropsWithChildren, ReactElement } from 'react'
import Title from './Title'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import EditButton, { EditModalRenderFn } from './items/EditButton'

interface Props {
  icon?: IconDefinition
  title: string
  renderCreateModal?: EditModalRenderFn
}

export default function Section (props: PropsWithChildren<Props>): ReactElement {
  return (
    <>
      <Title minor title={props.title} icon={props.icon}>
        {props.renderCreateModal != null
          ? (<EditButton create renderModal={props.renderCreateModal} />)
          : undefined}
      </Title>
      {props.children}
    </>
  )
}
