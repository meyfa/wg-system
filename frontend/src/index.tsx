import { createRoot } from 'react-dom/client'
import React from 'react'
import './i18n'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store/store'

const container = document.getElementById('root')
if (container == null) {
  throw new Error('container == null')
}

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
