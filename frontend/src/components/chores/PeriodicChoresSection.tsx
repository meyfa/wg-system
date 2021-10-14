import { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../store/store'
import { PeriodicChore, selectPeriodicChores } from '../../store/entities/periodic-chores'
import api from '../../api/api'
import EditPeriodicChoreModal from './EditPeriodicChoreModal'
import Empty from '../Empty'
import PeriodicChoreItem from './PeriodicChoreItem'
import ChoresSection, { CreateModalRenderFn } from './ChoresSection'
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'

export default function PeriodicChoresSection (): ReactElement {
  const { t } = useTranslation()

  const periodicChores = useAppSelector(selectPeriodicChores)

  const renderCreateModal: CreateModalRenderFn = useCallback((active, hide) => {
    const create = async (entity: PeriodicChore): Promise<void> => {
      await api.periodicChores.create(entity)
      hide()
    }
    return <EditPeriodicChoreModal active={active} onSave={create} onCancel={hide} />
  }, [])

  return (
    <ChoresSection icon={faCalendarCheck} title={t('periodic.title')} renderCreateModal={renderCreateModal}>
      {periodicChores.length === 0 ? <Empty message={t('periodic.empty')} /> : undefined}
      {periodicChores.map(chore => <PeriodicChoreItem key={chore._id} chore={chore} />)}
    </ChoresSection>
  )
}
