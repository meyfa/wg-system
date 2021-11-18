import { ReactElement } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import MembersPage from './pages/MembersPage'
import ChoresPage from './pages/ChoresPage'
import SettingsPage from './pages/SettingsPage'
import ConnectionModal from './components/ConnectionModal'
import UpdateModal from './components/UpdateModal'
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
      <Routes>
        <Route path='/'>
          <Route index element={<HomePage />} />
          <Route path='calendar' element={<CalendarPage />}>
            <Route index element={<CalendarPage />} />
            <Route path=':choreId' element={<CalendarPage />} />
          </Route>
          <Route path='members' element={<MembersPage />} />
          <Route path='chores' element={<ChoresPage />} />
          <Route path='settings' element={<SettingsPage />} />
        </Route>
        <Route path='*' element={<Navigate replace to='/' />} />
      </Routes>

      <ConnectionModal />
      <UpdateModal />
    </BrowserRouter>
  )
}
