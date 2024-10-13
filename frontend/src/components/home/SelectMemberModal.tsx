import { ReactElement, useMemo } from 'react'
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
  const activeMembers = useMemo(() => members.filter((item) => item.active), [members])

  return (
    <Modal active={props.active}>
      <div className='mt-2 mb-8 text-center text-2xl'>
        {t('home.selectMember')}
      </div>
      <div className='grid max-w-4xl my-4 gap-2 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]'>
        {activeMembers.map((item) => <SelectMemberButton key={item._id} member={item} onSelect={props.onSelect} />)}
      </div>
      <div className='mt-6 text-center'>
        <BasicButton onClick={props.onCancel}>
          {t('basicActions.cancel')}
        </BasicButton>
      </div>
    </Modal>
  )
}
