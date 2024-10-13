import {
  CaseReducer,
  CaseReducerActions,
  Comparer,
  createSlice,
  Draft,
  PayloadAction,
  Slice,
  SliceCaseReducers
} from '@reduxjs/toolkit'
import { Entity } from './entity'

export function defaultComparer (a: Entity | Draft<Entity>, b: Entity | Draft<Entity>): number {
  return a._id.localeCompare(b._id)
}

export type EntitySliceReducers<T extends Entity> = SliceCaseReducers<T[]> & {
  setEntities: CaseReducer<T[], PayloadAction<T[]>>
  createEntity: CaseReducer<T[], PayloadAction<T>>
  updateEntity: CaseReducer<T[], PayloadAction<T>>
  deleteEntity: CaseReducer<T[], PayloadAction<string>>
}

export type EntitySliceActions<T extends Entity> = CaseReducerActions<EntitySliceReducers<T>, string>

export function createEntitySlice<T extends Entity> (name: string, comparer: Comparer<T> = defaultComparer): Slice<T[], EntitySliceReducers<T>> {
  const comp = comparer as Comparer<T | Draft<T>>

  const insertOrUpdate = (entities: Draft<T[]>, action: PayloadAction<T>): void => {
    const index = entities.findIndex((e) => e._id === action.payload._id)
    if (index < 0) {
      entities.push(action.payload as Draft<T>)
    } else {
      entities.splice(index, 1, action.payload as Draft<T>)
    }
    entities.sort(comp)
  }

  return createSlice({
    name,
    initialState: [] as T[],
    reducers: {
      setEntities: (entities, action) => [...action.payload].sort(comp),
      createEntity: insertOrUpdate,
      updateEntity: insertOrUpdate,
      deleteEntity: (entities, action) => entities.filter((item) => item._id !== action.payload)
    }
  })
}
