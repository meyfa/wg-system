import './Calendar.css'
import { ReactElement, ReactNode, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon'
import clsx from 'clsx'
import { useCurrentDay } from '../../hooks/periodic-chores/use-current-day'

export type CellRenderFn = (date: DateTime) => ReactNode
export type CellClickHandler = (date: DateTime) => void

type CalendarGrid = Array<Array<CalendarDaySpec | undefined>>

/**
 * Keys for week-day translations, found at `calendar.week.${weekday}`
 */
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function CalendarHeader (): ReactElement {
  const { t } = useTranslation()

  return (
    <thead>
      <tr>
        {WEEKDAYS.map(weekday => (
          <th key={weekday} className='Calendar-th'>
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
  const isToday = useMemo(() => spec?.date != null && spec.date.hasSame(today, 'day'), [spec, today])

  if (spec == null) {
    return <td className='Calendar-td inactive' />
  }

  return (
    <td className={clsx('Calendar-td', { clickable: onClick != null, current: isToday })} onClick={handleClick}>
      {spec.date.day}
      {spec.children}
    </td>
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
    <div className='Calendar'>
      <div className='Calendar-head'>
        <button className='Calendar-head-btn' onClick={previousMonth}>
          <Icon icon={faAngleLeft} />
        </button>
        <div className='Calendar-head-month'>{monthName}</div>
        <button className='Calendar-head-btn' onClick={nextMonth}>
          <Icon icon={faAngleRight} />
        </button>
      </div>
      <table className='Calendar-table'>
        <CalendarHeader />
        <CalendarBody month={month} renderCell={props.renderCell} onClickCell={props.onClickCell} />
      </table>
    </div>
  )
}
