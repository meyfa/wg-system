import { Editor, useEditor } from './use-editor'
import { Scoreboard } from '../store/entities/scoreboards'

const DEFAULT: Scoreboard = {
  _id: '',
  name: '',
  scores: []
}

export function useScoreboardEditor (value?: Scoreboard): Editor<Scoreboard> {
  return useEditor({
    value,
    default: DEFAULT,
    validate: entity => {
      return entity.name.trim().length > 0
    }
  })
}
