import { Editor, useEditor } from './use-editor'
import { Group } from '../store/entities/groups'

const DEFAULT: Group = {
  _id: '',
  name: ''
}

export function useGroupEditor (value?: Group): Editor<Group> {
  return useEditor({
    value,
    default: DEFAULT,
    validate: entity => {
      return entity.name.trim().length > 0
    }
  })
}
