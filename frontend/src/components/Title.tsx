import { createElement, PropsWithChildren, ReactElement } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import Icon from './Icon'
import clsx from 'clsx'

interface Props {
  icon?: IconDefinition
  title: string
  minor?: boolean
}

export default function Title (props: PropsWithChildren<Props>): ReactElement {
  const iconElement = props.icon != null
    ? <Icon icon={props.icon} className='mr-4' />
    : undefined

  return (
    <div className='mb-6 sm:mb-8 mt-8 sm:mt-12 first:mt-0 first:sm:mt-0'>
      {/* <h1> or <h2>, depending on props */}
      {createElement(props.minor === true ? 'h2' : 'h1', {
        className: clsx(
          'inline-block mr-5 sm:mr-12 leading-none align-middle',
          props.minor === true ? 'text-xl sm:text-2xl font-semibold' : 'text-2xl sm:text-3xl'
        )
      }, iconElement, props.title)}
      {props.children}
    </div>
  )
}
