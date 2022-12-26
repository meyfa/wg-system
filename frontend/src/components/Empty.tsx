interface Props {
  message: string
}

export default function Empty (props: Props): JSX.Element {
  return (
    <div className='my-6 py-12 px-6 text-center text-2xl font-light text-gray-600 bg-white/25 rounded shadow-md'>
      {props.message}
    </div>
  )
}
