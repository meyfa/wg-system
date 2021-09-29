import { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageTitle from '../components/PageTitle'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import { useAppSelector } from '../store/store'
import { ManualChore, selectManualChores } from '../store/entities/manual-chores'
import api from '../api/api'
import BasicButton from '../components/forms/BasicButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import EditManualChoreModal from '../components/garbage/EditManualChoreModal'
import ManualChoreItem from '../components/garbage/ManualChoreItem'

export default function GarbageDisposalPage (): ReactElement {
  const { t } = useTranslation()

  const manualChores = useAppSelector(selectManualChores)

  const [creating, setCreating] = useState(false)

  const showCreateModal = useCallback(() => setCreating(true), [])
  const hideCreateModal = useCallback(() => setCreating(false), [])

  const create = useCallback(async (entity: ManualChore) => {
    await api.manualChores.create(entity)
    setCreating(false)
  }, [])

  return (
    <NavigationBarLayout centered>
      <PageTitle title={t('garbage.title')}>
        <BasicButton onClick={showCreateModal}>
          <FontAwesomeIcon icon={faPlus} />
          {t('basicActions.add')}
        </BasicButton>
      </PageTitle>
      <EditManualChoreModal active={creating} onSave={create} onCancel={hideCreateModal} />
      {manualChores.map(chore => (
        <ManualChoreItem key={chore._id} chore={chore} />
      ))}
    </NavigationBarLayout>
  )
}
