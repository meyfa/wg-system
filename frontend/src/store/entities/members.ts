import { Selector } from '@reduxjs/toolkit'
import { createEntitySlice } from '../create-entity-slice'
import { RootState } from '../store'
import { Entity } from '../entity'

export interface Member extends Entity {
  readonly name: string
  readonly color: string
  readonly active: boolean
  readonly scoreboardMultiplier?: number
  readonly groups: readonly string[]
}

const membersSlice = createEntitySlice<Member>('members')

export const membersActions = membersSlice.actions
export const selectMembers: Selector<RootState, Member[]> = state => state.members

export default membersSlice.reducer
