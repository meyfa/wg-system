import './Empty.css'

export interface Props {
  message: string
}

export default function Empty (props: Props): JSX.Element {
  return (
    <div className='Empty'>{props.message}</div>
  )
}
