import { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import { useAppSelector } from '../store/store'
import api from '../api/api'
import { PeriodicChore, selectPeriodicChores } from '../store/entities/periodic-chores'
import BasicButton from '../components/forms/BasicButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import EditPeriodicChoreModal from '../components/cleaning/EditPeriodicChoreModal'
import PeriodicChoreItem from '../components/cleaning/PeriodicChoreItem'

export default function CleaningPage (): ReactElement {
  const { t } = useTranslation()

  const periodicChores = useAppSelector(selectPeriodicChores)

  const [creating, setCreating] = useState(false)
  const showCreateModal = useCallback(() => setCreating(true), [])
  const hideCreateModal = useCallback(() => setCreating(false), [])

  const create = useCallback(async (entity: PeriodicChore) => {
    await api.periodicChores.create(entity)
    setCreating(false)
  }, [])

  return (
    <NavigationBarLayout centered>
      <Title title={t('cleaning.title')}>
        <BasicButton onClick={showCreateModal}>
          <FontAwesomeIcon icon={faPlus} />
          {t('basicActions.add')}
        </BasicButton>
      </Title>
      <EditPeriodicChoreModal active={creating} onSave={create} onCancel={hideCreateModal} />
      {periodicChores.map(chore => <PeriodicChoreItem key={chore._id} chore={chore} />)}
    </NavigationBarLayout>
  )
}
