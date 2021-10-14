import './NavigationBar.css'
import { Fragment, MouseEventHandler, ReactElement, useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBroom, faCalendarAlt, faHome, faTimes, faUsers } from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

interface NavItem {
  icon: IconDefinition
  label: string
  path: string
  exact: boolean
}

const NAVIGATION: NavItem[][] = [
  [
    { icon: faHome, label: 'home.title', path: '/', exact: true }
  ],
  [
    { icon: faCalendarAlt, label: 'calendar.title', path: '/calendar', exact: false }
  ],
  [
    { icon: faUsers, label: 'members.title', path: '/members', exact: true },
    { icon: faBroom, label: 'chores.title', path: '/chores', exact: true }
  ]
]

function NavigationBarSeparator (): ReactElement {
  return (
    <hr className='NavigationBar-sep' />
  )
}

function NavigationBarLink (props: { item: NavItem, onClick?: MouseEventHandler<HTMLElement> }): ReactElement {
  const { t } = useTranslation()

  const { item, onClick } = props

  return (
    <NavLink exact={item.exact} to={item.path} className='NavigationBar-link' onClick={onClick}>
      <span className='NavigationBar-link-icon'>
        <FontAwesomeIcon icon={item.icon} />
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
          <FontAwesomeIcon icon={active ? faTimes : faBars} />
        </button>
        {/* item groups */}
        {NAVIGATION.map((group, i) => (
          <Fragment key={i}>
            <NavigationBarSeparator />
            {group.map((item, j) => <NavigationBarLink key={j} item={item} onClick={close} />)}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
