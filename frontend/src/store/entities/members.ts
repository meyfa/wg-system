import { Selector } from '@reduxjs/toolkit'
import { createEntitySlice } from '../create-entity-slice'
import { RootState } from '../store'
import { Entity } from '../entity'

export interface Member extends Entity {
  name: string
}

const membersSlice = createEntitySlice<Member>('members')

export const membersActions = membersSlice.actions
export const selectMembers: Selector<RootState, Member[]> = state => state.members

export default membersSlice.reducer
