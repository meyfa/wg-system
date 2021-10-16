import './ItemTag.css'
import { ReactElement } from 'react'
import Icon from '../Icon'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faSortAmountUp, faUserTag } from '@fortawesome/free-solid-svg-icons'
import { useEntityById } from '../../util/use-entity-by-id'
import { selectGroups } from '../../store/entities/groups'
import { selectScoreboards } from '../../store/entities/scoreboards'

interface Props {
  icon: IconDefinition
  text?: string
}

export default function ItemTag (props: Props): ReactElement {
  if (props.text == null) {
    return <></>
  }
  return (
    <div className='ItemTag'>
      <Icon icon={props.icon} /> {props.text}
    </div>
  )
}

ItemTag.Group = function Group (props: { id?: string | null }): ReactElement {
  const group = useEntityById(selectGroups, props.id)
  return (
    <ItemTag icon={faUserTag} text={group?.name} />
  )
}

ItemTag.Scoreboard = function Scoreboard (props: { id?: string | null }): ReactElement {
  const scoreboard = useEntityById(selectScoreboards, props.id)
  return (
    <ItemTag icon={faSortAmountUp} text={scoreboard?.name} />
  )
}
