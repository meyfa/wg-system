import { Selector } from '@reduxjs/toolkit'
import { createEntitySlice } from '../create-entity-slice'
import { RootState } from '../store'
import { Entity } from '../entity'

export interface Group extends Entity {
  readonly name: string
}

const groupsSlice = createEntitySlice<Group>('groups')

export const groupsActions = groupsSlice.actions
export const selectGroups: Selector<RootState, Group[]> = (state) => state.groups

export default groupsSlice.reducer
