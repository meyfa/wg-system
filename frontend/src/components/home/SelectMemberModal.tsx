import './SelectMemberModal.css'
import { ReactElement } from 'react'
import Modal from '../modals/Modal'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../store/store'
import { Member, selectMembers } from '../../store/entities/members'
import SelectMemberButton from './SelectMemberButton'
import BasicButton from '../forms/BasicButton'

interface Props {
  active: boolean
  onSelect: (member: Member) => void
  onCancel: () => void
}

export function SelectMemberModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const members = useAppSelector(selectMembers)

  return (
    <Modal active={props.active}>
      <div className='SelectMemberModal-title'>
        {t('home.selectMember')}
      </div>
      <div className='SelectMemberModal-choices'>
        {members.map(item => <SelectMemberButton key={item._id} member={item} onSelect={props.onSelect} />)}
      </div>
      <div className='SelectMemberModal-actions'>
        <BasicButton onClick={props.onCancel}>
          {t('basicActions.cancel')}
        </BasicButton>
      </div>
    </Modal>
  )
}
