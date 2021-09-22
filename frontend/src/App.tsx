import './App.css'
import { ReactElement, useEffect } from 'react'
import NavigationBar from './components/NavigationBar'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MembersPage from './pages/MembersPage'
import CleaningPage from './pages/CleaningPage'
import GarbageDisposalPage from './pages/GarbageDisposalPage'
import { useAppDispatch } from './store/store'
import { Member, membersActions } from './store/entities/members'
import { Entity } from './store/entity'

async function fetchEntityCollection<T extends Entity> (type: string): Promise<T[]> {
  const response = await fetch(`/api/${type}`)
  if (!response.ok) {
    throw new Error('error fetching collection: ' + type)
  }
  const { data } = await response.json()
  return data
}

const fetchMembers = async (): Promise<Member[]> => await fetchEntityCollection('members')

export default function App (): ReactElement {
  const dispatch = useAppDispatch()

  // make one initial request to load all entities
  // TODO replace this with a socket connection once available
  useEffect((async (): Promise<void> => {
    dispatch(membersActions.setEntities(await fetchMembers()))
  }) as () => void, [dispatch])

  return (
    <div className='App'>
      <BrowserRouter>
        <NavigationBar />

        <Switch>
          {/* home page */}
          <Route exact path='/'>
            <HomePage />
          </Route>

          {/* settings pages */}
          <Route exact path='/settings/members'>
            <MembersPage />
          </Route>
          <Route exact path='/settings/cleaning'>
            <CleaningPage />
          </Route>
          <Route exact path='/settings/garbage'>
            <GarbageDisposalPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}
