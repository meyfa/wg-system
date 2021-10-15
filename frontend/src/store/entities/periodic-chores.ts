import { Selector } from '@reduxjs/toolkit'
import { createEntitySlice } from '../create-entity-slice'
import { RootState } from '../store'
import { Entity } from '../entity'

export interface PeriodicChoreEntry {
  readonly memberId: string
  readonly date: string
}

export interface PeriodicChore extends Entity {
  readonly name: string
  readonly period: number
  readonly groups: readonly string[]
  readonly entries: readonly PeriodicChoreEntry[]
}

const periodicChoresSlice = createEntitySlice<PeriodicChore>('periodic-chores')

export const periodicChoresActions = periodicChoresSlice.actions
export const selectPeriodicChores: Selector<RootState, PeriodicChore[]> = state => state.periodicChores

export default periodicChoresSlice.reducer
