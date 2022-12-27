import { PropsWithChildren, ReactElement } from 'react'

interface Props {
  label: string
}

export default function FormRow (props: PropsWithChildren<Props>): ReactElement {
  return (
    <div className='mt-3 mb-4 cursor-default'>
      <div className='text-sm mb-1 leading-none font-bold'>
        {props.label}
      </div>
      {props.children}
    </div>
  )
}
