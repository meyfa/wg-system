import './NavigationBar.css'
import { MouseEventHandler, ReactElement, useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { faBars, faBroom, faCalendarAlt, faCog, faHome, faTimes, faUsers } from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import Icon from './Icon'

interface NavItem {
  icon: IconDefinition
  label: string
  path: string
  end: boolean
}

const NAVIGATION: NavItem[] = [
  { icon: faHome, label: 'home.title', path: '/', end: true },
  { icon: faCalendarAlt, label: 'calendar.title', path: '/calendar', end: false },
  { icon: faUsers, label: 'members.title', path: '/members', end: true },
  { icon: faBroom, label: 'chores.title', path: '/chores', end: true },
  { icon: faCog, label: 'settings.title', path: '/settings', end: true }
]

function NavigationBarLink (props: { item: NavItem, onClick?: MouseEventHandler<HTMLElement> }): ReactElement {
  const { t } = useTranslation()

  const { item, onClick } = props

  return (
    <NavLink end={item.end} to={item.path} className='NavigationBar-link' onClick={onClick}>
      <span className='NavigationBar-link-icon'>
        <Icon icon={item.icon} />
      </span>
      <span className='NavigationBar-link-label'>{t(item.label)}</span>
    </NavLink>
  )
}

export default function NavigationBar (): ReactElement {
  const { t } = useTranslation()

  const [active, setActive] = useState(false)

  const toggle = useCallback(() => setActive(state => !state), [])
  const close = useCallback(() => setActive(false), [])

  const handleClickInner: MouseEventHandler = useCallback(event => event.stopPropagation(), [])

  return (
    <div className={clsx('NavigationBar', { active })} onClick={close}>
      <div className='NavigationBar-inner' onClick={handleClickInner}>
        {/* hamburger button */}
        <button className='NavigationBar-toggle' onClick={toggle}>
          <span className='NavigationBar-toggle-label'>{t('navigation')}</span>
          <Icon icon={active ? faTimes : faBars} />
        </button>
        {/* item groups */}
        {NAVIGATION.map((item, i) => (
          <NavigationBarLink key={i} item={item} onClick={close} />
        ))}
      </div>
    </div>
  )
}
