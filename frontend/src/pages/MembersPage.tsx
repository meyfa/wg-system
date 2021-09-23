import { ReactElement } from 'react'
import { useAppSelector } from '../store/store'
import { selectMembers } from '../store/entities/members'
import { useTranslation } from 'react-i18next'
import PageTitle from '../components/PageTitle'
import BasicButton from '../components/forms/BasicButton'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MemberItem from '../components/members/MemberItem'

export default function MembersPage (): ReactElement {
  const { t } = useTranslation()

  const members = useAppSelector(selectMembers)

  return (
    <div>
      <PageTitle title={t('members.title')}>
        <BasicButton onClick={() => {}}>
          <FontAwesomeIcon icon={faPlus} />
          {t('basicActions.add')}
        </BasicButton>
      </PageTitle>
      {members.map(member => (
        <MemberItem key={member._id} member={member} />
      ))}
    </div>
  )
}
