import './NavigationBar.css'
import { ReactElement, useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBroom, faHome, faTimes, faTrashAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface NavItem {
  icon: IconDefinition
  label: string
  path: string
}

const NAVIGATION: NavItem[][] = [
  [
    { icon: faHome, label: 'Overview', path: '/' }
  ],
  [
    { icon: faUsers, label: 'Members', path: '/settings/members' },
    { icon: faBroom, label: 'Cleaning', path: '/settings/cleaning' },
    { icon: faTrashAlt, label: 'Garbage disposal', path: '/settings/garbage' }
  ]
]

export default function NavigationBar (): ReactElement {
  const [active, setActive] = useState(false)

  const toggle = useCallback(() => setActive(state => !state), [])
  const close = useCallback(() => setActive(false), [])

  return (
    <div className={'NavigationBar' + (active ? ' active' : '')}>
      <div className='NavigationBar-inner'>
        {/* hamburger button */}
        <button className='NavigationBar-toggle' onClick={toggle}>
          <span className='NavigationBar-toggle-label'>Navigation</span>
          <FontAwesomeIcon icon={active ? faTimes : faBars} />
        </button>
        {/* item groups */}
        {NAVIGATION.flatMap((group, i) => [
          <hr key={`${i}-sep`} className='NavigationBar-sep' />,
          ...group.map((item, j) => (
            <NavLink key={`${i}-${j}`} exact to={item.path} className='NavigationBar-link' onClick={close}>
              <span className='NavigationBar-link-icon'>
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <span className='NavigationBar-link-label'>{item.label}</span>
            </NavLink>
          ))
        ])}
      </div>
    </div>
  )
}
