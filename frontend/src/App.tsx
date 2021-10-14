import { ReactElement } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import MembersPage from './pages/MembersPage'
import ChoresPage from './pages/ChoresPage'
import { membersActions } from './store/entities/members'
import { useApiSliceBridge } from './api-slice-bridge'
import { manualChoresActions } from './store/entities/manual-chores'
import ConnectionModal from './components/ConnectionModal'
import { scoreboardsActions } from './store/entities/scoreboards'
import { periodicChoresActions } from './store/entities/periodic-chores'

export default function App (): ReactElement {
  useApiSliceBridge('members', membersActions)
  useApiSliceBridge('manual-chores', manualChoresActions)
  useApiSliceBridge('scoreboards', scoreboardsActions)
  useApiSliceBridge('periodic-chores', periodicChoresActions)

  return (
    <BrowserRouter>
      <Switch>
        {/* home page */}
        <Route exact path='/'>
          <HomePage />
        </Route>

        {/* calendar page */}
        <Route exact path='/calendar'>
          <CalendarPage />
        </Route>
        <Route exact path='/calendar/:choreId'>
          <CalendarPage />
        </Route>

        {/* settings pages */}
        <Route exact path='/members'>
          <MembersPage />
        </Route>
        <Route exact path='/chores'>
          <ChoresPage />
        </Route>

        {/* page not found */}
        <Route>
          <Redirect to='/' />
        </Route>
      </Switch>

      {/* an overlay over the whole page displayed when connection is lost */}
      <ConnectionModal />
    </BrowserRouter>
  )
}
