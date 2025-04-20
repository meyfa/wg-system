import { ReactElement } from 'react'
import clsx from 'clsx'

const COLOR_OPTIONS = [
  '#ed90a4',
  '#eeab65',
  '#c7a76c',
  '#5e8b68',
  '#4fbf85',
  '#28bbd7',
  '#a79fe1',
  '#c699e7',
  '#a8a8a8'
]

interface Props {
  value?: string
  onPick: (color: string) => void
}

export default function ColorPicker (props: Props): ReactElement {
  return (
    <div className='inline-flex align-middle flex-wrap gap-1 p-1'>
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color}
          className={clsx(
            'w-7 h-7 border-2 cursor-pointer',
            props.value === color ? 'rounded-sm scale-100 border-black' : 'rounded-lg scale-90 border-transparent hocus:rounded-sm hocus:scale-100'
          )}
          style={{ backgroundColor: color }}
          onClick={() => props.onPick(color)}
        />
      ))}
    </div>
  )
}
