import { ReactElement, useCallback } from 'react'
import { Scoreboard } from '../../store/entities/scoreboards'
import { api } from '../../api/api'
import EditScoreboardModal from './EditScoreboardModal'
import EditableItem from '../items/EditableItem'
import { EditModalRenderFn } from '../items/EditButton'

interface Props {
  scoreboard: Scoreboard
}

export default function ScoreboardItem (props: Props): ReactElement {
  const onDelete = useCallback(() => {
    void api.scoreboards.delete(props.scoreboard._id)
  }, [props.scoreboard._id])

  const renderModal: EditModalRenderFn = useCallback((active, hide) => {
    const save = (entity: Scoreboard): void => {
      hide()
      void api.scoreboards.update(entity)
    }
    return <EditScoreboardModal scoreboard={props.scoreboard} active={active} onSave={save} onCancel={hide} onDelete={onDelete} />
  }, [props.scoreboard, onDelete])

  return (
    <EditableItem renderModal={renderModal}>
      {props.scoreboard.name}
    </EditableItem>
  )
}
