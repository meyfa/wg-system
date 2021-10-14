import { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../store/store'
import { ManualChore, selectManualChores } from '../../store/entities/manual-chores'
import api from '../../api/api'
import EditManualChoreModal from './EditManualChoreModal'
import Empty from '../Empty'
import ManualChoreItem from './ManualChoreItem'
import Section from '../Section'
import { faTasks } from '@fortawesome/free-solid-svg-icons'
import { EditModalRenderFn } from '../items/EditButton'

export default function ManualChoresSection (): ReactElement {
  const { t } = useTranslation()

  const manualChores = useAppSelector(selectManualChores)

  const renderCreateModal: EditModalRenderFn = useCallback((active, hide) => {
    const create = async (entity: ManualChore): Promise<void> => {
      await api.manualChores.create(entity)
      hide()
    }
    return <EditManualChoreModal active={active} onSave={create} onCancel={hide} />
  }, [])

  return (
    <Section icon={faTasks} title={t('manual.title')} renderCreateModal={renderCreateModal}>
      {manualChores.length === 0 ? <Empty message={t('manual.empty')} /> : undefined}
      {manualChores.map(chore => <ManualChoreItem key={chore._id} chore={chore} />)}
    </Section>
  )
}
