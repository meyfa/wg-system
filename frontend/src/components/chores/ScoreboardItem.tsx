import { ReactElement, useCallback } from 'react'
import { Scoreboard } from '../../store/entities/scoreboards'
import api from '../../api/api'
import EditScoreboardModal from './EditScoreboardModal'
import EditableItem from '../items/EditableItem'
import { EditModalRenderFn } from '../items/EditButton'

interface Props {
  scoreboard: Scoreboard
}

export default function ScoreboardItem (props: Props): ReactElement {
  const renderModal: EditModalRenderFn = useCallback((active, hide) => {
    const save = async (entity: Scoreboard): Promise<void> => {
      hide()
      await api.scoreboards.update(entity)
    }
    return <EditScoreboardModal scoreboard={props.scoreboard} active={active} onSave={save} onCancel={hide} />
  }, [props.scoreboard])

  return (
    <EditableItem renderModal={renderModal}>
      {props.scoreboard.name}
    </EditableItem>
  )
}
