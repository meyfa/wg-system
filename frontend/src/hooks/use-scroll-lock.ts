import { RefObject, useEffect } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

/**
 * A custom hook that disables body scrolling. The provided reference is for allowing scroll inside a chosen
 * foreground element, such as a modal. Only when the ref is set will the hook be able to work.
 *
 * @param ref The element ref.
 * @param active Whether the scroll lock should be active.
 */
export function useScrollLock (ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (ref.current != null) {
      const element = ref.current
      if (active) {
        disableBodyScroll(element, { reserveScrollBarGap: true })
        // cleanup function
        return () => enableBodyScroll(element)
      } else {
        enableBodyScroll(element)
      }
    }
  }, [ref, active])
}
