import { Member } from '../store/entities/members'
import { Editor, useEditor } from './use-editor'

const DEFAULT: Member = {
  _id: '',
  name: '',
  color: '#000000',
  active: true
}

export function useMemberEditor (value?: Member): Editor<Member> {
  return useEditor({
    value,
    default: DEFAULT,
    validate: entity => {
      return entity.name.trim().length > 0 && /^#[0-9a-fA-F]{6}$/.test(entity.color)
    }
  })
}
