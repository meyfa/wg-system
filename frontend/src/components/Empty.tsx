import { ReactElement } from 'react'

interface Props {
  message: string
}

export default function Empty (props: Props): ReactElement {
  return (
    <div className='my-6 py-12 px-6 text-center text-2xl font-light text-gray-600 bg-white/25 rounded-sm shadow-lg'>
      {props.message}
    </div>
  )
}
