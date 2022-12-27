import {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import clsx from 'clsx'

function useOffsetHeight<E extends HTMLElement> (ref: RefObject<E>): number | undefined {
  const [height, setHeight] = useState<number | undefined>()

  const recompute = useCallback(() => {
    if (ref.current != null) {
      ref.current.style.alignSelf = 'start'
      setHeight(ref.current.offsetHeight)
      ref.current.style.alignSelf = ''
    }
  }, [ref])

  useLayoutEffect(recompute, [recompute])

  useEffect(() => {
    const interval = setInterval(recompute, 2000)
    return () => clearInterval(interval)
  }, [recompute])

  return height
}

interface Props {
  title: ReactNode
  urgent?: boolean
}

export default function ChoreBox (props: PropsWithChildren<Props>): ReactElement {
  const box = useRef<HTMLDivElement>(null)
  const height = useOffsetHeight(box)

  return (
    <div
      ref={box}
      className={clsx(
        'p-2 rounded shadow-lg border-t-4',
        props.urgent === true ? 'bg-rose-50 border-t-red-500' : 'bg-white border-t-transparent'
      )}
      style={{ gridRowEnd: height != null ? `span ${Math.ceil(height / 40)}` : 'span 1' }}
    >
      <div className='text-2xl leading-none mb-3'>
        {props.title}
      </div>
      {props.children}
    </div>
  )
}
