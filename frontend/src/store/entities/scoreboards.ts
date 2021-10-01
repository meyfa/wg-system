import { Selector } from '@reduxjs/toolkit'
import { createEntitySlice } from '../create-entity-slice'
import { RootState } from '../store'
import { Entity } from '../entity'

export interface Scoreboard extends Entity {
  name: string
  scores: Array<{
    memberId: string
    offset: number
    score: number
  }>
}

const scoreboardsSlice = createEntitySlice<Scoreboard>('scoreboards')

export const scoreboardsActions = scoreboardsSlice.actions
export const selectScoreboards: Selector<RootState, Scoreboard[]> = state => state.scoreboards

export default scoreboardsSlice.reducer
