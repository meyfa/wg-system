import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import manualChores from './entities/manual-chores'
import members from './entities/members'
import periodicChores from './entities/periodic-chores'
import scoreboards from './entities/scoreboards'
import groups from './entities/groups'

export const store = configureStore({
  reducer: {
    groups,
    members,
    manualChores,
    scoreboards,
    periodicChores
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
