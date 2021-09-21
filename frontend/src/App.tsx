import './App.css'
import { ReactElement } from 'react'
import NavigationBar from './components/NavigationBar'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MembersPage from './pages/MembersPage'
import CleaningPage from './pages/CleaningPage'
import GarbageDisposalPage from './pages/GarbageDisposalPage'

export default function App (): ReactElement {
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
