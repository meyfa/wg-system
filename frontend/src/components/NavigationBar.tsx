import './NavigationBar.css'
import { MouseEventHandler, ReactElement, useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import Icon from './Icon'
import { NavItem, useNavItems } from '../navigation'

function NavigationBarLink (props: { item: NavItem, onClick?: MouseEventHandler<HTMLElement> }): ReactElement {
  const { item, onClick } = props

  return (
    <NavLink end={item.end} to={item.path} className='NavigationBar-link' onClick={onClick}>
      <span className='NavigationBar-link-icon'>
        <Icon icon={item.icon} />
      </span>
      <span className='NavigationBar-link-label'>{item.label}</span>
    </NavLink>
  )
}

export default function NavigationBar (): ReactElement {
  const { t } = useTranslation()

  const [active, setActive] = useState(false)

  const toggle = useCallback(() => setActive((state) => !state), [])
  const close = useCallback(() => setActive(false), [])

  const handleClickInner: MouseEventHandler = useCallback((event) => event.stopPropagation(), [])

  const navItems = useNavItems()

  return (
    <div className={clsx('NavigationBar', { active })} onClick={close}>
      <div className='NavigationBar-inner' onClick={handleClickInner}>
        {/* hamburger button */}
        <button className='NavigationBar-toggle' onClick={toggle}>
          <span className='NavigationBar-toggle-label'>{t('navigation')}</span>
          <Icon icon={active ? faTimes : faBars} />
        </button>
        {/* item groups */}
        {navItems.map((item, i) => (
          <NavigationBarLink key={i} item={item} onClick={close} />
        ))}
      </div>
    </div>
  )
}
