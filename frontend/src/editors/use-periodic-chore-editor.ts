import { Editor, useEditor } from './use-editor'
import { PeriodicChore } from '../store/entities/periodic-chores'

const DEFAULT: PeriodicChore = {
  _id: '',
  name: '',
  period: 7,
  entries: []
}

export function usePeriodicChoreEditor (value?: PeriodicChore): Editor<PeriodicChore> {
  return useEditor({
    value,
    default: DEFAULT,
    validate: entity => {
      return entity.name.trim().length > 0 && Number.isSafeInteger(entity.period) && entity.period > 0
    }
  })
}
