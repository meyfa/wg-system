import './ColorPicker.css'
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
    <div className='ColorPicker'>
      {COLOR_OPTIONS.map(color => (
        <button
          key={color}
          className={clsx('ColorPicker-btn', { selected: props.value === color })}
          style={{ backgroundColor: color }}
          onClick={() => props.onPick(color)}
        />
      ))}
    </div>
  )
}
