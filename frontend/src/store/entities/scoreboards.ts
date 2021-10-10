import { Selector } from '@reduxjs/toolkit'
import { createEntitySlice } from '../create-entity-slice'
import { RootState } from '../store'
import { Entity } from '../entity'

export interface ScoreboardScore {
  readonly memberId: string
  readonly offset: number
  readonly score: number
}

export interface Scoreboard extends Entity {
  readonly name: string
  readonly scores: readonly ScoreboardScore[]
}

const scoreboardsSlice = createEntitySlice<Scoreboard>('scoreboards')

export const scoreboardsActions = scoreboardsSlice.actions
export const selectScoreboards: Selector<RootState, Scoreboard[]> = state => state.scoreboards

export default scoreboardsSlice.reducer
