import './NavigationBar.css'
import { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'

export default function NavigationBar (): ReactElement {
  return (
    <div className='NavigationBar'>
      <NavLink exact to='/'>Overview</NavLink>
      <hr className='NavigationBar-sep' />
      <NavLink exact to='/settings/members'>Members</NavLink>
      <NavLink exact to='/settings/cleaning'>Cleaning</NavLink>
      <NavLink exact to='/settings/garbage'>Garbage disposal</NavLink>
    </div>
  )
}
