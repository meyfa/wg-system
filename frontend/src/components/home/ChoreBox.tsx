import './ChoreBox.css'
import {
  CSSProperties,
  PropsWithChildren,
  ReactElement,
  RefObject, useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
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
  className?: string
  urgent?: boolean
}

export default function ChoreBox (props: PropsWithChildren<Props>): ReactElement {
  const box = useRef<HTMLDivElement>(null)

  const height = useOffsetHeight(box)

  const style: CSSProperties = useMemo(() => {
    const rows = height != null ? Math.ceil(height / 40) : 1
    return { gridRowEnd: `span ${rows}` }
  }, [height])

  return (
    <div ref={box}
         className={clsx('ChoreBox', props.className, { urgent: props.urgent })}
         style={style}>
      {props.children}
    </div>
  )
}
