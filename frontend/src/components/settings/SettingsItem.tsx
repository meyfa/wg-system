import { PropsWithChildren, ReactElement } from 'react'

interface Props {
  label: string
}

export default function SettingsItem (props: PropsWithChildren<Props>): ReactElement {
  return (
    <div className='flex py-4'>
      <div className='w-[30%] w-min-[10rem] mr-8 leading-loose text-right'>
        {props.label}
      </div>
      <div className='grow'>
        {props.children}
      </div>
    </div>
  )
}
