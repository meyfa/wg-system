import { MouseEventHandler, ReactElement, ReactNode, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon'
import clsx from 'clsx'
import { useCurrentDay } from '../../hooks/periodic-chores/use-current-day'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export type CellRenderFn = (date: DateTime) => ReactNode
export type CellClickHandler = (date: DateTime) => void

type CalendarGrid = Array<Array<CalendarDaySpec | undefined>>

/**
 * Keys for week-day translations, found at `calendar.week.${weekday}`
 */
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

function CalendarHeader (): ReactElement {
  const { t } = useTranslation()

  return (
    <thead>
      <tr>
        {WEEKDAYS.map(weekday => (
          <th key={weekday} className='pt-1 pb-2 text-xl text-center font-normal'>
            {t(`calendar.week.${weekday}`)}
          </th>
        ))}
      </tr>
    </thead>
  )
}

interface CalendarDaySpec {
  date: DateTime
  children: ReactNode
}

function CalendarBody (props: { month: DateTime, renderCell?: CellRenderFn, onClickCell?: (date: DateTime) => void }): ReactElement {
  const { renderCell } = props

  const grid = useMemo(() => {
    const last = props.month.endOf('month')

    const rows: CalendarGrid = new Array(6).fill(undefined).map(() => new Array(7).fill(undefined))

    let offset = props.month.weekday - 1
    for (let cursor = props.month; cursor.toMillis() < last.toMillis(); cursor = cursor.plus({ days: 1 })) {
      rows[Math.trunc(offset / 7)][offset % 7] = {
        date: cursor,
        children: renderCell != null ? renderCell(cursor) : undefined
      }
      ++offset
    }

    return rows
  }, [props.month, renderCell])

  return (
    <tbody>
      {grid.map((row, i) => (
        <CalendarRow key={i} columns={row} onClickCell={props.onClickCell} />
      ))}
    </tbody>
  )
}

function CalendarRow (props: { columns: Array<CalendarDaySpec | undefined>, onClickCell?: CellClickHandler }): ReactElement {
  return (
    <tr>
      {props.columns.map((col, i) => (
        <CalendarCell key={i} spec={col} onClick={props.onClickCell} />
      ))}
    </tr>
  )
}

function CalendarCell (props: { spec?: CalendarDaySpec, onClick?: CellClickHandler }): ReactElement {
  const { spec, onClick } = props
  const handleClick = useCallback(() => {
    if (onClick != null && spec != null) {
      onClick(spec.date)
    }
  }, [onClick, spec])

  const today = useCurrentDay()
  const isToday = useMemo(() => spec?.date.hasSame(today, 'day') === true, [spec, today])
  const isInactive = spec == null
  const isClickable = spec != null && onClick != null

  return (
    <td
      className={clsx(
        'h-16 py-1 text-center align-top border-2 border-gray-200 outline outline-2 outline-transparent -outline-offset-2',
        isInactive && 'bg-gray-100',
        isToday && 'outline-gray-500',
        isClickable && 'cursor-pointer hocus:bg-[#f4f9ff] hocus:outline-[#81a4f5]'
      )}
      onClick={handleClick}
    >
      {spec?.date.day}
      {spec?.children}
    </td>
  )
}

function CalendarHeadButton (props: {
  onClick: MouseEventHandler
  icon: IconDefinition
}): ReactElement {
  return (
    <button onClick={props.onClick} className='inline-block w-8 h-8 border-2 border-transparent rounded-full cursor-pointer outline-none hocus:border-gray-400 hocus:shadow-md'>
      <Icon icon={props.icon} />
    </button>
  )
}

interface Props {
  renderCell?: CellRenderFn
  onClickCell?: CellClickHandler
}

export default function Calendar (props: Props): ReactElement {
  // first day of month
  const [month, setMonth] = useState(() => DateTime.now().startOf('month'))

  const previousMonth = useCallback(() => setMonth(m => m.minus({ months: 1 })), [])
  const nextMonth = useCallback(() => setMonth(m => m.plus({ months: 1 })), [])

  const monthName = useMemo(() => {
    return month.toLocaleString({
      year: 'numeric',
      month: 'long'
    })
  }, [month])

  return (
    <div className='text-base p-3 rounded bg-white shadow-lg overflow-x-auto'>
      {/* month selection */}
      <div className='text-xl mb-4 text-center whitespace-nowrap'>
        <CalendarHeadButton icon={faAngleLeft} onClick={previousMonth} />
        <div className='inline-block min-w-[10em] mx-4'>{monthName}</div>
        <CalendarHeadButton icon={faAngleRight} onClick={nextMonth} />
      </div>
      {/* calendar grid */}
      <table className='table-fixed border-collapse w-full min-w-[36rem]'>
        <CalendarHeader />
        <CalendarBody month={month} renderCell={props.renderCell} onClickCell={props.onClickCell} />
      </table>
    </div>
  )
}
