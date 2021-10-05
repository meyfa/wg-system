import { ReactElement } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MembersPage from './pages/MembersPage'
import CleaningPage from './pages/CleaningPage'
import GarbageDisposalPage from './pages/GarbageDisposalPage'
import { membersActions } from './store/entities/members'
import { useApiSliceBridge } from './api-slice-bridge'
import { manualChoresActions } from './store/entities/manual-chores'
import ConnectionModal from './components/ConnectionModal'
import { scoreboardsActions } from './store/entities/scoreboards'

export default function App (): ReactElement {
  useApiSliceBridge('members', membersActions)
  useApiSliceBridge('manual-chores', manualChoresActions)
  useApiSliceBridge('scoreboards', scoreboardsActions)

  return (
    <BrowserRouter>
      <Switch>
        {/* home page */}
        <Route exact path='/'>
          <HomePage />
        </Route>

        {/* settings pages */}
        <Route exact path='/members'>
          <MembersPage />
        </Route>
        <Route exact path='/cleaning'>
          <CleaningPage />
        </Route>
        <Route exact path='/garbage'>
          <GarbageDisposalPage />
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
