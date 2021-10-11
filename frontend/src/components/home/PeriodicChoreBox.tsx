import './PeriodicChoreBox.css'
import { ReactElement, useCallback, useState } from 'react'
import ChoreBox from './ChoreBox'
import { PeriodicChore } from '../../store/entities/periodic-chores'
import { useEntityById } from '../../util/use-entity-by-id'
import { Member, selectMembers } from '../../store/entities/members'
import { useTranslation } from 'react-i18next'
import BasicButton from '../forms/BasicButton'
import api from '../../api/api'
import { SelectMemberModal } from './SelectMemberModal'

interface Props {
  chore: PeriodicChore
}

export default function PeriodicChoreBox (props: Props): ReactElement {
  const { t } = useTranslation()

  const last = props.chore.entries.length > 0
    ? props.chore.entries[props.chore.entries.length - 1]
    : undefined

  const lastMember = useEntityById(selectMembers, last?.memberId)
  // get only date part from ISO date-time string
  const lastDate = last != null && last.date.length >= 10 ? last.date.substring(0, 10) : '???'

  const [isSelectingMember, setSelectingMember] = useState(false)

  const startMarkDone = useCallback(() => setSelectingMember(true), [])
  const cancelMarkDone = useCallback(() => setSelectingMember(false), [])

  const markDone = useCallback(async (member: Member) => {
    await api.periodicChores.update({
      ...props.chore,
      entries: [
        ...props.chore.entries,
        {
          memberId: member._id,
          date: new Date().toISOString()
        }
      ]
    })
  }, [props.chore])

  const confirmMarkDone = useCallback(async (member?: Member) => {
    setSelectingMember(false)
    if (member != null) {
      await markDone(member)
    }
  }, [markDone])

  return (
    <ChoreBox className='PeriodicChoreBox'>
      <div className='PeriodicChoreBox-title'>
        {props.chore.name}
      </div>
      <div className='PeriodicChoreBox-detail'>
        {t('home.chores.last')}<br />
        {last != null && lastMember != null ? `${lastMember.name}, ${lastDate}` : '--'}
      </div>
      <div>
        <BasicButton onClick={startMarkDone}>
          {t('home.chores.markDone')}
        </BasicButton>
      </div>
      <SelectMemberModal active={isSelectingMember} onSelect={confirmMarkDone} onCancel={cancelMarkDone} />
    </ChoreBox>
  )
}
