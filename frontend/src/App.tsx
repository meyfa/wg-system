import './App.css'
import { ReactElement } from 'react'
import NavigationBar from './components/NavigationBar'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MembersPage from './pages/MembersPage'
import CleaningPage from './pages/CleaningPage'
import GarbageDisposalPage from './pages/GarbageDisposalPage'
import { membersActions } from './store/entities/members'
import { useApiSliceBridge } from './api-slice-bridge'

export default function App (): ReactElement {
  useApiSliceBridge('members', membersActions)

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
