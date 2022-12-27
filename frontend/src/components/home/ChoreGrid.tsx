import { PropsWithChildren, ReactElement } from 'react'

export default function ChoreGrid (props: PropsWithChildren<{}>): ReactElement {
  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] grid-flow-dense items-stretch gap-3'>
      {props.children}
    </div>
  )
}
