import { CaseReducer, Comparer, createSlice, Draft, PayloadAction, Slice, SliceCaseReducers } from '@reduxjs/toolkit'
import { Entity } from './entity'

function defaultComparer (a: Entity, b: Entity): number {
  return a._id.localeCompare(b._id)
}

export interface EntitySliceReducers<T extends Entity> extends SliceCaseReducers<T[]> {
  setEntities: CaseReducer<T[], PayloadAction<T[]>>
  createEntity: CaseReducer<T[], PayloadAction<T>>
  updateEntity: CaseReducer<T[], PayloadAction<T>>
  deleteEntity: CaseReducer<T[], PayloadAction<string>>
}

export function createEntitySlice<T extends Entity> (name: string, comparer?: Comparer<T>): Slice<T[], EntitySliceReducers<T>> {
  const comp = (comparer ?? defaultComparer) as Comparer<T | Draft<T>>

  return createSlice({
    name: name,
    initialState: [] as T[],
    reducers: {
      setEntities: (entities, action) => {
        entities.splice(0, entities.length, ...(action.payload as Draft<T[]>))
        entities.sort(comp)
      },
      createEntity: (entities, action) => {
        if (entities.every(item => item._id !== action.payload._id)) {
          entities.push(action.payload as Draft<T>)
          entities.sort(comp)
        }
      },
      updateEntity: (entities, action) => {
        const index = entities.findIndex(e => e._id === action.payload._id)
        if (index >= 0) {
          entities.splice(index, 1, action.payload as Draft<T>)
          entities.sort(comp)
        }
      },
      deleteEntity: (entities, action) => {
        const index = entities.findIndex(e => e._id === action.payload)
        if (index >= 0) {
          entities.splice(index, 1)
        }
      }
    }
  })
}
