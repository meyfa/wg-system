import { Selector } from '@reduxjs/toolkit'
import { createEntitySlice } from '../create-entity-slice'
import { RootState } from '../store'
import { Entity } from '../entity'

export interface ManualChore extends Entity {
  name: string
  dueSince: number
  scoreboardId: string | null
}

const manualChoresSlice = createEntitySlice<ManualChore>('manual-chores')

export const manualChoresActions = manualChoresSlice.actions
export const selectManualChores: Selector<RootState, ManualChore[]> = state => state.manualChores

export default manualChoresSlice.reducer
