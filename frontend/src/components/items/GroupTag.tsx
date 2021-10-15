import './GroupTag.css'
import { ReactElement } from 'react'
import { useEntityById } from '../../util/use-entity-by-id'
import { selectGroups } from '../../store/entities/groups'
import Icon from '../Icon'
import { faTag } from '@fortawesome/free-solid-svg-icons'

interface Props {
  id: string
}

export default function GroupTag (props: Props): ReactElement {
  const group = useEntityById(selectGroups, props.id)
  if (group == null) {
    return <></>
  }
  return (
    <div className='GroupTag'>
      <Icon icon={faTag} /> {group.name}
    </div>
  )
}
