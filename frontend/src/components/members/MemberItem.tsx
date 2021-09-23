import './MemberItem.css'
import { ReactElement } from 'react'
import { Member } from '../../store/entities/members'
import BasicButton from '../forms/BasicButton'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

interface Props {
  member: Member
}

export default function MemberItem (props: Props): ReactElement {
  const { t } = useTranslation()

  return (
    <div className='MemberItem'>
      <div className='MemberItem-name'>
        {props.member.name}
      </div>
      <div className='MemberItem-actions'>
        <BasicButton>
          <FontAwesomeIcon icon={faEdit} />
          {t('basicActions.edit')}
        </BasicButton>
      </div>
    </div>
  )
}
