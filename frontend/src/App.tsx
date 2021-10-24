import { ReactElement } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import MembersPage from './pages/MembersPage'
import ChoresPage from './pages/ChoresPage'
import SettingsPage from './pages/SettingsPage'
import ConnectionModal from './components/ConnectionModal'
import { useApiSliceBridge } from './api-slice-bridge'
import { groupsActions } from './store/entities/groups'
import { membersActions } from './store/entities/members'
import { manualChoresActions } from './store/entities/manual-chores'
import { scoreboardsActions } from './store/entities/scoreboards'
import { periodicChoresActions } from './store/entities/periodic-chores'
import api from './api/api'

export default function App (): ReactElement {
  useApiSliceBridge(groupsActions, 'groups', api.groups)
  useApiSliceBridge(membersActions, 'members', api.members)
  useApiSliceBridge(manualChoresActions, 'manual-chores', api.manualChores)
  useApiSliceBridge(scoreboardsActions, 'scoreboards', api.scoreboards)
  useApiSliceBridge(periodicChoresActions, 'periodic-chores', api.periodicChores)

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
        <Route exact path='/settings'>
          <SettingsPage />
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
