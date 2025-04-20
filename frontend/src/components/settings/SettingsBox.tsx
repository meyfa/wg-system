import { PropsWithChildren, ReactElement } from 'react'

export default function SettingsBox (props: PropsWithChildren<{}>): ReactElement {
  return (
    <div className='my-2 px-3 items-center bg-white rounded-sm shadow-lg'>
      {props.children}
    </div>
  )
}
