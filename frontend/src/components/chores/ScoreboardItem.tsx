import { ReactElement, useCallback, useState } from 'react'
import { Scoreboard } from '../../store/entities/scoreboards'
import api from '../../api/api'
import EditScoreboardModal from './EditScoreboardModal'
import EditableItem from '../items/EditableItem'

interface Props {
  scoreboard: Scoreboard
}

export default function ScoreboardItem (props: Props): ReactElement {
  const [editing, setEditing] = useState(false)

  const showEditModal = useCallback(() => setEditing(true), [])
  const hideEditModal = useCallback(() => setEditing(false), [])

  const save = useCallback(async (entity: Scoreboard) => {
    setEditing(false)
    await api.scoreboards.update(entity)
  }, [])

  return (
    <EditableItem itemName={props.scoreboard.name} onClickEdit={showEditModal}>
      <EditScoreboardModal scoreboard={props.scoreboard} active={editing} onSave={save} onCancel={hideEditModal} />
    </EditableItem>
  )
}
