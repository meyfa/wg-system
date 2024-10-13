import { Editor, useEditor } from './use-editor'
import { ManualChore } from '../store/entities/manual-chores'

const DEFAULT: ManualChore = {
  _id: '',
  name: '',
  scoreboardId: null,
  dueSince: 0
}

export function useManualChoreEditor (value?: ManualChore): Editor<ManualChore> {
  return useEditor({
    value,
    default: DEFAULT,
    validate: (entity) => {
      return entity.name.trim().length > 0 && entity.dueSince >= 0
    }
  })
}
